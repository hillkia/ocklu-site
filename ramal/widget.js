/* OCKLU RAMAL widget - tempel di dasbor mana pun:
   <script src="https://ocklu.com/ramal/widget.js" defer></script>
   Pil kecil kanan-bawah; ketuk = rentang 14 hari BTC/ETH/PAXG. Hitungan jalan di browser sendiri.
   ASCII murni (halaman tanpa charset tidak jadi mojibake). */
(function () {
  if (window.__ocRamalWidget) return; window.__ocRamalWidget = 1;
  var ASAL = "https://ocklu.com/ramal/", ASET = ["BTCUSDT", "ETHUSDT", "PAXGUSDT"], SIMPAN = "ocRamalW", UMUR = 3600e3;
  var NAMA = { BTCUSDT: "BTC", ETHUSDT: "ETH", PAXGUSDT: "Emas" };

  function f(x) { return x >= 10 ? Math.round(x).toLocaleString("id-ID") : x.toFixed(4); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function baca() { try { var o = JSON.parse(localStorage.getItem(SIMPAN) || "null"); if (o && Date.now() - o.t < UMUR) return o.d; } catch (e) {} return null; }
  function tulis(d) { try { localStorage.setItem(SIMPAN, JSON.stringify({ t: Date.now(), d: d })); } catch (e) {} }

  var b = document.createElement("div");
  b.setAttribute("style", "position:fixed;right:12px;bottom:12px;z-index:2147483000;font:13px/1.4 system-ui,-apple-system,sans-serif;color:#e6edf3");
  var pil = document.createElement("button");
  pil.type = "button"; pil.setAttribute("aria-expanded", "false");
  pil.setAttribute("style", "background:#121923;color:#e6edf3;border:1px solid #223042;border-radius:99px;padding:6px 12px;cursor:pointer;font:inherit;box-shadow:0 2px 10px rgba(0,0,0,.35)");
  pil.textContent = "\uD83D\uDC41 Ramal";
  var panel = document.createElement("div");
  panel.setAttribute("style", "display:none;margin-bottom:8px;width:260px;max-width:calc(100vw - 24px);background:#121923;border:1px solid #223042;border-radius:12px;padding:12px;box-shadow:0 6px 24px rgba(0,0,0,.45)");
  b.appendChild(panel); b.appendChild(pil);

  function gambar(d) {
    var h = '<b>\uD83D\uDC41 Rentang 80% - 14 hari</b><table style="width:100%;border-collapse:collapse;margin-top:6px;font-variant-numeric:tabular-nums">';
    d.forEach(function (r) {
      if (!r.berhasil) { h += '<tr><td colspan="2" style="color:#8b98a8">' + esc(r.galat) + "</td></tr>"; return; }
      var a = r.kerucut[r.kerucut.length - 1], w = r.arah === "NAIK" ? "#3fb950" : r.arah === "TURUN" ? "#f85149" : "#8b98a8";
      h += '<tr><td style="padding:4px 0">' + NAMA[r.aset] + '<div style="font-size:11px;color:' + w + '">' + esc(r.arah) + '</div></td>' +
           '<td style="text-align:right">' + f(r.harga_sekarang) + '<div style="font-size:11px;color:#8b98a8">' + f(a.p10) + " - " + f(a.p90) + "</div></td></tr>";
    });
    h += '</table><div style="font-size:11px;color:#8b98a8;margin-top:6px">Arah hanya tampil kalau lolos uji mundur. Bukan nasihat keuangan.</div>' +
         '<a href="' + ASAL + '" target="_blank" rel="noopener" style="color:#4cc2ff;font-size:12px">Buka kerucut lengkap &rarr;</a>';
    panel.innerHTML = h;
  }

  function muatMesin(cb) {
    if (window.OcRamal) return cb();
    var s = document.createElement("script"); s.src = ASAL + "ramal.js"; s.onload = cb;
    s.onerror = function () { panel.innerHTML = '<span style="color:#8b98a8">Tidak bisa memuat mesin ramal (offline?).</span>'; };
    document.head.appendChild(s);
  }

  var sudah = false;
  pil.onclick = function () {
    var buka = panel.style.display === "none";
    panel.style.display = buka ? "block" : "none"; pil.setAttribute("aria-expanded", buka ? "true" : "false");
    if (!buka || sudah) return; sudah = true;
    var c = baca(); if (c) return gambar(c);
    panel.innerHTML = '<span style="color:#8b98a8">Membandingkan dengan seluruh sejarah...</span>';
    muatMesin(function () {
      Promise.all(ASET.map(function (a) { return OcRamal.ramal(a, 14).catch(function (e) { return { berhasil: false, galat: NAMA[a] + ": " + e }; }); }))
        .then(function (d) { d.forEach(function (r) { if (r.berhasil) r.kerucut = [r.kerucut[r.kerucut.length - 1]]; }); tulis(d); gambar(d); });
    });
  };
  (document.body ? Promise.resolve() : new Promise(function (r) { document.addEventListener("DOMContentLoaded", r); }))
    .then(function () { document.body.appendChild(b); });
})();
