/* Ludlud Kokpit — lu duduk di kokpit pesawat, kaca depannya menghadap kota 2050 (klip Google Flow Veo 3.1 Lite, 20 Nov 2026).
 * Tiap gedung platform = satu gedung/papan iklan ASLI di video (titik di DEPAN). Pencet tujuan di dasbor → pesawat "terbang"
 * (video maju ke detik gedung itu + zoom), lalu papan panel nempel di gedungnya dan layar kokpit (#ruang) terbuka lewat onTiba.
 * Kontrak: window.LudludKotaVideo.render(el, { kavling:[{no,rumah}], agen, kegiatan, onTiba(no|null), onBerangkat(no), onAgen(nama) })
 */
(function () {
  var GAYA = {
    studio: ['🎬', 'Studio', '#ffc94d'], mesin: ['⚙️', 'Mesin', '#9fb4d9'], youtube: ['▶️', 'YouTube', '#ff4d5e'],
    instagram: ['📸', 'Instagram', '#ff6ad5'], tiktok: ['🎵', 'TikTok', '#25f4ee'], facebook: ['👍', 'Facebook', '#4d8dff'],
    threads: ['🧵', 'Threads', '#f2f2f2'], x: ['✖️', 'X', '#d6dbe3'], shopee: ['🛍️', 'Shopee', '#ff7a45'],
    tokopedia: ['🦉', 'Tokopedia', '#4ee36a'], lazada: ['💙', 'Lazada', '#8f8cff'], linkedin: ['💼', 'LinkedIn', '#4fb0ff'],
    pinterest: ['📌', 'Pinterest', '#ff5470'], gudang: ['📦', 'Gudang', '#e0a35a'], kantor: ['📊', 'Kantor', '#4fe0c8'],
    toko: ['🏪', 'Toko', '#ffd27a'], clipper: ['✂️', 'Clipper', '#ffe14d'], hook: ['🪝', 'Judul & Hook', '#7ef9ff'],
    caption: ['💬', 'Caption', '#b892ff'], lain: ['🏢', 'Gedung', '#b892ff']
  };
  // gedung/papan iklan asli di klip: t = detik, u/v = posisi di bingkai video (0..1). Diukur dari cuplikan berkisi.
  var DEPAN = {
    'kota-tegak': [{ t: 0.5, u: 0.28, v: 0.35 }, { t: 2.5, u: 0.25, v: 0.33 }, { t: 4.5, u: 0.22, v: 0.30 }, { t: 6.5, u: 0.15, v: 0.26 }, { t: 2.5, u: 0.88, v: 0.30 }, { t: 4.5, u: 0.64, v: 0.22 }],
    'kota-lebar': [{ t: 0.5, u: 0.26, v: 0.43 }, { t: 2.5, u: 0.11, v: 0.33 }, { t: 2.5, u: 0.87, v: 0.36 }, { t: 6.5, u: 0.25, v: 0.38 }, { t: 0.5, u: 0.72, v: 0.42 }, { t: 6.5, u: 0.80, v: 0.47 }]
  };
  var DASBOR = 132; // tinggi dasbor kokpit (px)
  var CSS = '#kv{position:absolute;inset:0;overflow:hidden;background:#140c26}'
    + '#kv video{position:absolute;left:0;top:0;width:100%;height:100%;max-height:none;border-radius:0;object-fit:cover;transform-origin:0 0;will-change:transform}'
    + '#kv .kv-warp{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .35s;background:repeating-conic-gradient(from 0deg at 50% 40%,rgba(190,250,255,.0) 0 3deg,rgba(190,250,255,.35) 3.4deg 4deg,rgba(190,250,255,0) 4.4deg 9deg);-webkit-mask:radial-gradient(circle at 50% 40%,transparent 12%,#000 60%);mask:radial-gradient(circle at 50% 40%,transparent 12%,#000 60%)}'
    + '#kv.lompat .kv-warp{opacity:1}#kv.lompat video{filter:blur(2px) brightness(1.15)}'
    + '#kv svg.kv-kaca{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}'
    + '#kv .kv-bidik{position:absolute;left:50%;top:40%;width:64px;height:64px;margin:-32px 0 0 -32px;border:1.5px solid rgba(126,249,255,.55);border-radius:50%;pointer-events:none;transition:opacity .3s}'
    + '#kv .kv-bidik:before,#kv .kv-bidik:after{content:"";position:absolute;background:rgba(126,249,255,.7)}#kv .kv-bidik:before{left:50%;top:-14px;bottom:-14px;width:1.5px}#kv .kv-bidik:after{top:50%;left:-14px;right:-14px;height:1.5px}'
    + '#kv .kv-papan{position:absolute;left:0;top:0;transform:translate(-50%,-100%);opacity:0;transition:opacity .4s;pointer-events:none;text-align:center}'
    + '#kv .kv-papan.ada{opacity:1}'
    + '#kv .kv-papan .kartu-g{display:inline-block;min-width:150px;padding:10px 14px;border-radius:14px;color:#fff;font:600 12px/1.35 system-ui,-apple-system,sans-serif;background:linear-gradient(160deg,var(--w) -70%,rgba(10,12,32,.82) 60%);border:1.5px solid var(--w);box-shadow:0 0 22px -2px var(--w);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}'
    + '#kv .kv-papan .kartu-g b{display:block;font-size:16px;margin:2px 0}#kv .kv-papan .kartu-g i{font-style:normal;font-size:26px}'
    + '#kv .kv-papan .kartu-g .uang{display:block;margin-top:6px;padding-top:6px;border-top:1px solid rgba(255,255,255,.2);color:#ffe27a;font-size:11.5px;text-align:left}'
    + '#kv .kv-papan .kunci{width:90px;height:90px;margin:8px auto 0;border:2px solid var(--w);border-radius:8px;box-shadow:0 0 18px var(--w),inset 0 0 18px -6px var(--w);animation:kvkunci 1.6s infinite}'
    + '@keyframes kvkunci{50%{transform:scale(.88)}}'
    + '#kv .kv-dasbor{position:absolute;left:0;right:0;bottom:0;height:' + DASBOR + 'px;padding:10px 12px calc(8px + env(safe-area-inset-bottom));'
    + 'background:linear-gradient(180deg,#2a2f45 0,#141827 14%,#0b0e1a 100%);border-top:2px solid rgba(126,249,255,.5);border-radius:46% 46% 0 0/26px 26px 0 0;box-shadow:0 -10px 30px rgba(0,0,0,.6),inset 0 2px 0 rgba(255,255,255,.08);display:flex;flex-direction:column;gap:8px;z-index:2}'
    + '#kv .kv-alat{display:flex;gap:8px;align-items:center;height:52px}'
    + '#kv .kv-radar{flex:0 0 52px;height:52px;border-radius:50%;border:1.5px solid #3fe0c5;background:radial-gradient(circle,#0c2b2a 0,#061514 70%);position:relative;overflow:hidden;box-shadow:inset 0 0 10px #3fe0c5}'
    + '#kv .kv-radar:after{content:"";position:absolute;inset:0;background:conic-gradient(from 0deg,rgba(63,224,197,.6),rgba(63,224,197,0) 70deg);animation:kvputar 2.4s linear infinite;border-radius:50%}'
    + '@keyframes kvputar{to{transform:rotate(360deg)}}'
    + '#kv .kv-layar{flex:1;min-width:0;height:52px;border-radius:10px;background:#04130f;border:1.5px solid rgba(63,224,197,.6);box-shadow:inset 0 0 12px rgba(63,224,197,.35);color:#7dffe0;font:700 12px/1.35 ui-monospace,Menlo,monospace;padding:6px 10px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}'
    + '#kv .kv-layar small{display:block;color:#3fe0c5;font-size:10px;letter-spacing:.08em}'
    + '#kv .kv-angka{flex:0 0 auto;display:flex;gap:6px}#kv .kv-angka span{width:54px;height:52px;border-radius:10px;background:#140a04;border:1.5px solid rgba(255,170,60,.6);color:#ffb84d;font:800 15px/1 ui-monospace,Menlo,monospace;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;box-shadow:inset 0 0 10px rgba(255,170,60,.3)}'
    + '#kv .kv-angka span small{font-size:9px;color:#c98a3a;letter-spacing:.08em}'
    + '#kv .kv-dok{display:flex;gap:7px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px}#kv .kv-dok::-webkit-scrollbar{display:none}'
    + '#kv .kv-dok button{flex:0 0 auto;font:800 12px/1 system-ui,-apple-system,sans-serif;color:#e9fdff;background:linear-gradient(180deg,#283049,#151a2b);border:1.5px solid var(--w,#7ef9ff);border-radius:9px;padding:10px 11px;cursor:pointer;white-space:nowrap;box-shadow:0 3px 0 #05070e,0 0 10px -3px var(--w,#7ef9ff)}'
    + '#kv .kv-dok button:active{transform:translateY(2px);box-shadow:0 1px 0 #05070e}'
    + '#kv .kv-dok button.aktif{background:var(--w,#7ef9ff);color:#08101e;box-shadow:0 0 16px var(--w,#7ef9ff)}'
    + '#kendaliKota .kk-joy{position:fixed;left:16px;bottom:' + (DASBOR + 16) + 'px;width:100px;height:100px;border-radius:50%;background:rgba(126,249,255,.12);border:2px solid rgba(126,249,255,.65);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);z-index:15;touch-action:none;cursor:grab;transition:opacity .3s}'
    + '#kendaliKota .kk-joy div{position:absolute;left:50%;top:50%;width:38px;height:38px;margin:-19px 0 0 -19px;border-radius:50%;background:#e9fdff;box-shadow:0 0 14px #7ef9ff}'
    + '#kendaliKota .kk-tombol{position:fixed;right:14px;bottom:' + (DASBOR + 16) + 'px;display:flex;flex-direction:column;gap:9px;z-index:15;transition:opacity .3s}'
    + '#kendaliKota button{width:44px;height:44px;border-radius:50%;border:2px solid rgba(126,249,255,.65);background:rgba(14,16,40,.6);color:#e9fdff;font:900 20px/1 system-ui;cursor:pointer;padding:0}'
    + '#kendaliKota.sembunyi>*{opacity:0;pointer-events:none}';

  // bingkai kaca depan kokpit: rangka gelap di tepi, sudut tumpul, garis neon di bibir kaca
  var KACA = '<svg class="kv-kaca" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><defs>'
    + '<linearGradient id="kvr" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#1c2134"/><stop offset="1" stop-color="#07090f"/></linearGradient></defs>'
    + '<path fill="url(#kvr)" fill-rule="evenodd" d="M0 0H100V100H0Z M7 9 Q50 1 93 9 L97 62 Q96 84 90 90 L10 90 Q4 84 3 62 Z"/>'
    + '<path fill="none" stroke="#7ef9ff" stroke-opacity=".55" stroke-width=".35" vector-effect="non-scaling-stroke" d="M7 9 Q50 1 93 9 L97 62 Q96 84 90 90 L10 90 Q4 84 3 62 Z"/>'
    + '<path fill="none" stroke="#000" stroke-opacity=".5" stroke-width="1.6" d="M50 2.6 V7"/>'
    + '<g fill="#3a4160">' + [12, 24, 36, 64, 76, 88].map(function (x) { return '<circle cx="' + x + '" cy="' + (x < 50 ? 6.6 - (x - 12) * 0.06 : 4.6 + (x - 64) * 0.06) + '" r=".45"/>'; }).join('') + '</g></svg>';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function buat(el) {
    var gaya = document.createElement('style'); gaya.textContent = CSS; document.head.appendChild(gaya);
    var kv = document.createElement('div'); kv.id = 'kv';
    kv.innerHTML = '<video muted playsinline autoplay loop preload="auto" aria-hidden="true"></video><div class="kv-warp"></div><div class="kv-papan"></div><div class="kv-bidik"></div>' + KACA
      + '<div class="kv-dasbor"><div class="kv-alat"><div class="kv-radar" aria-hidden="true"></div><div class="kv-layar"><small>NAVIGASI</small><span class="kv-lok">Pangkalan</span></div>'
      + '<div class="kv-angka"><span><b class="kv-alt">120</b><small>ALT m</small></span><span><b class="kv-spd">0</b><small>KM/J</small></span></div></div><nav class="kv-dok" aria-label="Tujuan terbang"></nav></div>';
    el.replaceChildren(kv);
    var q = function (s) { return kv.querySelector(s); };
    var st = { kv: kv, vid: q('video'), papan: q('.kv-papan'), bidik: q('.kv-bidik'), dok: q('.kv-dok'), lok: q('.kv-lok'), alt: q('.kv-alt'), spd: q('.kv-spd'),
      joy: { x: 0, y: 0, id: null }, z: 1, tx: 0, ty: 0, px: 0, py: 0, zoomPad: 1, tujuan: null, lokasi: null, tombol: {} };
    var pilihKlip = function () {
      var nama = innerWidth / innerHeight < 1 ? 'kota-tegak' : 'kota-lebar';
      if (st.klip === nama) return; st.klip = nama; st.vid.poster = nama + '.jpg'; st.vid.src = nama + '.mp4';
      var p = st.vid.play(); if (p && p.catch) p.catch(function () {});
      if (st.lokasi != null) terbang(st, st.lokasi, true);
    };
    pilihKlip(); addEventListener('resize', pilihKlip);
    addEventListener('pointerdown', function () { if (st.vid.paused && st.lokasi == null) st.vid.play().catch(function () {}); }, { once: true });

    st.dok.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || b.hasAttribute('data-ganti-kota')) return;
      if (b.dataset.a) { st.data && st.data.onAgen && st.data.onAgen(b.dataset.a); return; }
      terbang(st, b.dataset.t ? +b.dataset.t : null);
    });

    // tongkat kemudi (pad) + ＋ － ⌂
    var kendali = document.createElement('div'); kendali.id = 'kendaliKota';
    kendali.innerHTML = '<div class="kk-joy" title="Tongkat kemudi"><div></div></div><div class="kk-tombol"><button data-k="+" title="Dekatkan">＋</button><button data-k="-" title="Jauhkan">－</button><button data-k="0" title="Pangkalan">⌂</button></div>';
    document.body.appendChild(kendali); st.kendali = kendali;
    var joyEl = kendali.firstElementChild, bola = joyEl.firstElementChild;
    var gerakJoy = function (e) {
      var r = joyEl.getBoundingClientRect(), dx = (e.clientX - r.left - r.width / 2) / (r.width / 2), dy = (e.clientY - r.top - r.height / 2) / (r.height / 2), n = Math.hypot(dx, dy);
      if (n > 1) { dx /= n; dy /= n; } if (n < 0.15) dx = dy = 0;
      st.joy.x = dx; st.joy.y = dy; bola.style.transform = 'translate(' + dx * 31 + 'px,' + dy * 31 + 'px)';
    };
    joyEl.addEventListener('pointerdown', function (e) { e.preventDefault(); st.joy.id = e.pointerId; try { joyEl.setPointerCapture(e.pointerId); } catch (x) {} gerakJoy(e); });
    joyEl.addEventListener('pointermove', function (e) { if (e.pointerId === st.joy.id) gerakJoy(e); });
    var lepas = function () { st.joy.id = null; st.joy.x = st.joy.y = 0; bola.style.transform = ''; };
    joyEl.addEventListener('pointerup', lepas); joyEl.addEventListener('pointercancel', lepas);
    kendali.lastElementChild.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.k === '+') st.zoomPad = Math.min(2, st.zoomPad * 1.25);
      else if (b.dataset.k === '-') st.zoomPad = Math.max(1, st.zoomPad / 1.25);
      else terbang(st, null);
    });
    addEventListener('keydown', function (e) { if (!/input|textarea|select/i.test(e.target.tagName)) st.tombol[e.key.toLowerCase()] = 1; });
    addEventListener('keyup', function (e) { st.tombol[e.key.toLowerCase()] = 0; });

    var akhir = performance.now(), hitung = 0;
    (function putar(sk) {
      requestAnimationFrame(putar);
      var dt = Math.min(0.05, (sk - akhir) / 1000); akhir = sk; if (!dt) return;
      var W = innerWidth, H = innerHeight, tb = st.tombol;
      var jx = st.joy.x + (tb.d || tb.arrowright ? 1 : 0) - (tb.a || tb.arrowleft ? 1 : 0), jy = st.joy.y + (tb.s || tb.arrowdown ? 1 : 0) - (tb.w || tb.arrowup ? 1 : 0);
      if (jx || jy) { st.px -= jx * W * 0.5 * dt; st.py -= jy * H * 0.5 * dt; }
      // sasaran kamera: di pangkalan pemandangan penuh; di tujuan, gedungnya ditarik ke tengah atas kaca depan
      var zT = st.zoomPad, txT = 0, tyT = 0, a = st.tujuan && titikLayar(st, st.tujuan);
      if (a) { zT *= 2.1; txT = W * 0.5 - zT * a.x; tyT = H * 0.3 - zT * a.y; }
      else { txT = W * (1 - zT) / 2; tyT = H * (1 - zT) * 0.4; }
      txT += st.px; tyT += st.py;
      txT = Math.min(0, Math.max(W * (1 - zT), txT)); tyT = Math.min(0, Math.max(H * (1 - zT), tyT));
      st.px = Math.max(-W, Math.min(W, st.px)); st.py = Math.max(-H, Math.min(H, st.py));
      var k = Math.min(1, dt * 3.2), z0 = st.z, x0 = st.tx, y0 = st.ty;
      st.z += (zT - st.z) * k; st.tx += (txT - st.tx) * k; st.ty += (tyT - st.ty) * k;
      st.vid.style.transform = 'translate(' + st.tx.toFixed(1) + 'px,' + st.ty.toFixed(1) + 'px) scale(' + st.z.toFixed(4) + ')';
      // papan panel menempel tepat di gedung tujuan
      if (a) { st.papan.style.left = (st.tx + st.z * a.x).toFixed(1) + 'px'; st.papan.style.top = (st.ty + st.z * a.y + 50).toFixed(1) + 'px'; }
      if (!(hitung++ % 10)) {
        var laju = Math.hypot(st.tx - x0, st.ty - y0, (st.z - z0) * 400) / dt;
        st.spd.textContent = Math.round(Math.min(999, laju * 0.6 + 240 * Math.max(0, st.vid.paused ? 0 : 1)));
        st.alt.textContent = Math.round(160 - (st.z - 1) * 90);
      }
      st.bidik.style.opacity = st.lokasi == null ? 1 : 0;
      st.kendali.classList.toggle('sembunyi', document.body.classList.contains('tiba'));
    })(akhir);
    return st;
  }

  // posisi (px, sebelum zoom) sebuah titik video u,v pada layar dengan object-fit:cover
  function titikLayar(st, d) {
    var v = st.vid, vw = v.videoWidth || (st.klip === 'kota-tegak' ? 720 : 1280), vh = v.videoHeight || (st.klip === 'kota-tegak' ? 1280 : 720);
    var W = innerWidth, H = innerHeight, s = Math.max(W / vw, H / vh);
    return { x: (W - vw * s) / 2 + d.u * vw * s, y: (H - vh * s) / 2 + d.v * vh * s };
  }

  function urutan(st) { var u = []; for (var no = 1; no <= 12; no++) if (st.peta[no]) u.push(no); return u; }
  function depanUntuk(st, no) {
    var daftar = DEPAN[st.klip] || DEPAN['kota-lebar'], i = urutan(st).indexOf(no);
    if (i < 0) i = urutan(st).length + (no % 3); // lahan kosong: gedung sisa
    return daftar[i % daftar.length];
  }

  function terbang(st, no, diam) {
    var d = st.data;
    st.lokasi = no; st.px = st.py = 0; st.zoomPad = 1; st.papan.classList.remove('ada');
    if (!diam && d && d.onBerangkat) d.onBerangkat(no);
    gambarDok(st);
    if (no == null) { st.tujuan = null; st.lok.textContent = 'Pangkalan'; st.vid.play().catch(function () {}); if (!diam && d && d.onTiba) d.onTiba(null); return; }
    var tuj = depanUntuk(st, no), r = st.peta[no], g = r ? (GAYA[r.jenis] || GAYA.lain) : ['＋', 'Lahan kosong', '#7ef9ff'];
    st.lok.textContent = '→ ' + (r ? r.nama || g[1] : 'Lahan kosong ' + no);
    // lompatan: kilatan warp sambil video maju ke detik gedung tujuan
    st.kv.classList.add('lompat'); st.tujuan = null;
    setTimeout(function () {
      try { st.vid.pause(); st.vid.currentTime = tuj.t; } catch (x) {}
      st.tujuan = tuj;
      setTimeout(function () { st.kv.classList.remove('lompat'); }, 250);
      setTimeout(function () {
        if (st.lokasi !== no) return;
        var j = r && r.jumlah || {}, baris;
        if (!r) baris = 'Lahan kosong · siap dibangun';
        else if (r.keadaan === 'usul') baris = '💡 usulan ' + esc(r.oleh || 'agen');
        else if (r.jenis === 'studio' || r.jenis === 'mesin') baris = '🎞️ ' + (r.antre || 0) + ' antre · ⚡ ' + (r.sibuk ? 'lagi kerja' : 'santai');
        else if (r.keadaan === 'buka') baris = '✅ ' + (j.tayang || 0) + ' tayang · ⏳ ' + (j.siap_cek || 0) + ' siap dicek · 📅 ' + (j.disetujui || 0);
        else baris = '🔌 belum disambung';
        st.papan.style.setProperty('--w', (r && r.warna) || g[2]);
        // platform penghasil uang: status monetisasi + pendapatan; tanpa data asli tulis jujur "belum tersambung"
        if (r && /^(youtube|instagram|tiktok|facebook|shopee|tokopedia|lazada)$/.test(r.jenis))
          baris += '<span class="uang">💰 Monetisasi: ' + esc(r.monetisasi || 'belum dicek') + '<br>Pendapatan: '
            + (r.pendapatan != null ? 'Rp ' + Number(r.pendapatan).toLocaleString('id-ID') + (r.periode ? ' / ' + esc(r.periode) : '') : 'Rp — (belum tersambung)') + '</span>';
        st.papan.innerHTML = '<div class="kartu-g"><i>' + g[0] + '</i><b>' + esc(r ? r.nama || g[1] : 'Lahan kosong') + '</b>' + baris + '</div><div class="kunci"></div>';
        st.papan.classList.add('ada'); st.lok.textContent = '📍 ' + (r ? r.nama || g[1] : 'Lahan kosong ' + no);
        if (!diam && d && d.onTiba) d.onTiba(no);
      }, 1100);
    }, diam ? 0 : 380);
  }

  function gambarDok(st) {
    var h = '<button data-t="" class="' + (st.lokasi == null ? 'aktif' : '') + '">🏠 Pangkalan</button>', kosong = 0;
    for (var no = 1; no <= 12; no++) {
      var r = st.peta[no]; if (!r) { kosong = kosong || no; continue; }
      var g = GAYA[r.jenis] || GAYA.lain;
      h += '<button data-t="' + no + '" style="--w:' + esc(r.warna || g[2]) + '" class="' + (st.lokasi === no ? 'aktif' : '') + '">' + (r.keadaan === 'usul' ? '💡 ' : g[0] + ' ') + esc(r.nama || g[1]) + '</button>';
    }
    if (kosong) h += '<button data-t="' + kosong + '" class="' + (st.lokasi === kosong ? 'aktif' : '') + '">＋ Lahan</button>';
    h += '<button data-a="YOSUA" style="--w:#ffc94d">📻 Asisten</button>';
    st.dok.innerHTML = h;
  }

  window.LudludKotaVideo = {
    render: function (el, data) {
      if (!el.__kv) el.__kv = buat(el);
      var st = el.__kv, peta = {}; (data.kavling || []).forEach(function (k) { if (k && k.no >= 1 && k.no <= 12) peta[k.no] = k.rumah; });
      st.peta = peta; st.data = data;
      var kunci = JSON.stringify(data.kavling); if (st.kunci !== kunci) { st.kunci = kunci; gambarDok(st); }
    }
  };
})();
