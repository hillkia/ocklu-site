/* Ludlud Kota — kota kartun isometrik 12 kavling untuk dasbor konten OCKLU.
 * Pakai: window.LudludKota.render(el, data)  — aman dipanggil berulang.
 * data = { kavling:[{no:1..12, rumah:null|{jenis,nama,warna?,keadaan:'buka'|'dibangun'|'usul',inti?,
 *          jumlah?:{siap_cek,disetujui,tayang}, sibuk?, antre?, oleh?, alasan?}}],
 *          agen:[{nama,peran,warna}], kegiatan:[{agen,dari,ke,label}],
 *          tema?:'terang'|'gelap', onLahan(no), onRumah(no), onAgen(nama) }
 * Vanilla JS + SVG/CSS, tanpa pustaka/gambar luar. Semua kelas berprefiks .lk-
 */
(function () {
  'use strict';

  /* ---------- ukuran dunia ---------- */
  var A = 72, R = 0.4, P = 1.4, KOL = 4, BAR = 3, JML = KOL * BAR;
  var WX = KOL + (KOL + 1) * R, WY = BAR + (BAR + 1) * R;
  var VW = 780, VH = 456, OX = 8.5 + WY * A, OY = 46, TMAKS = 560;
  var F0 = 0.2, F1 = 0.86, PX = 0.526;          // tapak bangunan + letak pintu (satuan kavling)
  var KEC = 0.62;                               // laju jalan agen (satuan dunia/detik)
  var K = 1, KT = 1;                            // pembesar teks & target ketuk (dihitung dari lebar)
  var LMP = '';                                 // lapis lampu/jendela bangunan yang sedang digambar
  var MQ = window.matchMedia ? window.matchMedia('(prefers-reduced-motion:reduce)') : null;

  // [nama, dinding, aksen, bentuk, tinggi, simbol, latar papan, warna simbol]
  var JENIS = {
    studio: ['Studio', '#7d8fb8', '#2b3a55', 'studio', 34, 'klaper', '#fff', '#1d2433'],
    mesin: ['Mesin', '#a3acb8', '#5d6673', 'pabrik', 30, 'gigi', '#ffd23f', '#3a3f4a'],
    youtube: ['YouTube', '#e5392f', '#b3261e', 'blok', 40, 'play', '#fff', '#e5392f'],
    instagram: ['Instagram', 'url(#lk-gi)', '#c13584', 'blok', 40, 'kamera', '#fff', '#c13584'],
    tiktok: ['TikTok', '#22252c', '#25d6cf', 'blok', 44, 'not', '#111', '#fff'],
    facebook: ['Facebook', '#3b78e7', '#2456b8', 'blok', 40, 'f', '#fff', '#2f6fe0'],
    threads: ['Threads', '#f2f2f2', '#111', 'blok', 38, '@', '#111', '#fff'],
    x: ['X', '#17191d', '#444', 'blok', 44, 'X', '#000', '#fff'],
    shopee: ['Shopee', '#f47b3a', '#d9531e', 'toko', 30, 'tas', '#fff', '#ee4d2d'],
    tokopedia: ['Tokopedia', '#4bb866', '#2e8b47', 'toko', 30, 'tas', '#fff', '#2e9e4f'],
    lazada: ['Lazada', '#1f2f7a', '#ff3d8b', 'toko', 30, 'hati', '#fff', '#ff3d8b'],
    linkedin: ['LinkedIn', '#3a7fc4', '#1f5c99', 'gedung', 50, 'in', '#fff', '#1f6bb0'],
    pinterest: ['Pinterest', '#d9434c', '#a8232c', 'pelana', 24, 'pin', '#fff', '#c8232c'],
    gudang: ['Gudang', '#b8834f', '#8a5a2b', 'gudang', 22, 'kardus', '#fff4d6', '#8a5a2b'],
    kantor: ['Kantor', '#8fb3d9', '#4f7cab', 'gedung', 50, 'grafik', '#fff', '#2f6fed'],
    toko: ['Toko', '#f6d27a', '#e2483d', 'toko', 30, 'kios', '#fff', '#e2483d'],
    lain: ['Rumah', '#e3c59a', '#b5523b', 'pelana', 24, '', '#fff', '#7a4b2a']
  };

  var GELAP = '--lk-l1:#0a1030;--lk-l2:#2a2f6c;--lk-jalan:#2c3242;--lk-garis:#8f96ad;--lk-trotoar:#565c70;' +
    '--lk-rumput:#256b45;--lk-tanah:#5c452f;--lk-tanah2:#463423;--lk-kaca:#ffd75e;' +
    '--lk-f:brightness(.6) saturate(.9);--lk-pijar:drop-shadow(0 0 3px #ffd34d);--lk-plat:#1b2340;' +
    '--lk-tinta:#f1f4ff;--lk-siang:0;--lk-malam:1;--lk-bingkai:#0d1330;';

  var CSS = [
    '.lk-kota{--lk-l1:#7cc8ff;--lk-l2:#e2f4ff;--lk-jalan:#8d99ab;--lk-garis:#fff;--lk-trotoar:#e9e2d0;',
    '--lk-rumput:#6cc36e;--lk-tanah:#b98a5a;--lk-tanah2:#9a6f45;--lk-kaca:#bfe6fa;--lk-f:none;--lk-pijar:none;',
    '--lk-plat:#fff;--lk-tinta:#1d2433;--lk-siang:1;--lk-malam:0;--lk-bingkai:#b9d9ee;',
    'position:relative;display:block;width:100%;max-width:100%;min-width:0;box-sizing:border-box;overflow:hidden;',
    'border-radius:14px;border:1px solid var(--lk-bingkai);background:linear-gradient(var(--lk-l1),var(--lk-l2));',
    'font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;line-height:1}',
    '@media (prefers-color-scheme:dark){.lk-kota:not(.lk-terang){' + GELAP + '}}',
    '.lk-kota.lk-gelap{' + GELAP + '}',
    '.lk-svg{display:block;width:100%;height:auto;max-height:' + TMAKS + 'px;margin:0 auto;overflow:hidden}',
    '.lk-svg text{font-family:inherit;font-weight:800;user-select:none;-webkit-user-select:none}',
    '.lk-siang{opacity:var(--lk-siang)}.lk-malam{opacity:var(--lk-malam)}',
    '.lk-fj{fill:var(--lk-jalan)}.lk-ft{fill:var(--lk-trotoar)}.lk-fr{fill:var(--lk-rumput)}',
    '.lk-fn{fill:var(--lk-tanah)}.lk-fn2{fill:var(--lk-tanah2)}.lk-fl{fill:var(--lk-l1)}',
    '.lk-garis{stroke:var(--lk-garis)}',
    '.lk-bdn{filter:var(--lk-f)}.lk-lmp{filter:var(--lk-pijar)}',
    '.lk-kaca{fill:var(--lk-kaca)}.lk-nyala{fill:#ffd75e}',
    '.lk-plat{fill:var(--lk-plat)}.lk-tinta{fill:var(--lk-tinta)}',
    '.lk-tp{fill:#fff;stroke:rgba(15,25,40,.7);paint-order:stroke;stroke-linejoin:round}',
    '.lk-no{fill:#fff;opacity:.7}',
    '.lk-kav,.lk-agen{cursor:pointer;outline:none;-webkit-tap-highlight-color:transparent}',
    '.lk-kena{fill:#000;fill-opacity:0;stroke:transparent;stroke-width:3;stroke-linejoin:round;pointer-events:all}',
    '.lk-kav:focus-visible .lk-kena,.lk-agen:focus-visible .lk-kena{stroke:#ffb300}',
    '@media (hover:hover){.lk-kav:hover .lk-fr{filter:brightness(1.12)}.lk-agen:hover .lk-hd{filter:brightness(1.15)}}',
    '.lk-atas{pointer-events:none}',
    '.lk-asap{transform-box:fill-box;transform-origin:50% 50%;animation:lk-asap 2.6s ease-out infinite}',
    '.lk-kedip{animation:lk-kedip 1.1s ease-in-out infinite}',
    '.lk-denyut{transform-box:fill-box;transform-origin:50% 50%;animation:lk-denyut 1.6s ease-in-out infinite}',
    '.lk-ayun{animation:lk-ayun 2.4s ease-in-out infinite alternate}',
    '.lk-tukang{animation:lk-tukang 5s linear infinite alternate}',
    '.lk-awan{animation:lk-awan 16s ease-in-out infinite alternate}',
    '.lk-jln .lk-k1{animation:lk-langkah .45s linear infinite}',
    '.lk-jln .lk-k2{animation:lk-langkah .45s linear -.22s infinite}',
    '@keyframes lk-asap{0%{transform:translate(0,0) scale(.6);opacity:.85}100%{transform:translate(5px,-20px) scale(1.5);opacity:0}}',
    '@keyframes lk-kedip{0%,100%{opacity:1}50%{opacity:.25}}',
    '@keyframes lk-denyut{0%,100%{transform:scale(1)}50%{transform:scale(1.14)}}',
    '@keyframes lk-ayun{0%{transform:translateY(0)}100%{transform:translateY(7px)}}',
    '@keyframes lk-tukang{0%{transform:translate(0,0)}100%{transform:translate(34px,17px)}}',
    '@keyframes lk-awan{0%{transform:translateX(0)}100%{transform:translateX(18px)}}',
    '@keyframes lk-langkah{0%,100%{transform:translateY(0)}50%{transform:translateY(-2.5px)}}',
    '@media (prefers-reduced-motion:reduce){.lk-kota *{animation:none!important;transition:none!important}}'
  ].join('');

  /* ---------- alat kecil ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function warnaAman(w, cadangan) {
    return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(w || '') ? w : cadangan;
  }
  // k<0 menggelapkan, k>0 mencerahkan; warna bukan hex (gradasi) diberi pengganti
  function rona(hex, k) {
    if (hex.charAt(0) !== '#') return k < 0 ? '#6a2c8a' : '#f7b267';
    var h = hex.slice(1);
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16), t = k < 0 ? 0 : 255, a = Math.abs(k);
    var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    r = Math.round(r + (t - r) * a); g = Math.round(g + (t - g) * a); b = Math.round(b + (t - b) * a);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }
  function jepit(n, a, b) { return n < a ? a : n > b ? b : n; }
  function f1(n) { return Math.round(n * 10) / 10; }
  function potong(t, n) { t = String(t == null ? '' : t); return t.length > n ? t.slice(0, n - 1) + '…' : t; }
  // dunia -> layar
  function S(x, y) { return [OX + (x - y) * A, OY + (x + y) * A / 2]; }
  function sp(x, y, z) { var s = S(x, y); return f1(s[0]) + ' ' + f1(s[1] - (z || 0)); }
  // koordinat dalam kavling (0..1) -> layar lokal kavling
  function p(u, v, z) { return f1((u - v) * A) + ' ' + f1((u + v) * A / 2 - (z || 0)); }
  function poli(t, isi, lain) { return '<path d="M' + t.join('L') + 'z" fill="' + isi + '"' + (lain || '') + '/>'; }
  function garis(t, w, lebar, lain) {
    return '<path d="M' + t.join('L') + '" fill="none" stroke="' + w + '" stroke-width="' + lebar + '" stroke-linecap="round"' + (lain || '') + '/>';
  }
  function kubus(u0, v0, u1, v1, z0, z1, c, ct) {
    var ki = poli([p(u0, v1, z0), p(u1, v1, z0), p(u1, v1, z1), p(u0, v1, z1)], c),
      kn = [p(u1, v1, z0), p(u1, v0, z0), p(u1, v0, z1), p(u1, v1, z1)],
      at = [p(u0, v0, z1), p(u1, v0, z1), p(u1, v1, z1), p(u0, v1, z1)];
    if (c.charAt(0) !== '#' && c.charAt(0) !== 'r') {
      return ki + poli(kn, c) + poli(kn, '#000', ' opacity=".2" stroke="none"') + poli(at, ct || c) +
        (ct ? '' : poli(at, '#fff', ' opacity=".3" stroke="none"'));
    }
    return ki + poli(kn, rona2(c, -0.2)) + poli(at, ct || rona2(c, 0.28));
  }
  function rona2(c, k) { return c.charAt(0) === '#' ? rona(c, k) : c; }
  // gambar di dinding kiri (+v) / kanan (+u): x menyusur dinding, y negatif = naik
  function kiri(u, v, z, isi) { return '<g transform="matrix(1 .5 0 1 ' + p(u, v, z) + ')">' + isi + '</g>'; }
  function kanan(u, v, z, isi) { return '<g transform="matrix(1 -.5 0 1 ' + p(u, v, z) + ')">' + isi + '</g>'; }
  function jdl(x, y, w, h, nyala) {
    return '<rect class="lk-kaca' + (nyala ? ' lk-nyala' : '') + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h +
      '" rx="1.2" stroke="#fff" stroke-width="1.2"/>';
  }
  function baris(h, xs, w, nyala) {
    var s = '', y, i;
    for (y = -(h - 6); y + 9 <= -5; y += 15) for (i = 0; i < xs.length; i++) s += jdl(xs[i], y, w, 9, nyala);
    return s;
  }
  function asap(u, v, z) {
    var q = p(u, v, z).split(' '), s = '<g fill="#fff" stroke="none" opacity=".9">', i;
    for (i = 0; i < 3; i++) s += '<circle class="lk-asap" style="animation-delay:-' + (i * 0.87) + 's" cx="' + (+q[0] + i - 1) + '" cy="' + q[1] + '" r="' + (4.5 - i * 0.5) + '"/>';
    return s + '</g>';
  }
  function pohon(u, v) {
    var q = p(u, v).split(' '), x = +q[0], y = +q[1];
    return '<path d="M' + x + ' ' + y + 'v-8" stroke="#7a4b2a" stroke-width="2.4" stroke-linecap="round"/>' +
      '<circle cx="' + x + '" cy="' + (y - 12) + '" r="6.5" fill="#3f9d55"/><circle cx="' + (x - 2) + '" cy="' + (y - 14) + '" r="3" fill="#62bd6f" stroke="none"/>';
  }

  /* ---------- simbol (kotak ±11, bukan logo merek) ---------- */
  function simbol(n, c, bg, huruf) {
    var g = ' fill="none" stroke="' + c + '" stroke-linecap="round" stroke-linejoin="round" stroke-width="';
    switch (n) {
      case 'play': return '<path d="M-5.500-8L9 0L-5.500 8z" fill="' + c + '" stroke="' + c + '" stroke-width="2" stroke-linejoin="round"/>';
      case 'kamera': return '<rect x="-9" y="-9" width="18" height="18" rx="5.500"' + g + '2.6"/><circle r="4"' + g + '2.6"/><circle cx="5.300" cy="-5.300" r="1.4" fill="' + c + '"/>';
      case 'not': return '<path d="M-2 5V-9q6 .5 7 6"' + g + '2.8"/><ellipse cx="-5" cy="5.500" rx="4" ry="3.2" fill="' + c + '"/><path d="M-3.500 -8.500q5 0 6 5" fill="none" stroke="#25d6cf" stroke-width="1.2" opacity=".9"/>';
      case 'tas': return '<path d="M-8-3h16l-1.500 12h-13z" fill="' + c + '"/><path d="M-4-3v-2.500a4 4 0 0 1 8 0v2.500"' + g + '2.2"/>';
      case 'hati': return '<path d="M0 8.500C-13-.5-7.500-11 0-4.500C7.500-11 13-.5 0 8.500z" fill="' + c + '"/>';
      case 'pin': return '<circle cy="-3.500" r="6" fill="' + c + '"/><path d="M0 2v8.500"' + g + '2.4"/><circle cx="-2" cy="-5.500" r="1.6" fill="#fff" opacity=".7"/>';
      case 'gigi': return '<circle r="7.500"' + g + '5" stroke-dasharray="3.4 2.5" stroke-linecap="butt"/><circle r="6" fill="' + c + '"/><circle r="2.6" fill="' + bg + '"/>';
      case 'klaper': return '<rect x="-9" y="-3" width="18" height="12" rx="1.5" fill="' + c + '"/><path d="M-9-9.500l18-2v5l-18 2z" fill="' + c + '"/><path d="M-5-10l2.500 5M1-10.600l2.500 5M6.500-11.200l2 4.800" stroke="' + bg + '" stroke-width="1.8"/>';
      case 'grafik': return '<path d="M-9 9h18"' + g + '2"/><rect x="-7.500" y="1" width="4" height="6.500" fill="' + c + '"/><rect x="-2" y="-3" width="4" height="10.500" fill="' + c + '"/><rect x="3.500" y="-8" width="4" height="15.500" fill="' + c + '"/>';
      case 'kardus': return '<path d="M-8-4L0-8L8-4V5L0 9L-8 5z" fill="#d2a45f" stroke="' + c + '" stroke-width="1.6" stroke-linejoin="round"/><path d="M-8-4L0 0L8-4M0 0V9"' + g + '1.6"/>';
      case 'kios': return '<path d="M-9-2l2-7h14l2 7z" fill="' + c + '"/><path d="M-7-2v10h14V-2"' + g + '2.2"/><rect x="-2" y="2" width="4" height="6" fill="' + c + '"/>';
    }
    var t = n || huruf || '?', fs = t.length > 1 ? 16 : 21;
    return '<text y="' + (fs * 0.35) + '" text-anchor="middle" font-size="' + fs + '" font-weight="900" fill="' + c + '">' + esc(t) + '</text>';
  }
  // papan simbol tegak di atap, menghadap layar
  function papan(u, v, z, uk, J, huruf) {
    var q = p(u, v, z).split(' '), x = +q[0], y = +q[1];
    return '<path d="M' + x + ' ' + y + 'v-5" stroke="#4b5563" stroke-width="2.5"/>' +
      '<rect x="' + f1(x - uk / 2) + '" y="' + f1(y - 4 - uk) + '" width="' + uk + '" height="' + uk + '" rx="' + f1(uk / 4.5) + '" fill="' + J[6] +
      '" stroke="' + (J[6] === '#fff' ? J[7] : '#fff') + '" stroke-width="2"/>' +
      '<g transform="translate(' + x + ' ' + f1(y - 4 - uk / 2) + ') scale(' + f1(uk / 31 * 10) / 10 + ')">' + simbol(J[5], J[7], J[6], huruf) + '</g>';
  }

  /* ---------- isi kavling ---------- */
  function jenisDari(r) { return JENIS[r.jenis] || JENIS.lain; }
  function namaDari(r) { return String(r.nama || jenisDari(r)[0]); }

  // rumah utuh; mengembalikan {s, py} (py = tinggi layar lokal tengah papan simbol)
  function rumahBuka(r) {
    var J = jenisDari(r), c = warnaAman(r.warna, J[1]), a = J[2], b = J[3], h = J[4], B = '', zp = h, uk = 30, dg = rona(c, -0.45);
    var nyala = b === 'studio' && r.sibuk, huruf = namaDari(r).charAt(0).toUpperCase();
    var pintu = '<rect x="18" y="-19" width="11" height="19" rx="1.5" fill="' + dg + '" stroke="#fff" stroke-width="1"/><circle cx="26.500" cy="-9" r="1" fill="#ffd75e" stroke="none"/>';
    LMP = '';
    B += kubus(F0, F0, F1, F1, 0, h, c);
    if (b === 'pelana' || b === 'gudang') {
      var hr = b === 'gudang' ? 16 : 18;
      B += poli([p(F1, F1, h), p(F1, F0, h), p(F1, 0.53, h + hr)], rona(c, -0.2));
      B += poli([p(F0 - 0.03, F1 + 0.04, h - 2), p(F1 + 0.03, F1 + 0.04, h - 2), p(F1 + 0.03, 0.53, h + hr), p(F0 - 0.03, 0.53, h + hr)], a);
      B += garis([p(F0 - 0.03, 0.72, h + hr * 0.46), p(F1 + 0.03, 0.72, h + hr * 0.46)], 'rgba(0,0,0,.18)', 1);
      zp = h + hr * 0.5;
      LMP += kanan(F1, F1, h, '<circle class="lk-kaca" cx="23.700" cy="-6" r="3.4" stroke="#fff" stroke-width="1.2"/>');
      if (b === 'gudang') {
        B += kiri(F0, F1, 0, '<path d="M0-7.500h47.500M0-15h47.500" stroke="rgba(0,0,0,.18)" stroke-width="1" fill="none"/>' +
          '<rect x="11" y="-19" width="25" height="19" rx="1" fill="' + dg + '" stroke="#fff" stroke-width="1"/><path d="M11-19l25 19M36-19l-25 19M23.500-19v19" stroke="#fff" stroke-width=".8" opacity=".6"/>');
        LMP += kanan(F1, F1, 0, jdl(18, -16, 12, 9));
      } else {
        B += kiri(F0, F1, 0, pintu);
        LMP += kiri(F0, F1, 0, baris(h, [4, 34], 10)) + kanan(F1, F1, 0, baris(h, [6, 30], 11));
      }
    } else if (b === 'toko') {
      B += kanan(F1, F1, 0, '<rect x="0" y="-' + h + '" width="47.500" height="7" fill="' + a + '" stroke="none"/>');
      B += kiri(F0, F1, 0, '<rect x="0" y="-' + h + '" width="47.500" height="7" fill="' + a + '" stroke="none"/>' + pintu);
      LMP += kiri(F0, F1, 0, jdl(33, -15, 11, 11) + jdl(4, -15, 10, 11)) + kanan(F1, F1, 0, jdl(5, -15, 37, 11));
      // tenda bergaris
      var gar = '', i;
      for (i = 0; i < 5; i++) gar += '<rect x="' + (i * 10.6) + '" y="-5" width="5.300" height="5" fill="#fff" stroke="none"/>';
      B += kubus(F0, F1, F1, F1 + 0.08, 17, 22, a) + kiri(F0, F1 + 0.08, 17, gar);
      B += kubus(F1, F0, F1 + 0.08, F1 + 0.08, 17, 22, a) + kanan(F1 + 0.08, F1 + 0.08, 17, gar);
    } else {
      B += poli([p(0.26, 0.26, h), p(0.8, 0.26, h), p(0.8, 0.8, h), p(0.26, 0.8, h)], rona2(rona(c, -0.14), 0));
      if (b === 'pabrik') {
        B += kubus(0.28, 0.28, 0.38, 0.38, h, h + 22, '#c96a4f') + kubus(0.46, 0.28, 0.56, 0.38, h, h + 15, '#c96a4f');
        B += asap(0.33, 0.33, h + 27) + asap(0.51, 0.33, h + 20);
        B += kiri(F0, F1, 0, '<rect x="14" y="-18" width="19" height="18" rx="1" fill="#59616e" stroke="#fff" stroke-width="1"/><path d="M14-12h19M14-6h19" stroke="#fff" stroke-width=".8" opacity=".5"/>');
        LMP += kiri(F0, F1, 0, jdl(36, -24, 9, 9) + jdl(3, -24, 9, 9)) + kanan(F1, F1, 0, baris(h, [6, 30], 11));
      } else {
        if (b === 'studio') {
          B += kubus(0.26, 0.26, 0.58, 0.58, h, h + 10, rona(c, 0.22));
          if (r.sibuk) {
            B += kubus(0.3, 0.64, 0.37, 0.71, h, h + 8, '#59616e') + asap(0.335, 0.675, h + 12);
            LMP += '<circle class="lk-kedip" cx="0" cy="' + f1(0.84 * A / 2 - h - 14) + '" r="3.4" fill="#ff3b30" stroke="#fff" stroke-width="1"/>';
          }
        } else if (b === 'gedung') {
          B += kubus(0.3, 0.3, 0.44, 0.44, h, h + 6, '#cfd6de');
          uk = 26;
        }
        B += kiri(F0, F1, 0, pintu);
        LMP += kiri(F0, F1, 0, baris(h, [4, 34], 10, nyala)) + kanan(F1, F1, 0, baris(h, [6, 30], 11, nyala));
      }
    }
    LMP += papan(0.7, 0.7, zp, uk, J, huruf);
    if (b === 'gudang') B += kubus(0.89, 0.46, 0.99, 0.6, 0, 8, '#d2a45f') + kubus(0.89, 0.64, 0.99, 0.8, 0, 11, '#c9955a');
    else B += pohon(0.93, 0.1);
    return {
      s: '<g class="lk-bdn" stroke="rgba(0,0,0,.3)" stroke-width=".8" stroke-linejoin="round">' + B + '</g><g class="lk-lmp">' + LMP + '</g>',
      py: 1.4 * A / 2 - zp - 4 - uk / 2, uk: uk
    };
  }

  function orang(warna, paket, helm) {
    var g = rona(warna, -0.35);
    return '<ellipse cx="0" cy="0" rx="8" ry="3" fill="#000" opacity=".22"/>' +
      '<g class="lk-k1"><rect x="-5" y="-9" width="4.5" height="9" rx="1.5" fill="#39425a"/></g>' +
      '<g class="lk-k2"><rect x=".5" y="-9" width="4.5" height="9" rx="1.5" fill="#39425a"/></g>' +
      '<rect x="-7" y="-20" width="14" height="13" rx="4" fill="' + warna + '" stroke="#fff" stroke-width="1"/>' +
      (paket ? '<rect x="3.500" y="-17" width="8.500" height="7.500" rx="1" fill="#c98b4b" stroke="#7a4b2a" stroke-width="1"/>' : '') +
      '<circle cx="0" cy="-25" r="6.300" fill="#ffd9a0" stroke="rgba(0,0,0,.3)" stroke-width=".6"/>' +
      '<path d="M-6.500-26a6.500 6.500 0 0 1 13 0z" fill="' + (helm || g) + '"/>' +
      '<circle cx="-2.200" cy="-24" r=".9" fill="#1d2433"/><circle cx="2.200" cy="-24" r=".9" fill="#1d2433"/>';
  }

  function lahanKosong() {
    var q = [[0.14, 0.14], [0.86, 0.14], [0.86, 0.86], [0.14, 0.86]], s = '', i, t = [];
    for (i = 0; i < 4; i++) t.push(p(q[i][0], q[i][1], 7));
    s += '<path d="M-20 30l-2-5m2 5v-6m0 6l2-5M24 44l-2-5m2 5v-6m0 6l2-5M-6 58l-2-5m2 5v-6m0 6l2-5" stroke="#2f8f4e" stroke-width="1.4" fill="none" stroke-linecap="round"/>';
    s += poli(t, 'none', ' stroke="#fff" stroke-width="1.2" stroke-dasharray="4 3" opacity=".85"');
    for (i = 0; i < 4; i++) {
      s += garis([p(q[i][0], q[i][1]), p(q[i][0], q[i][1], 9)], '#8a5a2b', 2.6) +
        '<circle cx="' + f1((q[i][0] - q[i][1]) * A) + '" cy="' + f1((q[i][0] + q[i][1]) * A / 2 - 10) + '" r="2" fill="#e2483d"/>';
    }
    // papan kayu bertanda +
    s += '<path d="M0 34v-14" stroke="#7a4b2a" stroke-width="2.6" stroke-linecap="round"/>' +
      '<rect x="-11" y="5" width="22" height="17" rx="3.500" fill="#d9a05b" stroke="#7a4b2a" stroke-width="1.4"/>' +
      '<path d="M-5 13.500h10M0 8.500v10" stroke="#fff" stroke-width="2.8" stroke-linecap="round"/>';
    return s;
  }
  function lahanUsul() {
    return poli([p(0.08, 0.08), p(0.92, 0.08), p(0.92, 0.92), p(0.08, 0.92)], '#ffd23f',
      ' class="lk-kedip" fill-opacity=".28" stroke="#ffb300" stroke-width="2.2" stroke-dasharray="7 4"') +
      '<path d="M-22 64v-22M22 64v-22" stroke="#7a4b2a" stroke-width="3" stroke-linecap="round"/>';
  }
  function lahanBangun() {
    var s = '', T = 44, k = '#b07a3c', q = [[0.16, 0.16], [0.16, 0.9], [0.9, 0.16], [0.9, 0.9]], i, x = 0.44 * A, y = 1.04 * A / 2 - 60;
    s += '<g stroke="rgba(0,0,0,.3)" stroke-width=".8" stroke-linejoin="round">' + kubus(F0, F0, F1, F1, 0, 4, '#cfd3d8') +
      kubus(F0, F0, F1, 0.5, 4, 24, '#d98b5f') + '</g>';
    s += kiri(F0, 0.5, 4, '<path d="M0-7h47.500M0-13.500h47.500M12-7v7M30-7v7M21-13.500v6.500M39-13.500v6.500M12-20v6.500M30-20v6.500" stroke="#fff" stroke-width=".8" opacity=".55" fill="none"/>');
    for (i = 0; i < 4; i++) s += garis([p(q[i][0], q[i][1]), p(q[i][0], q[i][1], T)], k, 2.4);
    s += garis([p(0.16, 0.9, 22), p(0.9, 0.9, 22), p(0.9, 0.16, 22)], '#c9975a', 3) + garis([p(0.16, 0.9, T), p(0.9, 0.9, T), p(0.9, 0.16, T)], '#c9975a', 3) +
      garis([p(0.16, 0.9, 0), p(0.9, 0.9, 22)], k, 1.2, ' opacity=".7"') + garis([p(0.9, 0.9, 22), p(0.9, 0.16, T)], k, 1.2, ' opacity=".7"');
    // derek kecil
    s += garis([p(0.74, 0.3), p(0.74, 0.3, 60)], '#f2b01e', 3.4) +
      '<path d="M' + f1(x + 13) + ' ' + f1(y) + 'H' + f1(x - 46) + 'M' + f1(x) + ' ' + f1(y - 8) + 'L' + f1(x - 30) + ' ' + f1(y) + 'M' + f1(x) + ' ' + f1(y - 8) + 'v8" stroke="#f2b01e" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<rect x="' + f1(x + 6) + '" y="' + f1(y - 1) + '" width="9" height="7" rx="1" fill="#59616e"/>' +
      '<g class="lk-ayun"><path d="M' + f1(x - 36) + ' ' + f1(y) + 'v14" stroke="#3a3f4a" stroke-width="1.2"/><rect x="' + f1(x - 41) + '" y="' + f1(y + 14) + '" width="10" height="7" rx="1" fill="#d98b5f" stroke="#7a3f22" stroke-width="1"/></g>';
    // tukang bawa balok
    s += '<g transform="translate(' + p(0.3, 0.97) + ')"><g class="lk-tukang"><g transform="scale(.62)">' + orang('#f39a4a', 1, '#ffd23f') + '</g></g></g>';
    return s;
  }

  /* ---------- teks di lapis atas ---------- */
  function lebarTeks(t, fs) { return t.length * fs * 0.6; }
  // baris: [[teks, ukuran], ...]; kotak menempel di atas yb
  function plat(cx, yb, brs, o) {
    var w = 0, h = 0, i, s = '', ph = 3.5 * K, pv = 2.2 * K, maks = o.maks || 138, y, t = '', l;
    for (i = 0; i < brs.length; i++) { w = Math.max(w, lebarTeks(brs[i][0], brs[i][1])); h += brs[i][1] * 1.16; }
    w = Math.min(w, maks);
    y = yb - h - 2 * pv;
    for (i = 0; i < brs.length; i++) {
      l = lebarTeks(brs[i][0], brs[i][1]);
      t += '<text x="' + f1(cx) + '" y="' + f1(y + pv + brs[i][1] * 0.92) + '" text-anchor="middle" font-size="' + f1(brs[i][1]) + '"' +
        (l > maks ? ' textLength="' + maks + '" lengthAdjust="spacingAndGlyphs"' : '') +
        (o.fg ? ' fill="' + o.fg + '"' : ' class="lk-tinta"') + (i && brs.length > 1 && brs[i][1] < brs[0][1] ? ' opacity=".8"' : '') + '>' + esc(brs[i][0]) + '</text>';
      y += brs[i][1] * 1.16;
    }
    y = yb - h - 2 * pv;
    s += '<rect x="' + f1(cx - w / 2 - ph) + '" y="' + f1(y) + '" width="' + f1(w + 2 * ph) + '" height="' + f1(h + 2 * pv) + '" rx="' + f1(3 * K) + '"' +
      (o.bg ? ' fill="' + o.bg + '"' : ' class="lk-plat"') + ' stroke="' + (o.grs || '#1d2433') + '" stroke-width="' + (o.tebal || 1.2) + '"' + (o.kelas ? ' class="' + o.kelas + '"' : '') + '/>';
    return '<g>' + s + t + '</g>';
  }
  function gelembung(cx, cy, t, bg, besar, kelas) {
    var fs = (besar ? 9.5 : 8) * K, r = fs * 0.78, w = Math.max(2 * r, lebarTeks(t, fs) + fs * 0.8);
    return '<g' + (kelas ? ' class="' + kelas + '"' : '') + '><rect x="' + f1(cx - w / 2) + '" y="' + f1(cy - r) + '" width="' + f1(w) + '" height="' + f1(2 * r) + '" rx="' + f1(r) +
      '" fill="' + bg + '" stroke="#fff" stroke-width="1.6"/><text x="' + f1(cx) + '" y="' + f1(cy + fs * 0.35) + '" text-anchor="middle" font-size="' + f1(fs) + '" fill="#fff">' + esc(t) + '</text></g>';
  }

  function ringkas(r) {
    var b = [], j = r.jumlah || {};
    if (j.siap_cek > 0) b.push(j.siap_cek + ' siap dicek');
    if (j.disetujui > 0) b.push(j.disetujui + ' disetujui');
    if (j.tayang > 0) b.push(j.tayang + ' tayang');
    if (r.sibuk) b.push('sedang sibuk');
    if (r.antre > 0) b.push(r.antre + ' antre');
    if (r.inti) b.push('bangunan inti');
    return b;
  }
  function labelKavling(no, r) {
    if (!r) return 'Kavling ' + no + ': lahan kosong, ketuk untuk membangun';
    var n = namaDari(r);
    if (r.keadaan === 'usul') return 'Kavling ' + no + ': usulan ' + n + (r.oleh ? ' oleh ' + r.oleh : '') + (r.alasan ? '. Alasan: ' + r.alasan : '');
    if (r.keadaan === 'dibangun') return 'Kavling ' + no + ': ' + n + ', lagi dibangun';
    return 'Kavling ' + no + ': ' + [n, 'buka'].concat(ringkas(r)).join(', ');
  }

  /* ---------- latar ---------- */
  function dasar() {
    var s = '', i, g;
    s += '<defs><linearGradient id="lk-gi" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7b3fd1"/><stop offset=".55" stop-color="#e1306c"/><stop offset="1" stop-color="#fca044"/></linearGradient></defs>';
    s += '<g class="lk-siang"><circle cx="66" cy="54" r="30" fill="#ffe066" opacity=".3"/><circle cx="66" cy="54" r="21" fill="#ffe066"/><g class="lk-awan" fill="#fff" opacity=".92">';
    g = [[590, 34, 1], [690, 96, 0.7], [84, 372, 0.85], [640, 398, 0.75]];
    for (i = 0; i < g.length; i++) {
      s += '<g transform="translate(' + g[i][0] + ' ' + g[i][1] + ') scale(' + g[i][2] + ')"><rect x="0" y="12" width="64" height="14" rx="7"/><rect x="10" y="4" width="26" height="16" rx="8"/><rect x="30" y="0" width="24" height="20" rx="9"/></g>';
    }
    s += '</g></g><g class="lk-malam"><circle cx="66" cy="54" r="18" fill="#fdf6d8"/><circle class="lk-fl" cx="75" cy="48" r="16"/>';
    for (i = 0; i < 22; i++) s += '<circle cx="' + ((i * 97 + 30) % VW) + '" cy="' + ((i * 61 + 14) % VH) + '" r="' + (i % 3 ? 1 : 1.7) + '" fill="#fff" opacity="' + (0.45 + (i % 4) * 0.13) + '"/>';
    s += '</g>';
    // pulau: sisi tanah + permukaan jalan
    s += '<path class="lk-fn" d="M' + [sp(0, WY), sp(WX, WY), sp(WX, WY, -16), sp(0, WY, -16)].join('L') + 'z"/>' +
      '<path class="lk-fn2" d="M' + [sp(WX, WY), sp(WX, 0), sp(WX, 0, -16), sp(WX, WY, -16)].join('L') + 'z"/>' +
      '<path class="lk-fj" d="M' + [sp(0, 0), sp(WX, 0), sp(WX, WY), sp(0, WY)].join('L') + 'z" stroke="rgba(0,0,0,.25)" stroke-width="1"/>';
    g = '';
    for (i = 0; i <= BAR; i++) g += 'M' + sp(0.12, i * P + R / 2) + 'L' + sp(WX - 0.12, i * P + R / 2);
    for (i = 0; i <= KOL; i++) g += 'M' + sp(i * P + R / 2, 0.12) + 'L' + sp(i * P + R / 2, WY - 0.12);
    return s + '<path class="lk-garis" d="' + g + '" fill="none" stroke-width="1.5" stroke-dasharray="7 8" opacity=".7"/>';
  }

  /* ---------- jalur agen ---------- */
  function letakKav(no) { var n = no - 1; return { i: n % KOL, j: (n / KOL) | 0 }; }
  function Yg(g) { return g * P + R / 2; }
  function depan(no, geser) { var l = letakKav(no); return [R + l.i * P + PX + (geser || 0), Yg(l.j + 1)]; }
  function mulut(no) { var l = letakKav(no); return [R + l.i * P + PX, R + l.j * P + 0.9]; }
  function rute(a, b) {
    if (Math.abs(a[1] - b[1]) < 0.01) return [b];
    var c, d, bd = 1e9, x = 0;
    for (c = 0; c <= KOL; c++) { d = Math.abs(a[0] - (c * P + R / 2)) + Math.abs(c * P + R / 2 - b[0]); if (d < bd) { bd = d; x = c * P + R / 2; } }
    return [[x, a[1]], [x, b[1]], b];
  }
  // garis waktu berulang: ruas {x0,y0,x1,y1,t0,t1,m,no}; m: 0 jalan, 1 masuk, 2 di dalam, 3 keluar, 4 diam
  function Waktu(awal) { this.s = []; this.T = 0; this.q = awal; }
  Waktu.prototype.ke = function (q, m, dur, no) {
    var a = this.q, d = dur == null ? (Math.abs(q[0] - a[0]) + Math.abs(q[1] - a[1])) / KEC : dur;
    if (d <= 0) return;
    this.s.push({ x0: a[0], y0: a[1], x1: q[0], y1: q[1], t0: this.T, t1: this.T + d, m: m, no: no });
    this.T += d; this.q = q;
  };
  Waktu.prototype.lewat = function (r) { for (var i = 0; i < r.length; i++) this.ke(r[i], 0); };
  function singgah(w, no, adaPintu, lama) {
    if (adaPintu) { w.ke(mulut(no), 1, 0.9, no); w.ke(mulut(no), 2, lama, no); w.ke(depan(no), 3, 0.9, no); }
    else w.ke(depan(no), 4, lama + 1);
  }
  function kunciUrut(sg, x, y) {
    var l, g, j, c;
    if (sg.m >= 1 && sg.m <= 3) { l = letakKav(sg.no); return l.j * 100 + l.i * 10 + 7; }
    g = Math.round((y - R / 2) / P);
    if (Math.abs(y - Yg(g)) < 0.02) return g * 100;
    j = Math.floor((y - R / 2) / P); c = Math.round((x - R / 2) / P);
    return j * 100 + c * 10;
  }

  /* ---------- susun ---------- */
  function ukur(kota) {
    var w = kota.clientWidth || 0, sk;
    if (!w) return { k: 1.6, kt: 1.6 };
    sk = Math.min(w / VW, TMAKS / VH);
    return { k: jepit(1 / sk, 1, 2.1), kt: jepit(1 / sk, 0.7, 2.6) };
  }

  function bangun(el, data) {
    var st = el.__lk, kota = el.querySelector(':scope > .lk-kota'), u, i, n;
    if (!kota) {
      el.textContent = '';
      kota = document.createElement('div');
      kota.setAttribute('role', 'group');
      kota.setAttribute('aria-label', 'Kota Ludlud: 12 kavling. Ketuk lahan kosong untuk membangun, ketuk rumah atau agen untuk melihat isinya.');
      el.appendChild(kota);
      if (st.ro) st.ro.disconnect();
      if (window.ResizeObserver) {
        st.ro = new ResizeObserver(function () {
          var b = ukur(kota);
          if (st.data && (Math.abs(b.k - st.k) > 0.08 || Math.abs(b.kt - st.kt) > 0.15)) bangun(el, st.data);
        });
        st.ro.observe(kota);
      }
    }
    kota.className = 'lk-kota' + (data.tema === 'gelap' ? ' lk-gelap' : data.tema === 'terang' ? ' lk-terang' : '');
    u = ukur(kota); K = st.k = u.k; KT = st.kt = u.kt;
    var sempit = K > 1.45;  // layar HP: label dikurangi supaya tidak berdempet (nama agen & teks lahan via aria-label/title)

    var peta = {}, kav = data.kavling || [], fsU = 9.5 * K, fsK = 8 * K, bawah = '', atas = '', kunci = [];
    for (i = 0; i < kav.length; i++) {
      n = kav[i] && +kav[i].no;
      if (n >= 1 && n <= JML && n === Math.floor(n)) peta[n] = kav[i].rumah || null;
    }
    st.peta = peta;

    for (n = 1; n <= JML; n++) {
      var r = peta[n] || null, l = letakKav(n), q = S(R + l.i * P, R + l.j * P), tx = f1(q[0]), ty = f1(q[1]);
      var lab = labelKavling(n, r), isi, nm = r ? namaDari(r) : '', J = r ? jenisDari(r) : null, cw = r ? warnaAman(r.warna, J[1].charAt(0) === '#' ? J[1] : J[2]) : '';
      var maksHuruf = Math.max(8, Math.floor(138 / (fsU * 0.6)) + 2), tip = ty + A - 1;
      if (!r) {
        isi = lahanKosong();
        if (!sempit) atas += '<text class="lk-tp" x="' + tx + '" y="' + f1(ty + A - 6 - fsK * 0.2) + '" text-anchor="middle" font-size="' + f1(fsK) + '" stroke-width="' + f1(fsK * 0.3) + '">Lahan kosong</text>';
      } else if (r.keadaan === 'usul') {
        isi = lahanUsul();
        var brs = lebarTeks('Usulan: ' + nm, fsU) <= 138 ? [['Usulan: ' + nm, fsU]] : [['Usulan', fsK], [potong(nm, maksHuruf), fsU]];
        if (r.oleh) brs.push(['oleh ' + potong(r.oleh, 12), fsK]);
        atas += '<g class="lk-kedip">' + plat(tx, ty + 44, brs, { bg: '#ffb300', fg: '#ffb300', grs: '#ffb300', tebal: 5 }) + '</g>' +
          plat(tx, ty + 44, brs, { bg: '#fff7d1', fg: '#4a3200', grs: '#c98a00', tebal: 1.6 });
      } else if (r.keadaan === 'dibangun') {
        isi = lahanBangun();
        atas += plat(tx, tip, [['Lagi dibangun', fsK], [potong(nm, maksHuruf), fsU]], { bg: '#ffd23f', fg: '#3a2f0b', grs: '#3a2f0b', tebal: 1.4 });
      } else {
        var rb = rumahBuka(r), jm = r.jumlah || {}, by = ty + rb.py, sx = rb.uk / 2 + 4 + fsK * 0.6, yy;
        isi = rb.s;
        atas += plat(tx, tip, [[(r.inti ? '★ ' : '') + potong(nm, maksHuruf), fsU]], { grs: cw, tebal: 1.8 });
        if (jm.siap_cek > 0) atas += gelembung(tx + sx + K, by, String(jm.siap_cek), '#ff5a36', 1, 'lk-denyut');
        yy = by - (jm.disetujui > 0 && jm.tayang > 0 ? fsK * 0.85 : 0);
        if (jm.disetujui > 0) { atas += gelembung(tx - sx, yy, String(jm.disetujui), '#2f6fed'); yy += fsK * 1.7; }
        if (jm.tayang > 0) atas += gelembung(tx - sx, yy, String(jm.tayang), '#1f9d55');
        if (r.antre > 0 && !(jm.disetujui > 0 || jm.tayang > 0)) atas += gelembung(tx - sx - fsK * 1.6, by, 'antre ' + r.antre, '#5b6b8c');
        else if (r.antre > 0) atas += gelembung(tx + sx + K, by + fsU * 1.8, 'antre ' + r.antre, '#5b6b8c');
      }
      kunci.push(l.j * 100 + l.i * 10 + 5);
      bawah += '<g class="lk-kav" data-lk-no="' + n + '" transform="translate(' + tx + ' ' + ty + ')" role="button" tabindex="0" aria-label="' + esc(lab) + '">' +
        '<title>' + esc(lab) + '</title>' +
        poli([p(-0.05, -0.05), p(1.05, -0.05), p(1.05, 1.05), p(-0.05, 1.05)], '', ' class="lk-ft"').replace(' fill=""', '') +
        poli([p(0, 0), p(1, 0), p(1, 1), p(0, 1)], '', ' class="lk-fr" stroke="rgba(0,0,0,.18)" stroke-width=".8"').replace(' fill=""', '') +
        '<text class="lk-no" x="-45" y="' + f1(36 + 3.2 * K) + '" text-anchor="middle" font-size="' + f1(7 * K) + '">' + n + '</text>' +
        isi +
        '<path class="lk-kena" d="M' + [p(0, 1), p(1, 1), p(1, 0), p(1, 0, 44), p(0, 0, 44), p(0, 1, 44)].join('L') + 'z"/></g>';
    }

    /* agen */
    var agen = data.agen || [], keg = data.kegiatan || [], giat = {}, buka = [], semua = [], ag = [], KA = 1 + (K - 1) * 0.15, a, k;
    for (n = 1; n <= JML; n++) { semua.push(n); if (peta[n] && peta[n].keadaan !== 'usul' && peta[n].keadaan !== 'dibangun') buka.push(n); }
    function sah(v) { v = +v; return v >= 1 && v <= JML && v === Math.floor(v); }
    function berpintu(v) { return !!peta[v] && peta[v].keadaan !== 'usul' && peta[v].keadaan !== 'dibangun'; }
    for (i = 0; i < keg.length; i++) {
      k = keg[i];
      if (!k || !sah(k.dari) || !sah(k.ke) || +k.dari === +k.ke) continue;
      if (giat[k.agen]) giat[k.agen].lagi++; else giat[k.agen] = { k: k, lagi: 0 };
    }
    for (i = 0; i < agen.length; i++) {
      a = agen[i] || {};
      var wa = warnaAman(a.warna, '#44506a'), g = giat[a.nama], w, ket, kata = '', ts = 0.5, la, hit = 44 * KT;
      if (g) {
        var d = +g.k.dari, e = +g.k.ke;
        w = new Waktu(berpintu(d) ? mulut(d) : depan(d));
        if (berpintu(d)) { w.ke(mulut(d), 2, 1, d); w.ke(depan(d), 3, 0.9, d); } else w.ke(depan(d), 4, 1.5);
        ts = w.T; w.lewat(rute(depan(d), depan(e))); ts = (ts + w.T) / 2;
        singgah(w, e, berpintu(e), 1.6);
        w.lewat(rute(depan(e), depan(d)));
        if (berpintu(d)) w.ke(mulut(d), 1, 0.9, d);
        kata = potong((g.k.label || '') + (g.lagi ? ' +' + g.lagi : ''), 20);
        ket = 'berjalan dari ' + (peta[d] ? namaDari(peta[d]) : 'kavling ' + d) + ' ke ' + (peta[e] ? namaDari(peta[e]) : 'kavling ' + e) + (kata ? ', ' + kata : '');
      } else {
        // jalan santai: berkeliling beberapa rumah lalu kembali
        var dft = buka.length ? buka : semua, gs = (i % 2 ? 0.2 : -0.2), t0 = dft[(i * 5 + 1) % dft.length], t1 = dft[(i * 5 + 3 + i) % dft.length], t2 = dft[(i * 7 + 2) % dft.length];
        w = new Waktu(depan(t0, gs));
        w.ke(depan(t0, gs), 4, 4 + (i % 3) * 1.5);
        if (t1 !== t0) { w.lewat(rute(depan(t0, gs), depan(t1, gs))); w.ke(depan(t1, gs), 4, 5 + (i % 2) * 2); }
        if (t2 !== t1) { w.lewat(rute(w.q, depan(t2, gs))); w.ke(depan(t2, gs), 4, 3.5); }
        w.lewat(rute(w.q, depan(t0, gs)));
        ket = 'jalan santai';
      }
      la = 'Agen ' + (a.nama || '') + (a.peran ? ', ' + a.peran : '') + ': ' + ket;
      bawah += '<g class="lk-agen" data-lk-agen="' + esc(a.nama) + '" role="button" tabindex="0" aria-label="' + esc(la) + '"><title>' + esc(la) + '</title>' +
        '<g transform="scale(' + f1(KA * 10) / 10 + ')"><g class="lk-hd">' + orang(wa, !!g) + '</g></g>' +
        '<rect class="lk-kena" x="' + f1(-hit / 2) + '" y="' + f1(-16 * KA - hit / 2) + '" width="' + f1(hit) + '" height="' + f1(hit) + '" rx="6"/></g>';
      var yl = -33 * KA - 2, fn = 8 * K, nmA = potong(a.nama || '', 12), lw = lebarTeks(nmA, fn) + fn * 0.8;
      if (sempit) atas += '<g class="lk-al">' + (kata ? plat(0, yl - fn * 0.6, [[kata, 7.5 * K]], { bg: '#fff', fg: '#1d2433', grs: '#1d2433', tebal: 1, maks: 170 }) : '') + '</g>';
      else atas += '<g class="lk-al">' + (kata ? plat(0, yl - fn * 1.45, [[kata, 7.5 * K]], { bg: '#fff', fg: '#1d2433', grs: '#1d2433', tebal: 1, maks: 170 }) : '') +
        '<rect x="' + f1(-lw / 2) + '" y="' + f1(yl - fn * 1.3) + '" width="' + f1(lw) + '" height="' + f1(fn * 1.3) + '" rx="' + f1(fn * 0.5) + '" fill="' + wa + '" stroke="#fff" stroke-width="1.2"/>' +
        '<text x="0" y="' + f1(yl - fn * 0.33) + '" text-anchor="middle" font-size="' + f1(fn) + '" fill="#fff">' + esc(nmA) + '</text></g>';
      ag.push({ w: w, ts: ts, geser: i * 2.3, k: null, op: -1, jl: null, hd: 0 });
    }

    kota.innerHTML = '<svg class="lk-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + VW + ' ' + VH + '" preserveAspectRatio="xMidYMid meet">' +
      dasar() + '<g class="lk-urut">' + bawah + '</g><g class="lk-atas">' + atas + '</g></svg>';

    var urut = kota.querySelector('.lk-urut'), nodeKav = urut.querySelectorAll('.lk-kav'), nodeAg = urut.querySelectorAll('.lk-agen'), nodeLb = kota.querySelectorAll('.lk-al');
    st.urut = urut; st.kav = [];
    for (i = 0; i < nodeKav.length; i++) st.kav.push({ k: kunci[i], g: nodeKav[i] });
    for (i = 0; i < ag.length; i++) { ag[i].g = nodeAg[i]; ag[i].lb = nodeLb[i]; ag[i].kepala = nodeAg[i].querySelector('.lk-hd'); }
    st.ag = ag;
    putar(el);
  }

  // letakkan semua agen pada waktu t (detik); t null = posisi diam
  function gerak(st, t) {
    var i, j, a, w, tt, sg, f, x, y, op, q, k, jl, hd, tr;
    for (i = 0; i < st.ag.length; i++) {
      a = st.ag[i]; w = a.w;
      if (!w.s.length) continue;
      tt = t == null ? a.ts : (t + a.geser) % w.T;
      sg = w.s[w.s.length - 1];
      for (j = 0; j < w.s.length; j++) if (tt < w.s[j].t1) { sg = w.s[j]; break; }
      f = jepit((tt - sg.t0) / (sg.t1 - sg.t0), 0, 1);
      x = sg.x0 + (sg.x1 - sg.x0) * f; y = sg.y0 + (sg.y1 - sg.y0) * f;
      op = sg.m === 2 ? 0 : sg.m === 1 ? jepit((1 - f) / 0.45, 0, 1) : sg.m === 3 ? jepit(f / 0.45, 0, 1) : 1;
      q = S(x, y); tr = 'translate(' + f1(q[0]) + ' ' + f1(q[1]) + ')';
      a.g.setAttribute('transform', tr); a.lb.setAttribute('transform', tr);
      op = Math.round(op * 20) / 20;
      if (op !== a.op) {
        a.op = op;
        a.g.setAttribute('opacity', op); a.lb.setAttribute('opacity', op);
        a.g.setAttribute('visibility', op ? 'visible' : 'hidden'); a.lb.setAttribute('visibility', op ? 'visible' : 'hidden');
      }
      jl = t != null && sg.m !== 2 && sg.m !== 4;
      if (jl !== a.jl) { a.jl = jl; a.g.setAttribute('class', 'lk-agen' + (jl ? ' lk-jln' : '')); }
      hd = (sg.x1 - sg.x0) - (sg.y1 - sg.y0);
      hd = hd < -0.001 ? -1 : hd > 0.001 ? 1 : a.hd;
      if (hd !== a.hd) { a.hd = hd; a.kepala.setAttribute('transform', hd < 0 ? 'scale(-1 1)' : ''); }
      k = kunciUrut(sg, x, y);
      if (k !== a.k) {
        a.k = k;
        for (j = 0; j < st.kav.length && st.kav[j].k < k; j++);
        st.urut.insertBefore(a.g, j < st.kav.length ? st.kav[j].g : null);
      }
    }
  }
  // satu putaran animasi per elemen; render ulang membatalkan yang lama
  function putar(el) {
    var st = el.__lk;
    if (st.raf) { cancelAnimationFrame(st.raf); st.raf = 0; }
    function bingkai() {
      st.raf = 0;
      var diam = !!(MQ && MQ.matches);
      gerak(st, diam ? null : Date.now() / 1000);
      if (!diam && st.ag.length && el.isConnected) st.raf = requestAnimationFrame(bingkai);
    }
    bingkai();
  }

  function pasangGaya() {
    if (document.getElementById('lk-gaya')) return;
    var s = document.createElement('style');
    s.id = 'lk-gaya';
    s.textContent = CSS;
    document.head.appendChild(s);
  }
  function pilih(el, e) {
    var st = el.__lk, d = st && st.data, t = e.target, b, n;
    if (!d || !t || !t.closest) return false;
    b = t.closest('[data-lk-no],[data-lk-agen]');
    if (!b || !el.contains(b)) return false;
    try {
      if (b.hasAttribute('data-lk-no')) {
        n = +b.getAttribute('data-lk-no');
        if (st.peta[n]) { if (typeof d.onRumah === 'function') d.onRumah(n); }
        else if (typeof d.onLahan === 'function') d.onLahan(n);
      } else if (typeof d.onAgen === 'function') d.onAgen(b.getAttribute('data-lk-agen'));
    } catch (err) { if (window.console) console.error('[LudludKota]', err); }
    return true;
  }
  function saatKlik(e) { pilih(this, e); }
  function saatTombol(e) {
    if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
    if (pilih(this, e)) e.preventDefault();
  }

  function render(el, data) {
    if (!el) return;
    data = data || {};
    pasangGaya();
    var tanda;
    try { tanda = JSON.stringify([data.kavling, data.agen, data.kegiatan, data.tema]); } catch (e) { tanda = String(Math.random()); }
    if (!el.__lk) {
      el.__lk = { raf: 0, ag: [] };
      el.addEventListener('click', saatKlik);
      el.addEventListener('keydown', saatTombol);
    }
    el.__lk.data = data;                       // callback selalu yang terbaru
    if (el.__lk.tanda === tanda && el.querySelector(':scope > .lk-kota')) {  // data sama: jangan bangun ulang
      if (!el.__lk.raf) putar(el);
      return;
    }
    el.__lk.tanda = tanda;
    bangun(el, data);
  }

  window.LudludKota = { render: render };
})();
