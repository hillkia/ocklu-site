// Kartu Siap Dibaca AI: tampilkan data terbaru + editor dari HP (link edit pribadi ?edit=… atau perangkat owner OCKLU).
(function () {
  var main = document.querySelector("[data-kartu]"); if (!main) return;
  var API = "https://njghzieuuopukuagrswu.supabase.co/functions/v1/siapdibaca", slug = main.getAttribute("data-kartu");
  var kunci = new URLSearchParams(location.search).get("edit") || "", owner = "";
  try { owner = localStorage.getItem("pj_kunci") || ""; if (kunci) sessionStorage.setItem("kartu_edit_" + slug, kunci); else kunci = sessionStorage.getItem("kartu_edit_" + slug) || ""; } catch (_) {}
  if (kunci) try { history.replaceState(null, "", location.pathname); } catch (_) {}
  var NAMA = { youtube: "YouTube", instagram: "Instagram", tiktok: "TikTok", threads: "Threads", snack: "Snack Video", x: "X", facebook: "Facebook", telegram: "Telegram", whatsapp_channel: "Saluran WhatsApp", shopee: "Shopee", tokopedia: "Tokopedia", situs: "Situs" };
  function el(t, a, k) { var x = document.createElement(t); if (a) for (var i in a) x.setAttribute(i, a[i]); if (k != null) x.textContent = k; return x; }
  function rp(n) { return n ? "Rp" + Number(n).toLocaleString("id-ID") : "tanya harga"; }
  var D = null;
  function tampil() {
    document.getElementById("kNama").textContent = D.nama; document.getElementById("kSub").textContent = D.tagline + (D.kota ? " · " + D.kota : "");
    var s = document.getElementById("kSos"); s.textContent = ""; Object.keys(D.sosmed || {}).forEach(function (n) { s.appendChild(el("a", { href: D.sosmed[n], rel: "me noopener" }, NAMA[n] || n)); });
    var u = document.getElementById("kKat"); u.textContent = "";
    (D.katalog || []).forEach(function (x) { var li = el("li"); li.appendChild(el("b", null, x.nama)); li.appendChild(document.createTextNode(" · ")); li.appendChild(el("span", { class: "harga" }, rp(x.harga)));
      if (x.ket) { li.appendChild(el("br")); li.appendChild(el("span", { class: "redup" }, x.ket)); } u.appendChild(li); });
    var w = document.getElementById("kWa"); if (D.wa) { if (!w) { w = el("a", { class: "wa", id: "kWa" }, "Pesan lewat WhatsApp"); u.after(w); } w.href = "https://wa.me/" + D.wa + "?text=" + encodeURIComponent("Halo " + D.nama + ", saya lihat katalog di ocklu.com/kartu/" + slug); }
  }
  function editor() {
    var box = document.getElementById("kEdit"); box.textContent = "";
    var f = el("form", { style: "border:1px solid var(--aksen);border-radius:12px;padding:14px;margin-top:20px;display:grid;gap:8px" });
    f.appendChild(el("b", null, "Edit kartu (" + (kunci ? "link pribadi" : "owner OCKLU") + ")"));
    function isian(lbl, v, n, t) { var l = el("label", { style: "font-size:14px" }, lbl); var i = el(t === "area" ? "textarea" : "input", { name: n, style: "display:block;width:100%;padding:8px;font:inherit;border:1px solid var(--garis);border-radius:8px;background:var(--bg);color:var(--fg)" }); i.value = v || ""; l.appendChild(i); f.appendChild(l); }
    isian("Nama usaha", D.nama, "nama"); isian("Kalimat singkat (apa yang dijual)", D.tagline, "tagline", "area"); isian("Kota", D.kota, "kota"); isian("Nomor WhatsApp (mis. 0812…)", D.wa, "wa");
    Object.keys(NAMA).forEach(function (n) { isian(NAMA[n] + " (link https://…)", (D.sosmed || {})[n], "s_" + n); });
    isian("Katalog: satu baris satu produk → nama | harga | keterangan", (D.katalog || []).map(function (x) { return x.nama + " | " + (x.harga || "") + " | " + (x.ket || ""); }).join("\n"), "katalog", "area");
    f.querySelector('[name="katalog"]').rows = 8;
    var b = el("button", { style: "padding:12px;border:0;border-radius:10px;background:var(--aksen);color:#fff;font:inherit;font-weight:700" }, "Simpan"); f.appendChild(b); var ket = el("span", { class: "redup" }); f.appendChild(ket);
    f.onsubmit = function (e) { e.preventDefault(); var v = function (n) { return f.querySelector('[name="' + n + '"]').value; }, sm = {};
      Object.keys(NAMA).forEach(function (n) { if (v("s_" + n).trim()) sm[n] = v("s_" + n).trim(); });
      var kat = v("katalog").split("\n").map(function (r) { var p = r.split("|"); return { nama: (p[0] || "").trim(), harga: Number(String(p[1] || "").replace(/[^0-9]/g, "")) || 0, ket: (p[2] || "").trim() }; }).filter(function (x) { return x.nama; });
      ket.textContent = "menyimpan…"; var h = { "content-type": "application/json" }; if (owner) h["x-perangkat"] = owner;
      fetch(API + "?r=kartu_simpan", { method: "POST", headers: h, body: JSON.stringify({ slug: slug, kunci: kunci, nama: v("nama"), tagline: v("tagline"), kota: v("kota"), wa: v("wa"), sosmed: sm, katalog: kat }) })
        .then(function (r) { return r.json(); }).then(function (d) { if (d.galat) { ket.textContent = d.galat; return; } ket.textContent = "Tersimpan. Pengunjung langsung melihatnya; versi untuk Google & AI diperbarui ≤3 jam."; muat(); })
        .catch(function () { ket.textContent = "Gagal terhubung, coba lagi."; }); };
    box.appendChild(f);
  }
  function muat() { fetch(API + "?r=kartu&slug=" + encodeURIComponent(slug), { headers: owner ? { "x-perangkat": owner } : {} }).then(function (r) { return r.json(); }).then(function (d) { if (d && d.slug) { D = d; tampil(); } }).catch(function () {}); }
  muat();
  if (kunci || owner) fetch(API + "?r=data", { headers: owner ? { "x-perangkat": owner } : {} }).then(function (r) { return r.json(); }).then(function (d) {
    if (kunci || d.owner) { var t = setInterval(function () { if (D) { clearInterval(t); editor(); } }, 300); } }).catch(function () {});
})();
