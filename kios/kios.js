/* Buku Kios — pengganti claude.use() biar app-nya jalan di luar Claude.
   Semua data & baca-foto lewat satu pintu (Edge Function). Kunci tidak pernah ada di HP. */
(function(){
  'use strict';

  var PINTU = 'https://njghzieuuopukuagrswu.supabase.co/functions/v1/kios-api';
  var JEDA = 5000;

  // NAMA kios, bukan kata sandi. Halaman ini terbit di repo publik, jadi apa pun yang ditulis di sini
  // bisa dibaca siapa saja — menaruh "rahasia" di sini cuma keamanan bohong-bohongan.
  // Penjagaannya ada di server: permintaan cuma dilayani kalau datang dari halaman ocklu.com,
  // dan perintah pemilik (ganti kode, ekspor, impor borongan) tetap butuh kunci yang tidak ada di sini.
  // Artinya: siapa pun yang tahu alamat halaman ini bisa ikut mencatat. Itu memang yang dipilih.
  var KIOS = 'kokukusan';

  // ---------- pita kabar (jujur kalau ada yang mati) ----------
  var pita;
  // `tetap` = kabar yang tidak boleh terhapus sendiri oleh penyegaran data 5 detikan.
  // Tanpa ini, pesan "baca-foto lagi mati" hilang sebelum sempat dibaca orang di depan kios.
  function kabar(teks, jenis, tetap){
    if(!pita){
      pita = document.createElement('div');
      pita.style.cssText = 'position:fixed;left:0;right:0;top:0;z-index:9999;padding:9px 30px 9px 14px;font:13px/1.4 system-ui,sans-serif;text-align:center;display:none;cursor:pointer';
      pita.title = 'Ketuk buat menutup';
      pita.onclick = function(){ pita.dataset.tetap=''; pita.style.display='none'; };
      document.body.appendChild(pita);
    }
    if(!teks){
      if(pita.dataset.tetap) return;        // jangan hapus kabar penting
      pita.style.display='none';
      return;
    }
    pita.dataset.tetap = tetap ? '1' : '';
    pita.textContent = teks;
    pita.style.background = jenis==='buruk' ? '#c62828' : '#8d6e00';
    pita.style.color = '#fff';
    pita.style.display = 'block';
  }

  // ---------- kalau link ini sudah dicabut ----------
  // Tidak menawarkan ketik kode: pemakainya penjaga kios, bukan teknisi. Yang berguna buat dia
  // cuma satu kalimat: link ini mati, minta yang baru.
  function linkMati(){
    document.body.innerHTML =
      '<div style="max-width:420px;margin:60px auto;padding:24px;font:16px/1.6 system-ui,sans-serif;text-align:center">' +
      '<h2 style="margin:0 0 10px">Buku Kios</h2>' +
      '<p style="color:#666">Link ini sudah tidak berlaku.<br>Minta link baru ke pemilik kios.</p></div>';
  }

  // ---------- deteksi mode "Situs desktop" ----------
  // Di mode itu browser HP MENGABAIKAN <meta viewport> dan memaksa halaman selebar ~980px,
  // jadi semuanya mengecil dan tombol baru bisa dipencet setelah di-zoom. Tidak bisa dimatikan
  // dari kode — yang bisa dilakukan cuma memberitahu, daripada pemakainya menyangka app-nya rusak.
  function cekModeDesktop(){
    try{
      var layar = (window.screen && screen.width) || 0;
      if(layar && layar < 500 && window.innerWidth > layar * 1.6){
        kabar('HP lagi pakai mode "Situs desktop" — itu yang bikin tampilan kekecilan. '
            + 'Matikan lewat menu ⋮ browser (hilangkan centang "Situs desktop"), lalu muat ulang.',
            'buruk', true);
      }
    }catch(e){}
  }

  // ---------- panggil pintu ----------
  var sedangBangun = false;
  async function panggil(aksi, isi){
    var jawab;
    try{
      jawab = await fetch(PINTU, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(Object.assign({ kios: KIOS, aksi: aksi }, isi||{}))
      });
    }catch(e){
      kabar('Tidak bisa nyambung ke server — cek sinyal. Catatan belum tersimpan.', 'buruk');
      throw e;
    }
    if(jawab.status === 401 || jawab.status === 429){
      linkMati();
      throw new Error('link tidak berlaku');
    }
    if(jawab.status === 503 || jawab.status === 504){
      if(!sedangBangun){ sedangBangun = true; kabar('Server lagi bangun, tunggu ±30 detik...'); }
      throw new Error('server tidur');
    }
    if(!jawab.ok){
      var pesan = await jawab.text();
      kabar('Server menolak: ' + pesan.slice(0,120), 'buruk');
      throw new Error(pesan);
    }
    sedangBangun = false;
    return jawab.json();
  }

  // ---------- db ----------
  var pendengar = [];   // {koleksi, urut, arah, batas, cb, errCb, sidik}
  var poller = null;

  function kumpul(nama){
    return {
      add: async function(data){
        var r = await panggil('add', { koleksi: nama, data: data });
        segarkan();
        return { id: r.id };
      },
      doc: function(id){
        return {
          update: async function(data){ await panggil('update', { koleksi:nama, id:id, data:data }); segarkan(); },
          delete: async function(){ await panggil('hapus', { koleksi:nama, id:id }); segarkan(); }
        };
      },
      orderBy: function(medan, arah){ return tanya(nama, medan, arah||'asc', 0); }
    };
  }

  function tanya(nama, medan, arah, batas){
    return {
      limit: function(n){ return tanya(nama, medan, arah, n); },
      onSnapshot: function(cb, errCb){
        pendengar.push({ koleksi:nama, urut:medan, arah:arah, batas:batas, cb:cb, errCb:errCb, sidik:null });
        mulaiPoll();
        return function(){ pendengar = pendengar.filter(function(p){ return p.cb !== cb; }); };
      }
    };
  }

  function mulaiPoll(){
    if(poller) return;
    // tunggu satu putaran supaya KETIGA pendengar (produk, transaksi, tutup buku) sempat daftar
    // dulu — kalau ditembak sekarang, cuma koleksi pertama yang keambil.
    setTimeout(segarkan, 0);
    poller = setInterval(function(){
      if(document.hidden) return;          // HP di saku = nol panggilan
      segarkan();
    }, JEDA);
    document.addEventListener('visibilitychange', function(){ if(!document.hidden) segarkan(); });
  }

  var lagiAmbil = false;
  async function segarkan(){
    if(!pendengar.length || lagiAmbil) return;
    lagiAmbil = true;
    try{
      // dikunci ke daftar saat permintaan dikirim — kalau pendengar berubah di tengah jalan,
      // hasilnya tidak nyasar ke koleksi yang salah
      var aktif = pendengar.slice();
      var minta = aktif.map(function(p){
        return { koleksi:p.koleksi, urut:p.urut, arah:p.arah, batas:p.batas };
      });
      var hasil = await panggil('lihat', { daftar: minta });
      hasil.hasil.forEach(function(isi, i){
        var p = aktif[i];
        if(!p) return;
        var sidik = JSON.stringify(isi);
        if(sidik === p.sidik) return;       // tidak berubah, jangan gambar ulang
        p.sidik = sidik;
        p.cb({ docs: isi.map(function(d){ return { id:d.id, data:function(){ return d.data; } }; }) });
      });
      kabar('');
    }catch(e){
      pendengar.forEach(function(p){ if(p.errCb) p.errCb(e); });
      if(pita && !pita.textContent) kabar('Data belum kebaca — coba tarik ulang halaman.', 'buruk');
    }finally{
      lagiAmbil = false;
    }
  }

  // ---------- baca foto (AI) ----------
  // Foto HP itu 4-12 MB dan sering HEIC (iPhone). Dikirim mentah, badannya membengkak 33% jadi
  // base64 dan gampang ditolak server atau otak AI-nya. Dikecilkan dulu di HP: sisi terpanjang
  // 2000px sudah lebih dari cukup buat membaca tulisan tangan, hasilnya ratusan KB, dan lewat
  // canvas formatnya otomatis jadi JPEG — HEIC ikut beres.
  function kecilkan(file, sisiMax, mutu){
    return new Promise(function(res, rej){
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function(){
        var skala = Math.min(1, sisiMax / Math.max(img.width, img.height));
        var l = Math.max(1, Math.round(img.width * skala));
        var t = Math.max(1, Math.round(img.height * skala));
        var c = document.createElement('canvas');
        c.width = l; c.height = t;
        c.getContext('2d').drawImage(img, 0, 0, l, t);
        URL.revokeObjectURL(url);
        c.toBlob(function(b){
          if(b) res(b); else rej(new Error('foto gagal dimampatkan'));
        }, 'image/jpeg', mutu);
      };
      img.onerror = function(){
        URL.revokeObjectURL(url);
        rej(new Error('foto tidak bisa dibuka di HP ini'));
      };
      img.src = url;
    });
  }

  function keBase64(file){
    return new Promise(function(res, rej){
      var fr = new FileReader();
      fr.onload = function(){ res(String(fr.result).split(',')[1]); };
      fr.onerror = rej;
      fr.readAsDataURL(file);
    });
  }

  var SAMPLE = {
    limits: async function(){
      // Dua hal yang dua-duanya pernah bikin rusak:
      // 1. `mediaTypes` WAJIB ada — app memanggil .join() langsung; kalau tidak ada, slot foto
      //    gagal digambar tanpa pesan galat apa pun.
      // 2. Isinya harus 'image/*', BUKAN daftar tipe satu-satu. Nilai ini masuk ke atribut
      //    accept, dan HP cuma menawarkan "jepret sekarang" kalau acceptnya image/* —
      //    daftar spesifik bikin yang muncul cuma galeri/berkas.
      return {
        images: { mediaTypes: ['image/*'], maxFileSize: 8*1024*1024, maxCount: 1 },
        maxTokens: 4096
      };
    },
    json: async function(prompt, opsi){
      var file = (opsi && opsi.images && opsi.images[0]) || null;
      if(!file) throw new Error('tidak ada foto');

      var kecil, mime = 'image/jpeg';
      try{
        kecil = await kecilkan(file, 2000, 0.9);
      }catch(e){
        // HP tidak sanggup membuka formatnya (mis. HEIC di browser lama). Kirim apa adanya
        // kalau masih kecil; kalau besar, berhenti di sini dengan sebab yang jelas.
        if(file.size > 4*1024*1024){
          kabar('Foto ini kegedean & formatnya tidak kebaca di HP ini. Coba foto ulang pakai kamera app ini.', 'buruk', true);
          var e0 = new Error('foto tidak terbaca di HP'); e0.code = 'image_rejected'; throw e0;
        }
        kecil = file; mime = file.type || 'image/jpeg';
      }

      var b64 = await keBase64(kecil);
      var r;
      try{
        r = await panggil('baca-foto', { prompt: prompt, gambar: b64, mime: mime });
      }catch(err){
        kabar('Baca-foto gagal: ' + err.message + '. Catat manual dulu — angkanya jangan ditebak.', 'buruk', true);
        throw err;
      }
      if(r.error){
        kabar('Baca-foto lagi mati: ' + r.error + '. Catat manual dulu, jangan nebak angka.', 'buruk', true);
        var e2 = new Error(r.error); e2.code = 'otak_mati'; throw e2;
      }
      kabar('');
      return r.hasil;
    }
  };

  // ---------- pasang ----------
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', cekModeDesktop);
  }else{
    cekModeDesktop();
  }
  window.claude = {
    use: async function(apa){
      if(apa === 'db') return { collection: kumpul };
      if(apa === 'sample') return SAMPLE;
      return null;
    }
  };

})();
