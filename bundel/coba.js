/* OCKLU · coba gratis lalu Membership. Pakai: <script src="/bundel/coba.js" data-gratis="3" defer></script>
   N kunjungan pertama di perangkat ini gratis (pita kecil sisa jatah), sesudahnya pagar Membership (/bundel/gate.js).
   Anggota yang sudah memasukkan kunci langsung lewat. Soft gate: bukan enkripsi. */
(function () {
  "use strict";
  var el = document.currentScript, N = parseInt((el && el.getAttribute("data-gratis")) || "3", 10);
  var id = (navigator.language || "en").toLowerCase().indexOf("id") === 0;
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function pagar() { var s = document.createElement("script"); s.src = "/bundel/gate.js"; document.body.appendChild(s); }
  function mulai() {
    if (ls("ocklu_member_v1")) return pagar();                 // anggota: gate.js memverifikasi & memasang lencana
    var kunci = "ocklu_coba_" + location.pathname.split("/")[1];
    var n = parseInt(ls(kunci) || "0", 10) + 1;
    if (ls(kunci, String(n)) === null && ls(kunci) === null) return; // penyimpanan diblokir: jangan menghukum pengunjung
    if (n > N) return pagar();
    var sisa = N - n;
    var p = document.createElement("div");
    p.setAttribute("role", "status");
    p.style.cssText = "position:fixed;left:50%;transform:translateX(-50%);bottom:12px;z-index:2147481000;max-width:calc(100% - 32px);padding:8px 16px;border-radius:999px;" +
      "background:rgba(22,33,62,.95);color:#e8ecf4;border:1px solid rgba(0,212,255,.35);font:13px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;text-align:center";
    p.innerHTML = (id ? "Coba gratis: sisa " + sisa + " dari " + N + " kunjungan · " : "Free trial: " + sisa + " of " + N + " visits left · ") +
      '<a href="https://hillkia.gumroad.com/l/ocklu-membership" style="color:#00d4ff;font-weight:600">' + (id ? "Jadi anggota $3/bulan" : "Join for $3/month") + "</a>";
    document.body.appendChild(p);
  }
  if (document.body) mulai(); else document.addEventListener("DOMContentLoaded", mulai);
})();
