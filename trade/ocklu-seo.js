/* PITA SEO OCKLU — widget tempel untuk semua dasbor.
 *
 * Aturan yang menjaga dasbor induk tetap selamat:
 *  - SEMUA dibungkus try/catch. Satu galat di pita tidak boleh mematikan
 *    dasbor orang. Kalau pita gagal, dia hilang diam-diam, bukan menyeret
 *    halaman induk ikut mati.
 *  - Tampilan dikurung di dalam shadow DOM, jadi CSS halaman induk tidak
 *    diubah dan tidak bisa merusak pita.
 *  - Tidak menyentuh variabel global lain. Cuma satu penanda anti-dobel.
 *  - Data dibaca dari window.OCKLU_SEO yang ditetapkan papan-seo.js (tag
 *    script). Sengaja BUKAN fetch: peramban melarang fetch dari file://
 *    tanpa galat yang terlihat, padahal kebanyakan dasbor dibuka
 *    klik-dua-kali. fetch cuma dipakai sebagai TAMBAHAN kalau halaman
 *    memang disajikan lewat http.
 *  - Semua angka di sini datang dari papan; tidak ada yang dikarang di sisi
 *    peramban. Kalau papan kosong, yang muncul adalah "belum ada data".
 */
(function () {
  "use strict";
  try {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    if (window.__ocklu_seo_pita__) return;
    window.__ocklu_seo_pita__ = true;

    var PORT = 4646;
    var DASBOR = "http://localhost:" + PORT;

    function ambilData() {
      try {
        var d = window.OCKLU_SEO;
        return d && typeof d === "object" ? d : null;
      } catch (e) { return null; }
    }

    function angka(n) {
      return typeof n === "number" && isFinite(n) ? n : null;
    }

    function el(tag, kelas, teks) {
      var n = document.createElement(tag);
      if (kelas) n.setAttribute("class", kelas);
      if (teks !== undefined && teks !== null) n.textContent = String(teks);
      return n;
    }

    function warnaSkor(s) {
      if (s === null) return "abu";
      if (s >= 80) return "hijau";
      if (s >= 60) return "kuning";
      return "merah";
    }

    function jamPendek(t) {
      try {
        var s = String(t || "");
        return s ? s.slice(0, 16).replace("T", " ") : "";
      } catch (e) { return ""; }
    }

    var GAYA = [
      ":host{all:initial}",
      "*{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif}",
      ".tombol{position:fixed;right:18px;bottom:18px;width:52px;height:52px;border-radius:50%;",
      "border:none;cursor:pointer;background:#111827;color:#fff;box-shadow:0 6px 20px rgba(0,0,0,.32);",
      "font-size:11px;font-weight:700;letter-spacing:.5px;line-height:1.1;pointer-events:auto;",
      "display:flex;align-items:center;justify-content:center;flex-direction:column;padding:0}",
      ".tombol:hover{background:#1f2937}",
      ".tombol .nilai{font-size:14px;font-weight:800}",
      ".titik{position:absolute;top:-3px;right:-3px;width:12px;height:12px;border-radius:50%;border:2px solid #111827}",
      ".panel{position:fixed;top:0;right:0;height:100%;width:380px;max-width:92vw;background:#0f172a;",
      "color:#e5e7eb;box-shadow:-8px 0 28px rgba(0,0,0,.35);transform:translateX(105%);",
      "transition:transform .22s ease;overflow:auto;pointer-events:auto;padding:16px 16px 28px}",
      ".panel.buka{transform:translateX(0)}",
      ".atas{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px}",
      ".judul{font-size:14px;font-weight:800;letter-spacing:.3px;color:#fff}",
      ".jam{font-size:11px;color:#94a3b8;margin-bottom:12px}",
      ".tutup{background:none;border:none;color:#94a3b8;font-size:20px;cursor:pointer;line-height:1;padding:2px 6px}",
      ".tutup:hover{color:#fff}",
      ".blok{background:#1e293b;border-radius:10px;padding:10px 12px;margin-bottom:10px}",
      ".kepala{font-size:11px;text-transform:uppercase;letter-spacing:.6px;color:#94a3b8;margin-bottom:8px}",
      ".baris{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:5px 0;",
      "border-top:1px solid rgba(148,163,184,.16)}",
      ".baris:first-of-type{border-top:none}",
      ".situs{font-size:13px;color:#e5e7eb;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".kanan{display:flex;align-items:center;gap:6px;flex:0 0 auto}",
      ".skor{font-size:13px;font-weight:800;padding:1px 8px;border-radius:999px;color:#0f172a}",
      ".hijau{background:#4ade80}.kuning{background:#fbbf24}.merah{background:#f87171}.abu{background:#64748b;color:#fff}",
      ".kecil{font-size:11px;color:#94a3b8}",
      ".cap{font-size:10px;padding:1px 6px;border-radius:999px;background:#334155;color:#cbd5e1}",
      ".cap.awas{background:#7c2d12;color:#fed7aa}",
      ".tugas{padding:8px 0;border-top:1px solid rgba(148,163,184,.16)}",
      ".tugas:first-of-type{border-top:none}",
      ".tugas .nama{font-size:12px;font-weight:600;color:#fff;margin-bottom:3px}",
      ".tugas .cara{font-size:11px;color:#cbd5e1;line-height:1.45}",
      ".tugas .asal{font-size:10px;color:#94a3b8;margin-top:3px}",
      ".angkaan{display:flex;gap:8px}",
      ".kotak{flex:1;background:#0f172a;border:1px solid rgba(148,163,184,.2);border-radius:8px;padding:8px;text-align:center}",
      ".kotak b{display:block;font-size:18px;color:#fff}",
      ".kotak span{font-size:10px;color:#94a3b8}",
      ".buka-dasbor{display:block;width:100%;text-align:center;background:#2563eb;color:#fff;border:none;",
      "border-radius:9px;padding:10px;font-size:12px;font-weight:700;cursor:pointer;text-decoration:none;margin-top:4px}",
      ".buka-dasbor:hover{background:#1d4ed8}",
      ".kosong{font-size:12px;color:#cbd5e1;line-height:1.5}",
      ".kode{display:block;margin-top:6px;background:#0b1220;border-radius:6px;padding:7px 8px;",
      "font-family:ui-monospace,Menlo,Consolas,monospace;font-size:11px;color:#93c5fd;word-break:break-all}"
    ].join("");

    var inang = document.createElement("div");
    inang.setAttribute("data-ocklu-seo", "pita");
    inang.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;z-index:2147483000;pointer-events:none";

    var akar;
    if (inang.attachShadow) {
      akar = inang.attachShadow({ mode: "open" });
    } else {
      akar = inang;                       // peramban tua: tetap jalan, kelas berawalan
      inang.style.cssText += ";all:initial;position:fixed;right:0;bottom:0;z-index:2147483000";
    }
    var gaya = document.createElement("style");
    gaya.textContent = GAYA;
    akar.appendChild(gaya);

    var tombol = el("button", "tombol");
    tombol.setAttribute("type", "button");
    tombol.setAttribute("title", "Pita SEO Ocklu");
    var nilaiTombol = el("span", "nilai", "—");
    tombol.appendChild(el("span", null, "SEO"));
    tombol.appendChild(nilaiTombol);
    var titik = el("span", "titik abu");
    tombol.appendChild(titik);

    var panel = el("div", "panel");
    akar.appendChild(tombol);
    akar.appendChild(panel);

    function gambar() {
      try {
        var d = ambilData();
        while (panel.firstChild) panel.removeChild(panel.firstChild);

        var atas = el("div", "atas");
        atas.appendChild(el("div", "judul", "PITA SEO OCKLU"));
        var tutup = el("button", "tutup", "×");
        tutup.setAttribute("type", "button");
        tutup.addEventListener("click", function () { try { panel.classList.remove("buka"); } catch (e) {} });
        atas.appendChild(tutup);
        panel.appendChild(atas);

        if (!d || !d.jam) {
          nilaiTombol.textContent = "—";
          titik.setAttribute("class", "titik abu");
          panel.appendChild(el("div", "jam", ""));
          var k = el("div", "blok");
          k.appendChild(el("div", "kepala", "belum ada data"));
          k.appendChild(el("div", "kosong",
            "Belum ada data SEO di halaman ini. Jalankan pemeriksaan dulu, lalu muat ulang dasbor ini."));
          k.appendChild(el("code", "kode", "cd ~/ocklu-seo && python3 mesin.py ocklu.com"));
          panel.appendChild(k);
          var b0 = el("a", "buka-dasbor", "Buka dasbor SEO");
          b0.setAttribute("href", DASBOR);
          b0.setAttribute("target", "_blank");
          b0.setAttribute("rel", "noopener");
          panel.appendChild(b0);
          return;
        }

        panel.appendChild(el("div", "jam", "diperbarui " + jamPendek(d.jam)));

        // ── skor tiap situs ────────────────────────────────────────────
        var situs = Array.isArray(d.situs) ? d.situs : [];
        var kotakSitus = el("div", "blok");
        kotakSitus.appendChild(el("div", "kepala",
          "skor situs (" + situs.length + ")"));
        if (!situs.length) {
          kotakSitus.appendChild(el("div", "kosong", "belum ada situs yang diperiksa"));
        }
        var terendah = null;// skor PALING BURUK — itu yang perlu dikerjakan
        situs.forEach(function (s) {
          var baris = el("div", "baris");
          baris.appendChild(el("div", "situs", s.situs || "?"));
          var kanan = el("div", "kanan");
          var sk = angka(s.skor);
          if (sk !== null && (terendah === null || sk < terendah)) terendah = sk;
          kanan.appendChild(el("span", "kecil", (angka(s.masalah) || 0) + " masalah"));
          if (s.mutu_data && s.mutu_data !== "cukup") {
            kanan.appendChild(el("span", "cap awas", s.mutu_data));
          }
          kanan.appendChild(el("span", "skor " + warnaSkor(sk), sk === null ? "?" : sk));
          baris.appendChild(kanan);
          kotakSitus.appendChild(baris);
        });
        panel.appendChild(kotakSitus);

        nilaiTombol.textContent = terendah === null ? "\u2014" : String(terendah);
        titik.setAttribute("class", "titik " + warnaSkor(terendah));

        // ── ringkasan angka ────────────────────────────────────────────
        var ring = el("div", "blok");
        ring.appendChild(el("div", "kepala", "ringkasan"));
        var deret = el("div", "angkaan");
        [["tugas terbuka", d.tugas_terbuka], ["tugas berat", d.tugas_berat],
         ["kata dipantau", d.kata_dipantau]].forEach(function (p) {
          var kt = el("div", "kotak");
          kt.appendChild(el("b", null, angka(p[1]) === null ? "—" : p[1]));
          kt.appendChild(el("span", null, p[0]));
          deret.appendChild(kt);
        });
        ring.appendChild(deret);
        panel.appendChild(ring);

        // ── kata naik / turun ──────────────────────────────────────────
        var kk = el("div", "blok");
        kk.appendChild(el("div", "kepala", "kata kunci bergerak"));
        var naik = angka(d.naik), turun = angka(d.turun);
        if (naik === null && turun === null) {
          kk.appendChild(el("div", "kosong", "belum ada posisi kata yang terekam"));
        } else {
          var d2 = el("div", "angkaan");
          var k1 = el("div", "kotak");
          k1.appendChild(el("b", null, "↑ " + (naik || 0)));
          k1.appendChild(el("span", null, "naik"));
          var k2 = el("div", "kotak");
          k2.appendChild(el("b", null, "↓ " + (turun || 0)));
          k2.appendChild(el("span", null, "turun"));
          d2.appendChild(k1); d2.appendChild(k2);
          kk.appendChild(d2);
          kk.appendChild(el("div", "kecil", "dari 300 catatan posisi terakhir"));
        }
        panel.appendChild(kk);

        // ── 5 tugas teratas ───────────────────────────────────────────
        var tugas = Array.isArray(d.tugas_atas) ? d.tugas_atas.slice(0, 5) : [];
        var kt2 = el("div", "blok");
        kt2.appendChild(el("div", "kepala", "5 tugas paling berharga"));
        if (!tugas.length) {
          kt2.appendChild(el("div", "kosong", "tidak ada tugas terbuka"));
        }
        tugas.forEach(function (t) {
          var w = el("div", "tugas");
          w.appendChild(el("div", "nama", t.judul || "(tanpa judul)"));
          if (t.cara) w.appendChild(el("div", "cara", "Cara: " + t.cara));
          else if (t.kenapa) w.appendChild(el("div", "cara", t.kenapa));
          var asal = [];
          if (t.situs) asal.push(t.situs);
          if (t.bobot) asal.push(t.bobot);
          if (angka(t.nilai) !== null) asal.push("nilai " + t.nilai);
          w.appendChild(el("div", "asal", asal.join(" · ")));
          kt2.appendChild(w);
        });
        panel.appendChild(kt2);

        var b = el("a", "buka-dasbor", "Buka dasbor SEO");
        b.setAttribute("href", DASBOR);
        b.setAttribute("target", "_blank");
        b.setAttribute("rel", "noopener");
        panel.appendChild(b);
      } catch (e) { /* pita gagal menggambar — halaman induk tetap utuh */ }
    }

    tombol.addEventListener("click", function () {
      try { panel.classList.toggle("buka"); } catch (e) {}
    });
    document.addEventListener("keydown", function (ev) {
      try { if (ev && ev.key === "Escape") panel.classList.remove("buka"); } catch (e) {}
    });

    function pasangKeHalaman() {
      try {
        (document.body || document.documentElement).appendChild(inang);
        gambar();
        segarkanLewatHttp();
      } catch (e) {}
    }

    // TAMBAHAN, bukan sumber utama: hanya jalan kalau halaman disajikan lewat
    // http/https. Dari file:// permintaan ini pasti ditolak peramban, jadi
    // sengaja tidak dicoba supaya tidak ada galat palsu di konsol dasbor.
    function segarkanLewatHttp() {
      try {
        if (!/^https?:$/.test(window.location.protocol)) return;
        if (typeof window.fetch !== "function") return;
        window.fetch(DASBOR + "/api/papan", { cache: "no-store" })
          .then(function (r) { return r && r.ok ? r.json() : null; })
          .then(function (o) {
            try {
              if (o && o.jam) { window.OCKLU_SEO = o; gambar(); }
            } catch (e) {}
          })
          .catch(function () { /* dasbor SEO sedang mati — pakai data berkas */ });
      } catch (e) {}
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", pasangKeHalaman);
    } else {
      pasangKeHalaman();
    }
  } catch (e) { /* jangan pernah melempar ke halaman induk */ }
})();
