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
})();
