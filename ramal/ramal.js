/* OCKLU RAMAL - mesin ramal harga cara "mata Tuhan", jalan di browser/HP sendiri.
   Salinan setia dari ~/ocklu-godeye/otak/ramal.py: analog 30 hari vs seluruh sejarah,
   kerucut p10..p90, uji mundur jalan-maju, arah disembunyikan kalau tak lewat derau.
   File ini ASCII murni supaya aman di halaman tanpa charset. */
(function (g) {
  var CERMIN = "https://data-api.binance.vision/api/v3/klines";
  var W = 30, K = 25, JARAK_MIN = 5;

  function sd(a) { var m = 0, i, v = 0; for (i = 0; i < a.length; i++) m += a[i]; m /= a.length;
    for (i = 0; i < a.length; i++) v += (a[i] - m) * (a[i] - m); return Math.sqrt(v / a.length) || 1e-9; }
  function ciri(ret, i) { var w = ret.slice(i - W + 1, i + 1), s = sd(w), c = 0, j = [];
    for (var k = 0; k < w.length; k++) { c += w[k] / s; j.push(c); } return { jalur: j, s: s }; }
  function pct(a, p) { a = a.slice().sort(function (x, y) { return x - y; });
    var k = (a.length - 1) * p, f = Math.floor(k), b = a[Math.min(f + 1, a.length - 1)];
    return a[f] + (b - a[f]) * (k - f); }

  // pra-hitung ciri semua jendela sekali saja (uji mundur jadi cepat di HP)
  function siapkan(ret) { var c = []; for (var i = 0; i < ret.length; i++) c.push(i >= W - 1 ? ciri(ret, i) : null); return c; }

  function analog(ret, C, akhir, H, batasAtas) {
    var t = C[akhir], kand = [];
    for (var i = W; i < batasAtas - H; i++) {
      var c = C[i], d = 0;
      for (var k = 0; k < W; k++) { var e = t.jalur[k] - c.jalur[k]; d += e * e; }
      var l = Math.log(c.s / t.s); d += 4 * l * l;
      kand.push([d, i, c.s]);
    }
    kand.sort(function (a, b) { return a[0] - b[0]; });
    var pilih = [];
    for (var n = 0; n < kand.length && pilih.length < K; n++) {
      var ok = true;
      for (var m = 0; m < pilih.length; m++) if (Math.abs(kand[n][1] - pilih[m][1]) < JARAK_MIN) { ok = false; break; }
      if (ok) pilih.push(kand[n]);
    }
    return { pilih: pilih, s0: t.s };
  }

  function kerucut(ret, C, akhir, H, batasAtas) {
    var a = analog(ret, C, akhir, H, batasAtas), jalur = [];
    a.pilih.forEach(function (p) { var sk = a.s0 / p[2], c = 0, j = [];
      for (var x = p[1] + 1; x < p[1] + 1 + H; x++) { c += ret[x] * sk; j.push(c); } jalur.push(j); });
    return { pilih: a.pilih, jalur: jalur };
  }

  function ujiMundur(ret, C, H) {
    var kena = 0, naik = 0, masuk = 0, total = 0, mulai = Math.max(ret.length - H - 600, W * 4);
    for (var t = mulai; t < ret.length - H; t += 3) {
      var u = kerucut(ret, C, t, H, t + 1 - H), ujung = u.jalur.map(function (j) { return j[j.length - 1]; });
      var nyata = 0; for (var x = t + 1; x < t + 1 + H; x++) nyata += ret[x];
      var pn = ujung.filter(function (v) { return v > 0; }).length / ujung.length;
      if ((pn >= 0.5) === (nyata > 0)) kena++;
      if (nyata > 0) naik++;
      if (pct(ujung, 0.1) <= nyata && nyata <= pct(ujung, 0.9)) masuk++;
      total++;
    }
    if (!total) return null;
    var r3 = function (v) { return Math.round(v * 1000) / 1000; };
    return { titik_uji: total, arah_kena: r3(kena / total), tebak_buta: r3(Math.max(naik, total - naik) / total),
             kerucut_p10_p90_kena: r3(masuk / total), kerucut_target: 0.8 };
  }

  function tgl(det) { return new Date(det * 1000).toISOString().slice(0, 10); }

  async function ramal(simbol, H) {
    simbol = String(simbol || "BTCUSDT").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 20);
    H = Math.max(3, Math.min(parseInt(H || 14, 10), 30));
    var rows = await (await fetch(CERMIN + "?symbol=" + simbol + "&interval=1d&limit=1000")).json();
    if (!Array.isArray(rows)) return { berhasil: false, galat: "aset " + simbol + " tidak ditemukan di Binance" };
    if (rows.length < W * 6) return { berhasil: false, galat: "data " + simbol + " cuma " + rows.length + " hari - terlalu tipis" };
    var waktu = rows.map(function (x) { return Math.floor(x[0] / 1000); }), harga = rows.map(function (x) { return +x[4]; });
    var ret = []; for (var i = 1; i < harga.length; i++) ret.push(Math.log(harga[i] / harga[i - 1]));
    var C = siapkan(ret), akhir = ret.length - 1, k = kerucut(ret, C, akhir, H, ret.length), p0 = harga[harga.length - 1];
    var dp = p0 >= 10 ? 100 : 100000, bulat = function (v) { return Math.round(v * dp) / dp; };
    var cone = [];
    for (var h = 0; h < H; h++) { var kol = k.jalur.map(function (j) { return j[h]; });
      cone.push({ hari: h + 1, p10: bulat(p0 * Math.exp(pct(kol, .1))), p25: bulat(p0 * Math.exp(pct(kol, .25))),
                  p50: bulat(p0 * Math.exp(pct(kol, .5))), p75: bulat(p0 * Math.exp(pct(kol, .75))), p90: bulat(p0 * Math.exp(pct(kol, .9))) }); }
    var ujung = k.jalur.map(function (j) { return j[j.length - 1]; });
    var pn = ujung.filter(function (v) { return v > 0; }).length / ujung.length;
    var uji = ujiMundur(ret, C, H);
    // unggul harus melewati derau: selisih > 2 x galat baku
    var unggul = !!uji && (uji.arah_kena - uji.tebak_buta) > 2 * Math.sqrt(0.25 / uji.titik_uji);
    var mirip = k.pilih.slice(0, 6).map(function (p) { var s = 0;
      for (var x = p[1] + 1; x < p[1] + 1 + H; x++) s += ret[x];
      return { tanggal: tgl(waktu[p[1] + 1]), harga_saat_itu: bulat(harga[p[1] + 1]),
               hasil_pct: Math.round((Math.exp(s) - 1) * 1000) / 10, kemiripan: Math.round(1000 / (1 + p[0])) / 1000 }; });
    return {
      berhasil: true, aset: simbol, horizon_hari: H, harga_sekarang: p0, per_tanggal: tgl(waktu[waktu.length - 1]),
      riwayat_hari: harga.length, jumlah_analog: k.jalur.length, kerucut: cone,
      peluang_naik: unggul ? Math.round(pn * 1000) / 1000 : null,
      arah: unggul ? (pn > 0.55 ? "NAIK" : pn < 0.45 ? "TURUN" : "SEIMBANG") : "TIDAK DIRAMAL",
      uji_mundur: uji,
      pagar: { arah_lebih_baik_dari_tebakan_buta: unggul,
               kerucut_terkalibrasi: !!uji && Math.abs(uji.kerucut_p10_p90_kena - 0.8) <= 0.12,
               catatan: unggul ? "Arah ditampilkan karena di uji mundur mengalahkan tebakan buta melewati derau."
                               : "Arah disembunyikan: di uji mundur tidak mengalahkan tebakan buta melewati derau. Pakai kerucut sebagai rentang risiko saja." },
      badai_mirip: mirip,
      sumber: "Binance (cermin data-api.binance.vision), candle harian penutupan",
      bukan_nasihat: "Rentang peluang dari sejarah, bukan janji. Bukan nasihat keuangan."
    };
  }
  g.OcRamal = { ramal: ramal };
})(typeof window !== "undefined" ? window : globalThis);
