/* Ludlud Kota — tampilan "kota balok mainan" untuk dasbor konten OCKLU.
 * Pakai: window.LudludKota.render(el, data)  — aman dipanggil berulang.
 * Vanilla JS + SVG/CSS, tanpa pustaka/gambar luar. Semua kelas berprefiks .lk-
 */
(function () {
  'use strict';

  var TINGGI = 280, ALAS = 204, LEBAR_RUMAH = 104, JARAK = 114, X0 = 276;
  var PALET = ['#f6c945', '#ef6f5e', '#5aa9e6', '#7bc67b', '#f39a4a', '#4fc4b7', '#c58be0', '#f08fb0'];
  var ATAP = [62, 74, 56, 68];
  var TEKS_STATUS = {
    tersambung: 'tersambung',
    kunci: 'kunci sudah ada, belum disambung',
    belum: 'belum disambung',
    segera: 'segera hadir'
  };
  var NAMA_TEMPAT = { gerbang: 'gerbang kota', menara: 'menara pengintai', balai: 'balai kota' };

  var GELAP = '--lk-l1:#0a1030;--lk-l2:#2b2f6e;--lk-trotoar:#565c70;--lk-tepi:#3d4254;--lk-jalan:#2b303f;' +
    '--lk-garis:#8f96ad;--lk-alas:#1f6b40;--lk-alas2:#2b8a55;--lk-redup:.42;--lk-siang:0;--lk-malam:1;' +
    '--lk-jauh:#232a5c;--lk-pijar:drop-shadow(0 0 5px #ffd34d);--lk-bingkai:#0d1330;';

  var CSS = [
    '.lk-kota{--lk-l1:#6ec3ff;--lk-l2:#d9f1ff;--lk-trotoar:#e9e2d0;--lk-tepi:#c9c0aa;--lk-jalan:#9aa7b8;',
    '--lk-garis:#fff;--lk-alas:#58b368;--lk-alas2:#74c97f;--lk-redup:0;--lk-siang:1;--lk-malam:0;',
    '--lk-jauh:#bfe3fb;--lk-pijar:none;--lk-bingkai:#b9d9ee;',
    'position:relative;display:block;width:100%;max-width:100%;min-width:0;box-sizing:border-box;overflow:hidden;',
    'border-radius:14px;border:1px solid var(--lk-bingkai);',
    'font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;line-height:1}',
    '@media (prefers-color-scheme:dark){.lk-kota:not(.lk-terang){' + GELAP + '}}',
    '.lk-kota.lk-gelap{' + GELAP + '}',
    '.lk-geser{overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:thin;',
    'overscroll-behavior-x:contain}',
    '.lk-dunia{position:relative;height:' + TINGGI + 'px;min-width:100%;',
    'background:linear-gradient(to bottom,var(--lk-l1) 0,var(--lk-l2) 200px,var(--lk-trotoar) 200px,',
    'var(--lk-trotoar) 216px,var(--lk-jalan) 216px,var(--lk-jalan) 268px,var(--lk-alas) 268px)}',
    '.lk-lapis{position:absolute;left:0;top:0;height:' + TINGGI + 'px;pointer-events:none;overflow:visible}',
    '.lk-kota svg text{font-family:inherit;user-select:none;-webkit-user-select:none}',
    '.lk-siang{opacity:var(--lk-siang)}.lk-malam{opacity:var(--lk-malam)}',
    '.lk-jauh{fill:var(--lk-jauh)}.lk-trotoar-tepi{fill:var(--lk-tepi)}',
    '.lk-garis{stroke:var(--lk-garis)}.lk-alas2{stroke:var(--lk-alas2)}',
    '.lk-redup{fill:#0a1030;opacity:var(--lk-redup);pointer-events:none}',
    '.lk-nyala{filter:var(--lk-pijar)}',
    '.lk-lampu{fill:#fff3b0;filter:var(--lk-pijar)}',
    '.lk-tempat{position:absolute;top:0;height:210px;pointer-events:none;overflow:visible}',
    '.lk-rumah,.lk-agen{position:absolute;margin:0;padding:0;border:0;background:none;cursor:pointer;',
    'font:inherit;color:inherit;-webkit-tap-highlight-color:transparent;border-radius:10px;overflow:visible}',
    '.lk-rumah{top:6px;width:' + LEBAR_RUMAH + 'px;height:206px}',
    '.lk-rumah svg{display:block;position:absolute;left:0;top:-6px;overflow:visible;transition:transform .15s}',
    '.lk-rumah:hover svg{transform:translateY(-3px)}',
    '.lk-rumah:focus-visible,.lk-agen:focus-visible{outline:3px solid #ffb300;outline-offset:1px;',
    'box-shadow:0 0 0 5px rgba(0,0,0,.35)}',
    '.lk-agen{top:204px;width:44px;height:50px;z-index:3}',
    '.lk-agen:hover .lk-boneka{filter:brightness(1.12)}',
    '.lk-boneka{display:block;margin:0 auto;overflow:visible;transform-origin:50% 100%;',
    'animation:lk-goyang 3.2s ease-in-out infinite}',
    '.lk-nama,.lk-kata{position:absolute;left:50%;transform:translateX(-50%);white-space:nowrap;',
    'font-size:9px;font-weight:800;letter-spacing:.3px;padding:2px 6px;border-radius:7px;',
    'border:1.5px solid #fff;box-shadow:0 1px 2px rgba(0,0,0,.3)}',
    '.lk-nama{bottom:100%;color:#fff}',
    '.lk-kata{bottom:calc(100% + 17px);background:#fff;color:#1d2433;font-weight:700;border-color:#1d2433}',
    '.lk-jalan{animation:lk-jalan var(--lk-dur,12s) linear infinite;animation-delay:var(--lk-tunda,0s);z-index:4}',
    '.lk-jalan .lk-boneka{animation:lk-loncat .5s ease-in-out infinite}',
    '.lk-jalan .lk-k1{animation:lk-langkah .5s linear infinite}',
    '.lk-jalan .lk-k2{animation:lk-langkah .5s linear -.25s infinite}',
    '.lk-bendera{transform-box:fill-box;transform-origin:0 50%;animation:lk-kibar 1.6s ease-in-out infinite}',
    '.lk-asap{transform-box:fill-box;transform-origin:50% 50%;animation:lk-asap 2.4s ease-out infinite}',
    '.lk-asap2{animation-delay:-.8s}.lk-asap3{animation-delay:-1.6s}',
    '.lk-denyut{transform-box:fill-box;transform-origin:50% 50%;animation:lk-denyut 1.8s ease-in-out infinite}',
    '.lk-kedip{animation:lk-kedip 1.2s steps(2,start) infinite}',
    '@keyframes lk-goyang{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}',
    '@keyframes lk-loncat{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.5px)}}',
    '@keyframes lk-langkah{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}',
    '@keyframes lk-jalan{0%,4%{transform:translateX(0)}46%,54%{transform:translateX(var(--lk-dx,0px))}',
    '96%,100%{transform:translateX(0)}}',
    '@keyframes lk-kibar{0%,100%{transform:scaleX(1) skewY(0)}50%{transform:scaleX(.82) skewY(7deg)}}',
    '@keyframes lk-asap{0%{transform:translateY(0) scale(.6);opacity:.85}100%{transform:translateY(-26px) scale(1.5);opacity:0}}',
    '@keyframes lk-denyut{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}',
    '@keyframes lk-kedip{0%{opacity:1}50%{opacity:.25}}',
    '@media (prefers-reduced-motion:reduce){.lk-kota *{animation:none!important;transition:none!important}',
    '.lk-jalan{transform:translateX(calc(var(--lk-dx,0px)/2))}}'
  ].join('');

  /* ---------- alat kecil ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function warnaAman(w, cadangan) {
    return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(w || '') ? w : (cadangan || '#667085');
  }
  // k<0 menggelapkan, k>0 mencerahkan
  function rona(hex, k) {
    var h = hex.slice(1);
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16), t = k < 0 ? 0 : 255, a = Math.abs(k);
    var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    r = Math.round(r + (t - r) * a); g = Math.round(g + (t - g) * a); b = Math.round(b + (t - b) * a);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }
  function kotak(x, y, w, h, isi, lain) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + isi + '"' + (lain || '') + '/>';
  }
  // dinding bata mainan: kotak + nat bata berselang
  function bata(x, y, w, h, c) {
    var d = '', baris = 0, yy, xx;
    for (yy = y + 12; yy < y + h; yy += 12) d += 'M' + x + ' ' + yy + 'h' + w;
    for (yy = y; yy < y + h; yy += 12, baris++) {
      for (xx = x + (baris % 2 ? 12 : 24); xx < x + w - 2; xx += 24) d += 'M' + xx + ' ' + yy + 'v' + Math.min(12, y + h - yy);
    }
    return kotak(x, y, w, h, c) + '<path d="' + d + '" stroke="' + rona(c, -0.2) + '" stroke-width="1" fill="none"/>' +
      kotak(x, y, 3, h, rona(c, 0.25), ' opacity=".6"');
  }
  // tonjolan bulat di atas balok
  function tonjol(x, y, w, c) {
    var s = '', n = Math.max(1, Math.floor(w / 14)), sela = w / n, i;
    for (i = 0; i < n; i++) {
      s += '<rect x="' + (x + sela * i + sela / 2 - 4.5).toFixed(1) + '" y="' + (y - 4) + '" width="9" height="5" rx="1.8" fill="' + rona(c, 0.12) + '" stroke="' + rona(c, -0.2) + '" stroke-width=".8"/>';
    }
    return s;
  }
  function pil(xKanan, y, t, bg, fg, besar, kelas) {
    var fs = besar ? 10 : 8.5, h = besar ? 17 : 13, w = Math.round(t.length * fs * 0.56 + 12);
    return {
      w: w,
      s: '<g' + (kelas ? ' class="' + kelas + '"' : '') + '><rect x="' + (xKanan - w) + '" y="' + y + '" width="' + w + '" height="' + h +
        '" rx="' + (h / 2) + '" fill="' + bg + '" stroke="#fff" stroke-width="1.5"/><text x="' + (xKanan - w / 2) + '" y="' +
        (y + h / 2 + fs * 0.36).toFixed(1) + '" text-anchor="middle" font-size="' + fs + '" font-weight="700" fill="' + fg + '">' + esc(t) + '</text></g>'
    };
  }
  function papanNama(nama, warna, y) {
    var t = String(nama || ''), muat = t.length * 6.7 > 86 ? ' textLength="86" lengthAdjust="spacingAndGlyphs"' : '';
    return '<rect x="4" y="' + y + '" width="96" height="18" rx="3" fill="' + warna + '" stroke="#fff" stroke-width="1.5"/>' +
      '<text x="52" y="' + (y + 13) + '" text-anchor="middle" font-size="11" font-weight="800" fill="#fff"' + muat + '>' + esc(t) + '</text>';
  }
  function tenda(warna, y) {
    var s = '', i, x;
    for (i = 0; i < 10; i++) {
      x = 2 + i * 10;
      s += '<path d="M' + x + ' ' + y + 'h10v8a5 5 0 0 1-10 0z" fill="' + (i % 2 ? '#fff' : warna) + '" stroke="rgba(0,0,0,.18)" stroke-width=".6"/>';
    }
    return s;
  }
  function jendela(x, y, w, h, status) {
    var isi = status === 'tersambung' ? '#ffd75e' : status === 'kunci' ? '#a59463' : '#2f3848';
    var kelas = status === 'tersambung' ? ' class="lk-nyala"' : '';
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="2" fill="#fff" stroke="rgba(0,0,0,.25)" stroke-width=".8"/>' +
      '<rect' + kelas + ' x="' + (x + 3) + '" y="' + (y + 3) + '" width="' + (w - 6) + '" height="' + (h - 6) + '" fill="' + isi + '"/>' +
      '<path d="M' + (x + w / 2) + ' ' + (y + 3) + 'v' + (h - 6) + '" stroke="#fff" stroke-width="1.5"/>';
  }
  function svgBuka(w, h) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true" focusable="false">';
  }

  /* ---------- rumah ---------- */
  function ringkasJumlah(j) {
    var b = [];
    j = j || {};
    if (j.siap_cek > 0) b.push(j.siap_cek + ' siap dicek');
    if (j.disetujui > 0) b.push(j.disetujui + ' disetujui');
    if (j.tayang > 0) b.push(j.tayang + ' tayang');
    return b;
  }
  function labelRumah(r) {
    if (r.jenis === 'studio') {
      return 'Studio ' + (r.nama && r.nama !== 'Studio' ? r.nama + ' ' : '') + '(tempat video dibuat): ' +
        (r.sibuk ? 'sedang membuat video' : 'sedang santai') + (r.antre > 0 ? ', ' + r.antre + ' antre' : '');
    }
    var b = [TEKS_STATUS[r.status] || TEKS_STATUS.belum].concat(ringkasJumlah(r.jumlah));
    return 'Rumah ' + r.nama + ': ' + b.join(', ');
  }
  function lencana(r, T, geser) {
    var s = '', j = r.jumlah || {}, y = T - 40 - (geser || 0), x = 101, p;
    if (j.siap_cek > 0) s += pil(101, y, j.siap_cek + ' siap dicek', '#ff5a36', '#fff', true, 'lk-denyut').s;
    y += 21;
    if (j.tayang > 0) { p = pil(x, y, j.tayang + ' tayang', '#1f9d55', '#fff'); s += p.s; x -= p.w + 3; }
    if (j.disetujui > 0) { p = pil(x, y, j.disetujui + ' setuju', '#2f6fed', '#fff'); s += p.s; }
    return s;
  }
  function gambarRumah(r, i) {
    var c = PALET[i % PALET.length], T = ATAP[i % ATAP.length], w = warnaAman(r.warna), st = r.status, s = svgBuka(LEBAR_RUMAH, 210);
    var inisial = esc(String(r.nama || '?').charAt(0).toUpperCase());
    if (st !== 'tersambung' && st !== 'kunci' && st !== 'segera') st = 'belum';

    if (st === 'segera') {
      var kiri = i % 2 === 0;
      s += bata(6, 120, 92, ALAS - 120, c) + tonjol(kiri ? 42 : 6, 120, 56, c);
      s += bata(kiri ? 6 : 62, 108, 36, 12, c) + tonjol(kiri ? 24 : 62, 108, 18, c);
      s += bata(kiri ? 6 : 80, 96, 18, 12, c) + tonjol(kiri ? 6 : 80, 96, 18, c);
      s += kotak(6, 92, 92, ALAS - 92, '#0a1030', ' class="lk-redup"');
      s += kotak(40, 168, 24, 36, rona(c, -0.55));
      s += papanNama(r.nama, w, 130);
      // perancah
      s += '<g stroke="#a9793f" stroke-linecap="round" fill="none"><path d="M3 204V66M101 204V66" stroke-width="3"/>' +
        '<path d="M1 122h102M1 82h102" stroke-width="3.5" stroke="#c9975a"/>' +
        '<path d="M3 122L101 82M3 204L101 164" stroke-width="1.2" opacity=".7"/></g>';
      s += kotak(kiri ? 70 : 14, 72, 14, 9, PALET[(i + 3) % 8], ' stroke="rgba(0,0,0,.25)" stroke-width=".8"') + tonjol(kiri ? 70 : 14, 72, 14, PALET[(i + 3) % 8]);
      s += '<g><rect x="26" y="88" width="52" height="17" rx="2" fill="#ffd23f" stroke="#3a2f0b" stroke-width="1.5"/>' +
        '<text x="52" y="100.5" text-anchor="middle" font-size="10" font-weight="800" fill="#3a2f0b" letter-spacing="1">SEGERA</text></g>';
      return s + '</svg>';
    }

    s += bata(6, T, 92, ALAS - T, c) + tonjol(6, T, 92, c);
    s += kotak(6, T - 4, 92, ALAS - T + 4, '#0a1030', ' class="lk-redup"');
    // jendela + medali inisial
    s += jendela(13, T + 12, 24, 22, st) + jendela(67, T + 12, 24, 22, st);
    if (T <= 62) s += jendela(13, T + 42, 24, 22, st) + jendela(67, T + 42, 24, 22, st);
    s += '<circle cx="52" cy="' + (T + 23) + '" r="10.5" fill="' + w + '" stroke="#fff" stroke-width="2"/>' +
      '<text x="52" y="' + (T + 27.5) + '" text-anchor="middle" font-size="12" font-weight="800" fill="#fff">' + inisial + '</text>';
    s += papanNama(r.nama, w, 130) + tenda(w, 150);
    // lantai bawah: etalase + pintu
    s += jendela(11, 168, 24, 26, st) + jendela(69, 168, 24, 26, st);
    s += '<rect x="41" y="166" width="22" height="38" rx="2" fill="' + rona(c, -0.45) + '" stroke="#fff" stroke-width="1.2"/><circle cx="58" cy="186" r="1.6" fill="#ffd75e"/>';

    if (st === 'tersambung') {
      s += '<path d="M17 ' + (T - 4) + 'V' + (T - 46) + '" stroke="#6b7280" stroke-width="2" stroke-linecap="round"/>' +
        '<path class="lk-bendera" d="M18 ' + (T - 46) + 'l17 5l-17 6z" fill="' + w + '" stroke="#fff" stroke-width="1"/>';
      s += lencana(r, T, 0);
    } else if (st === 'kunci') {
      var gy = Math.min(T + 53, 118);
      s += '<g><circle cx="52" cy="' + gy + '" r="10" fill="#fff" stroke="#8a6d1a" stroke-width="1.5"/>' +
        '<path d="M48 ' + (gy - 1) + 'v-3a4 4 0 0 1 8 0v3" fill="none" stroke="#8a6d1a" stroke-width="2"/>' +
        '<rect x="46" y="' + (gy - 1) + '" width="12" height="8" rx="2" fill="#e0a800"/></g>';
      s += lencana(r, T, 0);
    } else {
      s += '<path d="M22 ' + (T - 6) + 'v6M82 ' + (T - 6) + 'v6" stroke="#8d6e4a" stroke-width="2.5"/>' +
        '<rect x="9" y="' + (T - 24) + '" width="86" height="17" rx="2.5" fill="#fff4d6" stroke="#8d6e4a" stroke-width="1.5"/>' +
        '<text x="52" y="' + (T - 12) + '" text-anchor="middle" font-size="9" font-weight="700" fill="#5d4037">belum disambung</text>';
      s += lencana(r, T, 24);
    }
    return s + '</svg>';
  }
  function gambarStudio(r) {
    var c = '#8ea4c8', T = 66, w = '#2b3a55', s = svgBuka(LEBAR_RUMAH, 210), sibuk = !!r.sibuk, p, x = 101;
    // cerobong + asap
    s += bata(16, T - 26, 18, 26, '#c96a4f') + tonjol(16, T - 26, 18, '#c96a4f');
    if (sibuk) {
      s += '<g fill="#fff" opacity=".9"><circle class="lk-asap" cx="25" cy="' + (T - 36) + '" r="5"/>' +
        '<circle class="lk-asap lk-asap2" cx="27" cy="' + (T - 36) + '" r="4.5"/><circle class="lk-asap lk-asap3" cx="23" cy="' + (T - 36) + '" r="4"/></g>';
    }
    s += bata(6, T, 92, ALAS - T, c) + tonjol(6, T, 92, c);
    s += kotak(6, T - 30, 92, ALAS - T + 30, '#0a1030', ' class="lk-redup"');
    // jendela kerja lebar: lampu + layar
    s += '<rect x="13" y="' + (T + 10) + '" width="78" height="44" rx="2" fill="#fff" stroke="rgba(0,0,0,.25)" stroke-width=".8"/>' +
      '<rect' + (sibuk ? ' class="lk-nyala"' : '') + ' x="16" y="' + (T + 13) + '" width="72" height="38" fill="' + (sibuk ? '#ffd75e' : '#2f3848') + '"/>';
    s += '<rect x="40" y="' + (T + 24) + '" width="26" height="17" rx="1.5" fill="' + (sibuk ? '#1d2433' : '#465066') + '"/>' +
      '<path d="M46 ' + (T + 47) + 'h14M53 ' + (T + 41) + 'v6" stroke="#1d2433" stroke-width="2"/>' +
      '<path d="M47 ' + (T + 28) + 'l8 4.5l-8 4.5z" fill="' + (sibuk ? '#7ef0a0' : '#7b8499') + '"/>';
    s += '<path d="M24 ' + (T + 51) + 'v-16l8-8" stroke="#1d2433" stroke-width="1.8" fill="none"/>' +
      '<path d="M28 ' + (T + 24) + 'l8 6l-6 3z" fill="' + (sibuk ? '#fff7c2' : '#7b8499') + '"/>';
    if (sibuk) s += '<circle class="lk-kedip" cx="80" cy="' + (T + 20) + '" r="3.5" fill="#ff3b30"/>';
    s += papanNama(r.nama || 'Studio', w, 130) + tenda(w, 150);
    s += jendela(11, 168, 24, 26, sibuk ? 'tersambung' : 'belum') + jendela(69, 168, 24, 26, sibuk ? 'tersambung' : 'belum');
    s += '<rect x="41" y="166" width="22" height="38" rx="2" fill="' + rona(c, -0.5) + '" stroke="#fff" stroke-width="1.2"/><circle cx="58" cy="186" r="1.6" fill="#ffd75e"/>';
    if (sibuk) { s += pil(101, T - 40, 'sibuk', '#1f9d55', '#fff', true, 'lk-denyut').s; }
    if (r.antre > 0) { p = pil(x, T - 19, r.antre + ' antre', '#2f6fed', '#fff'); s += p.s; }
    return s + '</svg>';
  }

  /* ---------- tempat khusus ---------- */
  function gambarGerbang(nama) {
    var m = '#e85d4a', k = '#f6c945', s = svgBuka(76, 210);
    s += bata(4, 108, 18, 96, m) + bata(54, 108, 18, 96, m);
    s += bata(0, 90, 76, 18, k) + tonjol(0, 90, 76, k);
    s += kotak(0, 86, 76, 118, '#0a1030', ' class="lk-redup"');
    s += '<text x="38" y="103" text-anchor="middle" font-size="9.5" font-weight="800" fill="#3a2f0b"' +
      (String(nama).length > 9 ? ' textLength="68" lengthAdjust="spacingAndGlyphs"' : '') + '>' + esc(nama) + '</text>';
    s += '<path d="M8 86V66M68 86V66" stroke="#6b7280" stroke-width="2"/>' +
      '<path class="lk-bendera" d="M9 66l14 4l-14 5z" fill="#2f6fed" stroke="#fff" stroke-width=".8"/>' +
      '<path class="lk-bendera" d="M69 66l-14 4l14 5z" fill="#1f9d55" stroke="#fff" stroke-width=".8" style="transform-origin:100% 50%"/>';
    s += '<circle class="lk-lampu" cx="13" cy="120" r="3"/><circle class="lk-lampu" cx="63" cy="120" r="3"/>';
    return s + '</svg>';
  }
  function gambarMenara() {
    var b = '#5aa9e6', o = '#f39a4a', s = svgBuka(64, 210);
    s += bata(18, 92, 28, 112, b);
    s += bata(8, 64, 48, 28, o) + tonjol(8, 64, 48, o);
    s += '<path d="M4 64L32 38L60 64z" fill="#ef6f5e" stroke="rgba(0,0,0,.2)" stroke-width="1"/>';
    s += kotak(4, 38, 56, 166, '#0a1030', ' class="lk-redup"');
    s += '<rect x="18" y="70" width="28" height="15" rx="2" fill="#fff"/><rect class="lk-nyala" x="21" y="73" width="22" height="9" fill="#ffd75e"/>';
    s += '<path d="M32 38V22" stroke="#6b7280" stroke-width="2"/><path class="lk-bendera" d="M33 22l13 4l-13 5z" fill="#a86a00" stroke="#fff" stroke-width=".8"/>';
    s += '<rect x="22" y="110" width="20" height="14" rx="2" fill="#fff" opacity=".9"/><circle cx="32" cy="117" r="4.5" fill="none" stroke="#2b3a55" stroke-width="1.6"/><path d="M35 120.5l4 4" stroke="#2b3a55" stroke-width="1.8" stroke-linecap="round"/>';
    s += '<rect x="26" y="182" width="12" height="22" rx="2" fill="' + rona(b, -0.5) + '"/>';
    return s + '</svg>';
  }
  function gambarBalai() {
    var c = '#f3e3bd', s = svgBuka(108, 210), i;
    s += bata(8, 104, 92, 100, c);
    s += '<path d="M2 104L54 72L106 104z" fill="#ef6f5e" stroke="rgba(0,0,0,.2)" stroke-width="1"/>';
    s += kotak(2, 100, 104, 6, '#fff', ' stroke="rgba(0,0,0,.15)" stroke-width=".8"') + tonjol(2, 100, 104, '#f3e3bd');
    s += kotak(2, 72, 104, 132, '#0a1030', ' class="lk-redup"');
    s += '<circle cx="54" cy="91" r="7.5" fill="#fff" stroke="#2b3a55" stroke-width="1.5"/><path d="M54 87v4.5l3 2" stroke="#2b3a55" stroke-width="1.4" fill="none" stroke-linecap="round"/>';
    s += '<rect x="14" y="110" width="80" height="16" rx="2.5" fill="#b3372f" stroke="#fff" stroke-width="1.3"/>' +
      '<text x="54" y="121.5" text-anchor="middle" font-size="9.5" font-weight="800" fill="#fff">Balai Kota</text>';
    for (i = 0; i < 4; i++) s += kotak(13 + i * 24.6, 130, 9, 68, '#fff', ' rx="2" stroke="rgba(0,0,0,.2)" stroke-width=".8"');
    s += jendela(25, 140, 18, 20, 'tersambung') + jendela(65, 140, 18, 20, 'tersambung');
    s += '<rect x="45" y="168" width="18" height="36" rx="2" fill="#7a4b2a" stroke="#fff" stroke-width="1.2"/>';
    s += kotak(4, 198, 100, 6, '#d9cba6', ' stroke="rgba(0,0,0,.15)" stroke-width=".8"');
    return s + '</svg>';
  }

  /* ---------- latar & hiasan ---------- */
  function awan(x, y, k) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + k + ')" fill="#fff" opacity=".92">' +
      '<rect x="0" y="12" width="64" height="14" rx="7"/><rect x="10" y="4" width="26" height="16" rx="8"/><rect x="30" y="0" width="24" height="20" rx="9"/></g>';
  }
  function latar(W) {
    var s = '<svg class="lk-lapis" xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + TINGGI + '" aria-hidden="true" focusable="false">', x, i, h;
    // siang
    s += '<g class="lk-siang"><circle cx="150" cy="40" r="20" fill="#ffe066"/><circle cx="150" cy="40" r="27" fill="#ffe066" opacity=".3"/>';
    for (x = 40, i = 0; x < W; x += 230, i++) s += awan(x + (i % 2) * 60, 14 + (i * 17) % 30, 0.8 + (i % 3) * 0.15);
    s += '</g>';
    // malam
    s += '<g class="lk-malam"><circle cx="150" cy="40" r="16" fill="#fdf6d8"/><circle cx="157" cy="35" r="14" fill="#151b47"/>';
    for (x = 20, i = 0; x < W; x += 37, i++) s += '<circle cx="' + x + '" cy="' + (8 + (i * 53) % 110) + '" r="' + (i % 3 ? 1 : 1.6) + '" fill="#fff" opacity="' + (0.5 + (i % 4) * 0.12) + '"/>';
    s += '</g>';
    // balok jauh
    s += '<g class="lk-jauh">';
    for (x = 0, i = 0; x < W; x += 46, i++) { h = 26 + (i * 29) % 44; s += '<rect x="' + x + '" y="' + (200 - h) + '" width="40" height="' + h + '"/>'; }
    s += '</g>';
    // trotoar, jalan, alas hijau
    s += '<rect class="lk-trotoar-tepi" x="0" y="213" width="' + W + '" height="3"/>';
    s += '<path class="lk-garis" d="M10 242H' + W + '" stroke-width="3" stroke-dasharray="18 16" opacity=".85" fill="none"/>';
    s += '<path class="lk-alas2" d="M8 274H' + W + '" stroke-width="7" stroke-dasharray="0 15" stroke-linecap="round" fill="none"/>';
    return s + '</svg>';
  }
  function pot(x, i) {
    var w = ['#ff5a7a', '#ffd23f', '#b06cf0', '#ff8a3d'][i % 4];
    return '<g transform="translate(' + x + ' 0)"><path d="M0 204h12l-2 10h-8z" fill="#c9703f" stroke="rgba(0,0,0,.25)" stroke-width=".6"/>' +
      '<path d="M6 204v-7" stroke="#2f8f4e" stroke-width="2"/><circle cx="2.5" cy="199" r="3.2" fill="' + w + '"/><circle cx="9.5" cy="199" r="3.2" fill="' + w + '"/>' +
      '<circle cx="6" cy="195" r="3.4" fill="' + w + '"/><circle cx="6" cy="198" r="1.5" fill="#fff3b0"/></g>';
  }
  function hidran(x) {
    return '<g transform="translate(' + x + ' 0)" fill="#e23b2e" stroke="rgba(0,0,0,.3)" stroke-width=".6"><rect x="1" y="202" width="8" height="12" rx="1.5"/>' +
      '<rect x="0" y="199" width="10" height="4" rx="2"/><rect x="3" y="196" width="4" height="4" rx="1.5"/><rect x="-2" y="205" width="14" height="4" rx="2"/></g>';
  }
  function lampuJalan(x) {
    return '<g transform="translate(' + x + ' 0)"><path d="M3 214V158" stroke="#4b5563" stroke-width="2.5" stroke-linecap="round"/>' +
      '<rect x="-2" y="150" width="10" height="9" rx="2.5" class="lk-lampu" stroke="#4b5563" stroke-width="1.2"/><rect x="0" y="212" width="6" height="3" fill="#4b5563"/></g>';
  }
  function hiasan(W, n) {
    var s = '<svg class="lk-lapis" style="z-index:2" xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + TINGGI + '" aria-hidden="true" focusable="false">', i, x;
    s += pot(140, 1) + pot(264, 2);
    for (i = 0; i < n; i++) {
      x = X0 + i * JARAK;
      if (i % 2 === 0) s += pot(x + 2, i);
      if (i % 3 === 1) s += hidran(x + LEBAR_RUMAH);
      if (i % 3 === 2) s += lampuJalan(x + LEBAR_RUMAH + 1);
    }
    return s + '</svg>';
  }

  /* ---------- agen ---------- */
  function gambarBoneka(warna, bawaPaket) {
    var g = rona(warna, -0.3), s = '<svg class="lk-boneka" xmlns="http://www.w3.org/2000/svg" width="30" height="48" viewBox="0 0 30 48" aria-hidden="true" focusable="false">';
    s += '<ellipse cx="15" cy="46.5" rx="11" ry="2" fill="#000" opacity=".22"/>';
    s += '<g class="lk-k1"><rect x="7" y="31" width="7" height="13" rx="1.5" fill="#39425a"/><rect x="6" y="42" width="8.5" height="4" rx="1.5" fill="#1d2433"/></g>';
    s += '<g class="lk-k2"><rect x="16" y="31" width="7" height="13" rx="1.5" fill="#39425a"/><rect x="15.500" y="42" width="8.5" height="4" rx="1.5" fill="#1d2433"/></g>';
    s += '<rect x="1.5" y="16.500" width="5" height="12" rx="2.5" fill="' + g + '"/><rect x="23.500" y="16.500" width="5" height="12" rx="2.5" fill="' + g + '"/>';
    s += '<rect x="6" y="15" width="18" height="17" rx="2.5" fill="' + warna + '" stroke="#fff" stroke-width="1"/>';
    s += '<rect x="12" y="19" width="6" height="6" rx="1.5" fill="#fff" opacity=".85"/>';
    s += '<circle cx="4" cy="29" r="2.4" fill="#ffd9a0"/><circle cx="26" cy="29" r="2.4" fill="#ffd9a0"/>';
    if (bawaPaket) s += '<rect x="20" y="22" width="10" height="9" rx="1" fill="#c98b4b" stroke="#7a4b2a" stroke-width="1"/><path d="M25 22v9" stroke="#7a4b2a" stroke-width="1"/>';
    s += '<rect x="7.500" y="2" width="15" height="13.500" rx="3.5" fill="#ffd9a0" stroke="rgba(0,0,0,.3)" stroke-width=".8"/>';
    s += '<rect x="6.500" y=".5" width="17" height="5" rx="2.5" fill="' + g + '"/>';
    s += '<circle cx="12" cy="9" r="1.2" fill="#1d2433"/><circle cx="18" cy="9" r="1.2" fill="#1d2433"/><path d="M12 12q3 2 6 0" stroke="#1d2433" stroke-width="1" fill="none" stroke-linecap="round"/>';
    return s + '</svg>';
  }

  /* ---------- susun ---------- */
  function bangun(el, data) {
    var rumah = data.rumah || [], agen = data.agen || [], kegiatan = data.kegiatan || [];
    var W = X0 + rumah.length * JARAK + 6, jangkar = { gerbang: 38 + 6, menara: 88 + 32, balai: 158 + 54 }, nama = {}, h = '', i;
    for (i in NAMA_TEMPAT) nama[i] = NAMA_TEMPAT[i];
    for (i = 0; i < rumah.length; i++) {
      jangkar[rumah[i].id] = X0 + i * JARAK + LEBAR_RUMAH / 2;
      nama[rumah[i].id] = rumah[i].nama || rumah[i].id;
    }

    h += latar(W);
    h += '<div class="lk-tempat" style="left:6px">' + gambarGerbang(data.kota || 'LUDLUD') + '</div>';
    h += '<div class="lk-tempat" style="left:88px">' + gambarMenara() + '</div>';
    h += '<div class="lk-tempat" style="left:158px">' + gambarBalai() + '</div>';
    for (i = 0; i < rumah.length; i++) {
      var r = rumah[i], lab = labelRumah(r);
      h += '<button type="button" class="lk-rumah" data-lk-rumah="' + esc(r.id) + '" style="left:' + (X0 + i * JARAK) + 'px" aria-label="' + esc(lab) + '" title="' + esc(lab) + '">' +
        (r.jenis === 'studio' ? gambarStudio(r) : gambarRumah(r, i)) + '</button>';
    }
    h += hiasan(W, rumah.length);

    // agen: yang punya kegiatan berjalan, sisanya berdiri di posisinya
    var tumpuk = {}, hitung = {}, giat = {}, a, k;
    for (i = 0; i < kegiatan.length; i++) {
      k = kegiatan[i];
      if (!k || jangkar[k.dari] == null || jangkar[k.ke] == null) continue;
      if (giat[k.agen]) giat[k.agen].lagi++; else giat[k.agen] = { k: k, lagi: 0 };
    }
    for (i = 0; i < agen.length; i++) if (!giat[agen[i].nama]) hitung[agen[i].posisi] = (hitung[agen[i].posisi] || 0) + 1;
    var kini = Date.now() / 1000;
    for (i = 0; i < agen.length; i++) {
      a = agen[i];
      var wa = warnaAman(a.warna, '#445'), g = giat[a.nama], x, gaya, kelas = 'lk-agen', kata = '', ket;
      if (g) {
        var dx = jangkar[g.k.ke] - jangkar[g.k.dari], dur = Math.max(8, Math.round(Math.abs(dx) / 14));
        x = jangkar[g.k.dari];
        kelas += ' lk-jalan';
        gaya = '--lk-dx:' + dx + 'px;--lk-dur:' + dur + 's;--lk-tunda:-' + (kini % dur).toFixed(2) + 's;';
        var lbl = (g.k.label || '') + (g.lagi ? ' +' + g.lagi : '');
        if (lbl) kata = '<span class="lk-kata">' + esc(lbl) + '</span>';
        ket = 'berjalan dari ' + nama[g.k.dari] + ' ke ' + nama[g.k.ke] + (lbl ? ', ' + lbl : '');
      } else {
        var pos = jangkar[a.posisi] != null ? a.posisi : 'balai', n = hitung[a.posisi] || 1, ke = tumpuk[pos] || 0;
        tumpuk[pos] = ke + 1;
        x = jangkar[pos] + ke * 34 - (n - 1) * 17;
        gaya = '';
        ket = 'berada di ' + nama[pos];
      }
      var la = 'Agen ' + a.nama + (a.peran ? ', ' + a.peran : '') + ': ' + ket;
      h += '<button type="button" class="' + kelas + '" data-lk-agen="' + esc(a.nama) + '" style="left:' + Math.round(x - 22) + 'px;' + gaya +
        '" aria-label="' + esc(la) + '" title="' + esc(la) + '">' + kata + '<span class="lk-nama" style="background:' + wa + '">' + esc(a.nama) + '</span>' +
        gambarBoneka(wa, !!g) + '</button>';
    }

    var kota = el.querySelector(':scope > .lk-kota'), geser, kiri = 0;
    if (kota) { geser = kota.firstChild; kiri = geser.scrollLeft; }
    else {
      el.textContent = '';
      kota = document.createElement('div');
      kota.setAttribute('role', 'group');
      kota.setAttribute('aria-label', 'Kota Ludlud: rumah tiap platform dan agen OCKLU. Geser ke samping untuk melihat semua rumah.');
      geser = document.createElement('div');
      geser.className = 'lk-geser';
      geser.tabIndex = -1;
      kota.appendChild(geser);
      el.appendChild(kota);
    }
    kota.className = 'lk-kota' + (data.tema === 'gelap' ? ' lk-gelap' : data.tema === 'terang' ? ' lk-terang' : '');
    geser.innerHTML = '<div class="lk-dunia" style="width:' + W + 'px">' + h + '</div>';
    geser.scrollLeft = kiri;
  }

  function pasangGaya() {
    if (document.getElementById('lk-gaya')) return;
    var st = document.createElement('style');
    st.id = 'lk-gaya';
    st.textContent = CSS;
    document.head.appendChild(st);
  }
  function saatKlik(e) {
    var d = this.__lk && this.__lk.data, t = e.target, b;
    if (!d || !t || !t.closest) return;
    b = t.closest('[data-lk-rumah],[data-lk-agen]');
    if (!b || !this.contains(b)) return;
    try {
      if (b.hasAttribute('data-lk-rumah')) { if (typeof d.onRumah === 'function') d.onRumah(b.getAttribute('data-lk-rumah')); }
      else if (typeof d.onAgen === 'function') d.onAgen(b.getAttribute('data-lk-agen'));
    } catch (err) { if (window.console) console.error('[LudludKota]', err); }
  }

  function render(el, data) {
    if (!el) return;
    data = data || {};
    pasangGaya();
    var tanda;
    try { tanda = JSON.stringify([data.rumah, data.agen, data.kegiatan, data.tema, data.kota]); } catch (e) { tanda = String(Math.random()); }
    if (!el.__lk) { el.__lk = {}; el.addEventListener('click', saatKlik); }
    el.__lk.data = data;                       // callback selalu yang terbaru
    if (el.__lk.tanda === tanda && el.querySelector(':scope > .lk-kota')) return;  // data sama: jangan bangun ulang
    el.__lk.tanda = tanda;
    bangun(el, data);
  }

  window.LudludKota = { render: render };
})();
