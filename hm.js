/* OCKLU Hyper Market · toko pintar. Tanpa cookie, tanpa menyimpan IP, tanpa data pribadi.
   Mengirim: halaman, situs asal (referrer), utm, bahasa, HP/laptop, jam. Penawaran hanya kalau
   tag <script> membawa data-tawar, dan paling banyak sekali per sesi tab. */
(function () {
  "use strict";
  if (navigator.webdriver) return;
  var API = "https://njghzieuuopukuagrswu.supabase.co/functions/v1/hypermarket";
  var el = document.currentScript, tawar = !!(el && el.hasAttribute("data-tawar"));
  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }
  if (tawar && ss("hm_tawar")) tawar = false;
  var q = new URLSearchParams(location.search), utm = [];
  ["utm_source", "utm_medium", "utm_campaign", "utm_term"].forEach(function (k) { if (q.get(k)) utm.push(k.slice(4) + "=" + q.get(k)); });
  var badan = { h: location.pathname, a: document.referrer || "", u: utm.join("&"), l: navigator.language || "",
    m: window.matchMedia && matchMedia("(max-width: 700px)").matches ? 1 : 0, j: new Date().getHours(), t: tawar ? 1 : 0 };
  fetch(API + "?r=jejak", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(badan), keepalive: true })
    .then(function (r) { return r.json(); }).then(function (d) { if (d && d.tawaran) tampil(d.tawaran, d.id); }).catch(function () {});

  function tampil(t, id) {
    ss("hm_tawar", "1");
    var gelap = window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
    var box = document.createElement("aside");
    box.setAttribute("aria-label", "Penawaran OCKLU");
    box.style.cssText = "position:fixed;z-index:2147480000;right:16px;bottom:16px;max-width:340px;width:calc(100% - 32px);box-sizing:border-box;" +
      "padding:16px;border-radius:14px;font:15px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;box-shadow:0 12px 40px rgba(0,0,0,.28);" +
      (gelap ? "background:#1b1e23;color:#e9e7e2;border:1px solid #2c3038" : "background:#fff;color:#1d1f24;border:1px solid #e3e1da");
    var aksen = gelap ? "#4cc4ae" : "#0f7b6c";
    box.innerHTML = '<button type="button" aria-label="Tutup" style="position:absolute;top:8px;right:8px;width:32px;height:32px;border:0;background:transparent;color:inherit;font-size:20px;cursor:pointer;opacity:.6">×</button>' +
      '<div style="font-weight:700;margin:0 32px 4px 0"></div><div style="opacity:.8;margin-bottom:12px"></div>' +
      '<a style="display:inline-block;background:' + aksen + ';color:#fff;text-decoration:none;font-weight:700;padding:8px 16px;border-radius:8px;min-height:24px">Lihat →</a>';
    box.children[1].textContent = t.judul; box.children[2].textContent = t.teks;
    var a = box.querySelector("a"); a.href = t.link; a.rel = "noopener";
    a.addEventListener("click", function () {
      try { navigator.sendBeacon(API + "?r=klik", new Blob([JSON.stringify({ id: id })], { type: "application/json" })); } catch (e) {}
    });
    box.querySelector("button").onclick = function () { box.remove(); };
    setTimeout(function () { document.body.appendChild(box); }, 1500);
  }

  /* Kotak obrolan publik (13 Nov 2026): MARKUS melayani manusia yang datang. Tombol kecil di pojok; panel baru dibuat saat diklik.
     Matikan di satu halaman dengan atribut data-tanpa-obrol pada tag <script>. Kontak hanya dicatat kalau pengunjung sendiri menuliskannya. */
  if (el && el.hasAttribute("data-tanpa-obrol")) return;
  if (window.top !== window.self) return;
  var gelapO = window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches, aksenO = gelapO ? "#4cc4ae" : "#0f7b6c";
  var F = "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", riw = [];
  try { riw = JSON.parse(ss("hm_obrol") || "[]"); } catch (e) { riw = []; }
  var tb = document.createElement("button");
  tb.type = "button"; tb.setAttribute("aria-label", "Tanya OCKLU"); tb.textContent = "💬 Tanya OCKLU";
  tb.style.cssText = "position:fixed;z-index:2147479000;left:16px;bottom:16px;padding:10px 16px;border:0;border-radius:999px;cursor:pointer;font:600 14px/1.2 " + F +
    ";color:#fff;background:" + aksenO + ";box-shadow:0 8px 24px rgba(0,0,0,.25)";
  var pn = null, isi = null, inp = null;
  function baris(dari, teks, tawaran) {
    var d = document.createElement("div");
    d.style.cssText = "margin:0 0 10px;padding:9px 12px;border-radius:12px;white-space:pre-wrap;word-wrap:break-word;max-width:88%;" +
      (dari === "saya" ? "margin-left:auto;color:#fff;background:" + aksenO : (gelapO ? "background:#262a31" : "background:#f1efe9"));
    d.textContent = teks; isi.appendChild(d);
    (tawaran || []).forEach(function (t) {
      if (!/^https?:\/\//.test(t.link || "")) return;
      var a = document.createElement("a"); a.href = t.link; a.target = "_blank"; a.rel = "noopener";
      a.style.cssText = "display:block;margin:0 0 8px;padding:9px 12px;border-radius:10px;text-decoration:none;color:inherit;border:1px solid " + aksenO;
      var b1 = document.createElement("b"); b1.textContent = t.judul; var s1 = document.createElement("div");
      s1.style.cssText = "font-size:12.5px;opacity:.75"; s1.textContent = (t.harga ? t.harga + " · " : "") + (t.sumber || "") + " →";
      a.appendChild(b1); a.appendChild(s1); isi.appendChild(a);
    });
    isi.scrollTop = isi.scrollHeight;
  }
  function buka() {
    if (pn) { pn.style.display = pn.style.display === "none" ? "flex" : "none"; if (pn.style.display !== "none") inp.focus(); return; }
    pn = document.createElement("section"); pn.setAttribute("aria-label", "Obrolan dengan MARKUS, penjual OCKLU");
    pn.style.cssText = "position:fixed;z-index:2147479001;left:16px;bottom:64px;width:360px;max-width:calc(100% - 32px);height:460px;max-height:calc(100% - 96px);display:flex;flex-direction:column;" +
      "box-sizing:border-box;border-radius:14px;overflow:hidden;font:14.5px/1.5 " + F + ";box-shadow:0 12px 40px rgba(0,0,0,.3);" +
      (gelapO ? "background:#1b1e23;color:#e9e7e2;border:1px solid #2c3038" : "background:#fff;color:#1d1f24;border:1px solid #e3e1da");
    var kp = document.createElement("div"); kp.style.cssText = "padding:10px 14px;font-weight:700;color:#fff;background:" + aksenO + ";display:flex;justify-content:space-between;align-items:center";
    kp.textContent = "MARKUS · penjual OCKLU";
    var x = document.createElement("button"); x.type = "button"; x.setAttribute("aria-label", "Tutup"); x.textContent = "×";
    x.style.cssText = "border:0;background:transparent;color:#fff;font-size:22px;line-height:1;cursor:pointer;padding:0 4px"; x.onclick = function () { pn.style.display = "none"; };
    kp.appendChild(x);
    isi = document.createElement("div"); isi.style.cssText = "flex:1;overflow-y:auto;padding:12px";
    var fm = document.createElement("form"); fm.style.cssText = "display:flex;gap:8px;padding:10px;border-top:1px solid " + (gelapO ? "#2c3038" : "#e3e1da");
    inp = document.createElement("input"); inp.type = "text"; inp.maxLength = 500; inp.setAttribute("aria-label", "Tulis pesan"); inp.placeholder = "Cari apa, atau mau jual apa?";
    inp.style.cssText = "flex:1;min-width:0;padding:9px 12px;border-radius:10px;font:inherit;color:inherit;border:1px solid " + (gelapO ? "#3a3f48" : "#cfccc3") + ";background:" + (gelapO ? "#14171b" : "#fff");
    var kr = document.createElement("button"); kr.type = "submit"; kr.textContent = "Kirim";
    kr.style.cssText = "padding:9px 14px;border:0;border-radius:10px;font:600 14px " + F + ";color:#fff;cursor:pointer;background:" + aksenO;
    var kk = document.createElement("div"); kk.style.cssText = "padding:0 12px 8px;font-size:11.5px;opacity:.6";
    kk.textContent = "Dijawab agen AI, bisa keliru. Obrolan dicatat. Kontak hanya dicatat kalau Anda menuliskannya.";
    fm.appendChild(inp); fm.appendChild(kr); pn.appendChild(kp); pn.appendChild(isi); pn.appendChild(fm); pn.appendChild(kk); document.body.appendChild(pn);
    if (riw.length) riw.forEach(function (m) { baris(m.dari === "markus" ? "markus" : "saya", m.isi); });
    else baris("markus", "Halo, saya MARKUS dari OCKLU. Lagi cari produk atau jasa apa? Atau mau barang Anda ditawarkan lewat agen AI? Hello, you can also write in English.");
    fm.onsubmit = function (e) {
      e.preventDefault(); var t = inp.value.trim(); if (!t || kr.disabled) return; inp.value = ""; baris("saya", t); kr.disabled = true; kr.textContent = "…";
      fetch(API + "?r=tanya", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ pesan: t, riwayat: riw.slice(-6), halaman: location.pathname.slice(0, 120) }) })
        .then(function (r) { return r.json(); }).then(function (d) {
          var j = d.jawab || d.galat || "Maaf, saya belum bisa menjawab. Coba lagi sebentar.";
          baris("markus", j, d.tawaran); riw.push({ dari: "saya", isi: t }); riw.push({ dari: "markus", isi: j }); riw = riw.slice(-12); ss("hm_obrol", JSON.stringify(riw));
        }).catch(function () { baris("markus", "Maaf, sambungan terputus. Coba lagi sebentar."); })
        .then(function () { kr.disabled = false; kr.textContent = "Kirim"; inp.focus(); });
    };
    inp.focus();
  }
  tb.onclick = buka;
  setTimeout(function () { if (document.body) document.body.appendChild(tb); }, 1200);
})();
