/* Ludlud Kota Video — latar layar penuh dari klip AI kota 2050 (Google Flow, Veo 3.1 Lite, dibuat 20 Nov 2026),
 * ditimpa layar-layar kaca platform yang bisa diketuk. Kontrak data sama dengan ludlud-kota3d.js / ludlud-kota.js:
 * window.LudludKotaVideo.render(el, { kavling:[{no,rumah}], agen:[{nama,warna}], kegiatan:[{agen,dari,ke,label}], onLahan, onRumah, onAgen })
 * Klip: kota-tegak.mp4 (HP) / kota-lebar.mp4 (laptop), dibuat bolak-balik supaya putarannya tidak meloncat.
 * Pad joystick menggeser kamera (pan), ＋/－ mendekat/menjauh, ⌂ kembali; menggulir halaman = terbang mendekat ke kota.
 */
(function () {
  var GAYA = {
    studio: ['🎬', 'Studio', '#ffc94d'], mesin: ['⚙️', 'Mesin', '#9fb4d9'], youtube: ['▶️', 'YouTube', '#ff4d5e'],
    instagram: ['📸', 'Instagram', '#ff6ad5'], tiktok: ['🎵', 'TikTok', '#25f4ee'], facebook: ['👍', 'Facebook', '#4d8dff'],
    threads: ['🧵', 'Threads', '#f2f2f2'], x: ['✖️', 'X', '#d6dbe3'], shopee: ['🛍️', 'Shopee', '#ff7a45'],
    tokopedia: ['🦉', 'Tokopedia', '#4ee36a'], lazada: ['💙', 'Lazada', '#8f8cff'], linkedin: ['💼', 'LinkedIn', '#4fb0ff'],
    pinterest: ['📌', 'Pinterest', '#ff5470'], gudang: ['📦', 'Gudang', '#e0a35a'], kantor: ['📊', 'Kantor', '#4fe0c8'],
    toko: ['🏪', 'Toko', '#ffd27a'], lain: ['🏢', 'Gedung', '#b892ff']
  };
  var CSS = '#kv{position:absolute;inset:0;overflow:hidden;background:#140c26}'
    + '#kv video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform-origin:50% 40%;will-change:transform}'
    + '#kv .kv-gelap{position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,8,30,.25) 0,rgba(10,8,30,0) 25%,rgba(10,8,30,.15) 45%,rgba(8,8,24,.85) 75%);pointer-events:none;transition:background .3s}'
    + '#kv .kv-baris{position:absolute;left:0;right:0;top:0;display:flex;gap:12px;overflow-x:auto;padding:8px 16px 14px;scroll-snap-type:x mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch}'
    + '#kv .kv-baris::-webkit-scrollbar{display:none}'
    + '#kv .kv-l{flex:0 0 104px;height:150px;scroll-snap-align:start;border-radius:14px;padding:9px 9px 8px;color:#fff;font:600 11px/1.3 system-ui,-apple-system,sans-serif;'
    + 'background:linear-gradient(160deg,var(--w) -60%,rgba(12,12,34,.72) 55%);border:1.5px solid var(--w);box-shadow:0 0 16px -2px var(--w),inset 0 0 18px -8px var(--w);'
    + 'backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);cursor:pointer;display:flex;flex-direction:column;text-align:left;position:relative}'
    + '#kv .kv-l b{font-size:13px;font-weight:800;margin-top:auto}#kv .kv-l i{font-style:normal;font-size:30px;line-height:1;margin:6px 0 4px}'
    + '#kv .kv-l .rec{font-size:9px;font-weight:800;letter-spacing:.06em;opacity:.9}#kv .kv-l .rec:before{content:"";display:inline-block;width:7px;height:7px;border-radius:50%;background:#ff3b30;margin-right:4px;animation:kvkedip 1.4s infinite}'
    + '#kv .kv-l.kosong{--w:#7ef9ff;border-style:dashed;background:rgba(10,20,40,.4);justify-content:center;align-items:center;text-align:center;box-shadow:none}'
    + '#kv .kv-l.usul{--w:#7ef9ff;border-style:dashed;animation:kvdenyut 2s infinite}'
    + '#kv .kv-l .lencana{position:absolute;top:-7px;right:-6px;background:#ff4d5e;color:#fff;border-radius:99px;padding:1px 7px;font-size:10px;font-weight:800}'
    + '#kv .kv-agen{position:absolute;left:0;top:0;white-space:nowrap;font:800 11px system-ui,sans-serif;color:#fff;background:rgba(8,10,26,.7);border:1.5px solid var(--w);border-radius:99px;padding:4px 9px 4px 6px;box-shadow:0 0 12px -2px var(--w);cursor:pointer;animation:kvterbang var(--d) linear infinite;animation-delay:var(--t)}'
    + '@keyframes kvterbang{0%{transform:translate(-40vw,var(--y))}50%{transform:translate(50vw,calc(var(--y) - 3vh))}100%{transform:translate(120vw,var(--y))}}'
    + '@keyframes kvkedip{50%{opacity:.25}}@keyframes kvdenyut{50%{box-shadow:0 0 24px 2px var(--w)}}'
    + '#kendaliKota .kk-joy{position:fixed;left:18px;bottom:40px;width:116px;height:116px;border-radius:50%;background:rgba(126,249,255,.14);border:2px solid rgba(126,249,255,.7);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);z-index:15;touch-action:none;cursor:grab;box-shadow:0 0 18px rgba(126,249,255,.35);transition:opacity .3s}'
    + '#kendaliKota .kk-joy div{position:absolute;left:50%;top:50%;width:42px;height:42px;margin:-21px 0 0 -21px;border-radius:50%;background:#e9fdff;box-shadow:0 0 14px #7ef9ff}'
    + '#kendaliKota .kk-tombol{position:fixed;right:16px;bottom:96px;display:flex;flex-direction:column;gap:10px;z-index:15;transition:opacity .3s}'
    + '#kendaliKota button{width:48px;height:48px;border-radius:50%;border:2px solid rgba(126,249,255,.7);background:rgba(14,16,40,.6);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);color:#e9fdff;font:900 22px/1 system-ui;cursor:pointer;padding:0;box-shadow:0 0 12px rgba(126,249,255,.3)}'
    + '#kendaliKota.sembunyi>*{opacity:0;pointer-events:none}'
    + '@media (prefers-reduced-motion:reduce){#kv .kv-agen{animation:none;transform:translate(calc(var(--i) * 110px + 16px),var(--y))}}';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function buat(el) {
    var gaya = document.createElement('style'); gaya.textContent = CSS; document.head.appendChild(gaya);
    var kv = document.createElement('div'); kv.id = 'kv';
    kv.innerHTML = '<video muted playsinline autoplay loop preload="auto" aria-hidden="true"></video><div class="kv-gelap"></div><div class="kv-langit"></div><div class="kv-baris" role="list" aria-label="Gedung platform"></div>';
    el.replaceChildren(kv);
    var st = { kv: kv, vid: kv.querySelector('video'), baris: kv.querySelector('.kv-baris'), langit: kv.querySelector('.kv-langit'), gelap: kv.querySelector('.kv-gelap'),
      joy: { x: 0, y: 0, id: null }, px: 0, py: 0, zoom: 1, zoomTuju: 1, tombol: {} };
    var pilihKlip = function () {
      var tegak = innerWidth / innerHeight < 1, nama = tegak ? 'kota-tegak' : 'kota-lebar';
      if (st.klip === nama) return; st.klip = nama;
      st.vid.poster = nama + '.jpg'; st.vid.src = nama + '.mp4';
      var p = st.vid.play(); if (p && p.catch) p.catch(function () {});
    };
    pilihKlip(); addEventListener('resize', pilihKlip);
    // HP sering menunda putar otomatis sampai ada sentuhan pertama
    addEventListener('pointerdown', function () { if (st.vid.paused) st.vid.play().catch(function () {}); }, { once: true });

    // pad + tombol (gaya Anak Gusti)
    var kendali = document.createElement('div'); kendali.id = 'kendaliKota';
    kendali.innerHTML = '<div class="kk-joy" title="Seret untuk menggeser kamera"><div></div></div><div class="kk-tombol"><button data-k="+" title="Dekatkan">＋</button><button data-k="-" title="Jauhkan">－</button><button data-k="0" title="Balik ke awal">⌂</button></div>';
    document.body.appendChild(kendali); st.kendali = kendali;
    var joyEl = kendali.firstElementChild, bola = joyEl.firstElementChild;
    var gerakJoy = function (e) {
      var r = joyEl.getBoundingClientRect(), dx = (e.clientX - r.left - r.width / 2) / (r.width / 2), dy = (e.clientY - r.top - r.height / 2) / (r.height / 2), n = Math.hypot(dx, dy);
      if (n > 1) { dx /= n; dy /= n; } if (n < 0.15) dx = dy = 0;
      st.joy.x = dx; st.joy.y = dy; bola.style.transform = 'translate(' + dx * 37 + 'px,' + dy * 37 + 'px)';
    };
    joyEl.addEventListener('pointerdown', function (e) { e.preventDefault(); st.joy.id = e.pointerId; try { joyEl.setPointerCapture(e.pointerId); } catch (x) {} gerakJoy(e); });
    joyEl.addEventListener('pointermove', function (e) { if (e.pointerId === st.joy.id) gerakJoy(e); });
    var lepas = function () { st.joy.id = null; st.joy.x = st.joy.y = 0; bola.style.transform = ''; };
    joyEl.addEventListener('pointerup', lepas); joyEl.addEventListener('pointercancel', lepas);
    kendali.lastElementChild.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.k === '+') st.zoomTuju = Math.min(2.2, st.zoomTuju * 1.25);
      else if (b.dataset.k === '-') st.zoomTuju = Math.max(1, st.zoomTuju / 1.25);
      else { st.zoomTuju = 1; st.px = st.py = 0; }
    });
    addEventListener('keydown', function (e) { if (!/input|textarea|select/i.test(e.target.tagName)) st.tombol[e.key.toLowerCase()] = 1; });
    addEventListener('keyup', function (e) { st.tombol[e.key.toLowerCase()] = 0; });

    // ketuk layar platform / agen
    kv.addEventListener('click', function (e) {
      var l = e.target.closest('[data-no],[data-agen]'); if (!l || !st.data) return; var d = st.data;
      if (l.dataset.agen) { d.onAgen && d.onAgen(l.dataset.agen); return; }
      var no = +l.dataset.no; if (l.dataset.kosong) d.onLahan && d.onLahan(no); else d.onRumah && d.onRumah(no);
    });

    var akhir = performance.now();
    (function putar(sk) {
      requestAnimationFrame(putar);
      var dt = Math.min(0.05, (sk - akhir) / 1000); akhir = sk; if (!dt) return;
      var tb = st.tombol, jx = st.joy.x + (tb.d || tb.arrowright ? 1 : 0) - (tb.a || tb.arrowleft ? 1 : 0), jy = st.joy.y + (tb.s || tb.arrowdown ? 1 : 0) - (tb.w || tb.arrowup ? 1 : 0);
      // gulir halaman = terbang mendekat ke kota
      var p = Math.min(1, scrollY / (innerHeight * 1.2));
      st.zoom += (st.zoomTuju - st.zoom) * 0.1;
      var z = st.zoom * (1 + p * 0.45), batas = (z - 1) / (2 * z) * 100;
      if (jx || jy) { st.px -= jx * 22 * dt; st.py -= jy * 22 * dt; }
      if (jy < -0.5 && st.zoomTuju < 2.2) st.zoomTuju = Math.min(2.2, st.zoomTuju + dt * 0.5); // dorong pad ke atas = maju
      if (jy > 0.5 && st.zoomTuju > 1) st.zoomTuju = Math.max(1, st.zoomTuju - dt * 0.5);
      st.px = Math.max(-batas, Math.min(batas, st.px)); st.py = Math.max(-batas, Math.min(batas, st.py));
      st.vid.style.transform = 'scale(' + z.toFixed(4) + ') translate(' + st.px.toFixed(2) + '%,' + st.py.toFixed(2) + '%)';
      st.kendali.classList.toggle('sembunyi', scrollY > innerHeight * 0.45);
      // deretan layar platform menempel di dasar jendela kota (ikut tergulir bersama halaman)
      var jd = document.getElementById('jendela');
      if (jd && !jd.hidden) st.baris.style.transform = 'translateY(' + Math.round(jd.getBoundingClientRect().bottom - 172) + 'px)';
    })(akhir);
    return st;
  }

  function isi(st, data) {
    var peta = {}; (data.kavling || []).forEach(function (k) { if (k && k.no >= 1 && k.no <= 12) peta[k.no] = k.rumah; });
    var h = '';
    for (var no = 1; no <= 12; no++) {
      var r = peta[no];
      if (!r) { h += '<button class="kv-l kosong" data-no="' + no + '" data-kosong="1" role="listitem"><i>＋</i>Lahan kosong<br><span style="opacity:.7">kavling ' + no + '</span></button>'; continue; }
      var g = GAYA[r.jenis] || GAYA.lain, j = r.jumlah || {}, w = r.warna || g[2], baris;
      if (r.keadaan === 'usul') baris = '💡 usulan ' + esc(r.oleh || 'agen') + '<br>ketuk untuk setujui';
      else if (r.jenis === 'studio' || r.jenis === 'mesin') baris = '🎞️ ' + (r.antre || 0) + ' antre<br>⚡ ' + (r.sibuk ? 'lagi kerja' : 'santai');
      else if (r.keadaan === 'buka') baris = '✅ ' + (j.tayang || 0) + ' tayang<br>📅 ' + (j.disetujui || 0) + ' terjadwal';
      else baris = '🏗️ lagi dibangun<br>🔌 belum disambung';
      h += '<button class="kv-l' + (r.keadaan === 'usul' ? ' usul' : '') + '" style="--w:' + esc(w) + '" data-no="' + no + '" role="listitem">'
        + (r.keadaan === 'usul' ? '' : '<span class="rec">REC</span>') + '<i>' + g[0] + '</i><span>' + baris + '</span><b>' + esc(r.nama || g[1]) + '</b>'
        + (j.siap_cek ? '<span class="lencana">⏳ ' + j.siap_cek + '</span>' : '') + '</button>';
    }
    st.baris.innerHTML = h;
    var giat = {}; (data.kegiatan || []).forEach(function (k) { if (k && k.agen && !giat[k.agen]) giat[k.agen] = k; });
    st.langit.innerHTML = (data.agen || []).map(function (a, i) {
      var k = giat[a.nama], teks = '🛸 ' + esc(a.nama) + (k && k.label ? ' · ' + esc(k.label) : '');
      return '<span class="kv-agen" data-agen="' + esc(a.nama) + '" style="--w:' + esc(a.warna || '#7ef9ff') + ';--y:' + (9 + i * 6) + 'vh;--d:' + (k ? 14 : 22 + i * 4) + 's;--t:-' + (i * 5) + 's;--i:' + i + '">' + teks + '</span>';
    }).join('');
    st.data = data;
  }

  window.LudludKotaVideo = {
    render: function (el, data) {
      if (!el.__kv) el.__kv = buat(el);
      el.__kv.data = data;
      var kunci = JSON.stringify([data.kavling, data.kegiatan, data.agen]);
      if (el.__kv.kunci !== kunci) { el.__kv.kunci = kunci; isi(el.__kv, data); }
    }
  };
})();
