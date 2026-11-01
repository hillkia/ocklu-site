/* OCKLU · Saran iklan minggu ini (1 Nov 2026). Dipakai laporan.html (klien) dan index.html (owner, tab Saran Iklan).
   Data: k.iklan dari hm_klien_kpi = jejak saran ketik yang dibaca EZRA (Google, YouTube, Bing; tingkat Indonesia).
   Semua salinan disusun dari data itu, tanpa AI pengarang. Angka BUKAN volume pencarian dan BUKAN per wilayah. */
(function () {
  var NEG = /\b(gratis|free|cara (membuat|bikin|buat)|diy|bekas|second|tutorial|download|apk|sendiri|sketsa|gambar|mewarnai|lirik|arti)\b/i;
  var e = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var besar = function (s) { return String(s || "").replace(/(^|\s)\S/g, function (c) { return c.toUpperCase(); }); };
  var rp = function (b) { return b && b.harga ? ((b.mata_uang || "IDR") === "IDR" ? "Rp" + Number(b.harga).toLocaleString("id-ID") : b.mata_uang + " " + b.harga) : ""; };
  var tagar = function (s) { return "#" + String(s).toLowerCase().replace(/[^a-z0-9]+/g, ""); };
  var salin = function (t, l) { return ' <button type="button" class="btn mini" data-salin-iklan="' + e(t) + '">' + (l || "Salin") + "</button>"; };
  function tren(x, minggu1) {
    if (minggu1) return '<span class="lemah">● baru dipantau</span>';
    if (!x.lalu) return "<b>▲ baru muncul</b>";
    var r = x.ini / x.lalu;
    return r >= 1.2 ? '<b style="color:#1a7f37">▲ naik ' + Math.round((r - 1) * 100) + "%</b>" : r <= 0.8 ? '<span style="color:#9a5b00">▼ turun ' + Math.round((1 - r) * 100) + "%</span>" : "■ stabil";
  }
  function gaya() {
    if (document.getElementById("gayaIklan")) return;
    var st = document.createElement("style"); st.id = "gayaIklan";
    st.textContent = ".iklan table{width:100%;border-collapse:collapse;font-size:14px}.iklan th,.iklan td{border-bottom:1px solid var(--garis,#ddd);padding:6px 4px;text-align:left;vertical-align:top}"
      + ".iklan pre,.iklan code.blok{display:block;white-space:pre-wrap;background:rgba(127,127,127,.12);padding:8px;border-radius:8px;margin:4px 0 0;font-size:14px}.iklan h3{font-size:16px;margin:18px 0 6px}"
      + ".iklan .lemah{opacity:.75;font-size:13px}.iklan li{margin:4px 0}";
    document.head.appendChild(st);
  }
  window.saranIklan = function (k) {
    gaya();
    var I = k.iklan || {}, semua = I.kata || [];
    var K = semua.filter(function (x) { return !NEG.test(x.kata); }), N = semua.filter(function (x) { return NEG.test(x.kata); });
    var B = (k.barang || []).filter(function (b) { return b.status === "aktif"; }), b0 = B[0] || {}, nama = k.nama || "", link = (k.kanal || [])[0] || "";
    var minggu1 = !I.mulai || Date.now() - new Date(I.mulai).getTime() < 7 * 864e5, ps = I.per_sumber || {};
    if (!K.length) return '<p class="lemah">Belum ada data saran ketik untuk barang ini. EZRA memeriksa tiap 2 jam; saran muncul setelah nama barang tercatat.</p>';
    var top = K.slice(0, 3).map(function (x) { return x.kata; });
    var judul = besar(top[0]) + (rp(b0) ? " – " + rp(b0) : "") + (nama ? " | " + nama : "");
    var cap = "Lagi cari " + top[0] + "? " + (b0.judul ? besar(b0.judul) : "Barang kami") + (rp(b0) ? " cuma " + rp(b0) : "") + ". "
      + (top[1] ? besar(top[1]) + (top[2] ? ", " + top[2] : "") + " — ada! " : "") + (link ? "Order: " + link : "Chat untuk order.")
      + "\n\n" + K.slice(0, 6).map(function (x) { return tagar(x.kata); }).join(" ");
    var wa = "✅ " + besar(top[0]) + (rp(b0) ? " " + rp(b0) : "") + "\n" + (top[1] ? "✔ " + besar(top[1]) + "\n" : "") + (top[2] ? "✔ " + besar(top[2]) + "\n" : "") + (link ? "Order: " + link : "Balas chat ini untuk pesan.");
    var kk = K.slice(0, 10).map(function (x) { return '"' + x.kata + '"'; }).join("\n");
    var tempat = [];
    if ((ps.youtube || 0) >= (ps.google || 0) * 0.8) tempat.push("<li><b>Video pendek (TikTok, Reels, YouTube Shorts)</b>: " + (ps.youtube || 0) + " kata barang ini muncul di saran YouTube, tanda orang mencari videonya. Pakai judul video persis <i>" + e(besar(top[0])) + "</i> dan tunjukkan <i>" + e(top[1] || top[0]) + "</i> di 3 detik pertama.</li>");
    if (ps.google) tempat.push("<li><b>Judul produk marketplace dan iklan pencarian</b>: " + ps.google + " kata muncul di saran Google. Taruh kata nomor 1 di awal judul produk Shopee/Tokopedia dan di judul iklan Google.</li>");
    if (ps.bing) tempat.push("<li><b>Bing</b>: " + ps.bing + " kata. Iklan Bing sering lebih murah per klik untuk kata yang sama; cocok untuk uji anggaran kecil.</li>");
    return '<div class="iklan">'
      + '<p class="lemah">Dari ' + Object.keys(ps).length + " mesin saran ketik (Google, YouTube, Bing; tingkat Indonesia), 7 hari terakhir." + (minggu1 ? " <b>Minggu pertama dipantau</b>: tanda naik/turun muncul mulai minggu depan." : "") + "</p>"
      + "<h3>1. Kata yang sedang diketik orang (pakai persis)</h3><div style=\"overflow-x:auto\"><table><thead><tr><th>Kata</th><th>Muncul 7 hari</th><th>Urutan rata-rata</th><th>Tren</th><th>Di mana</th></tr></thead><tbody>"
      + K.slice(0, 10).map(function (x) { return "<tr><td><b>" + e(x.kata) + "</b></td><td>" + x.ini + "×</td><td>" + (x.pos || "-") + "</td><td>" + tren(x, minggu1) + "</td><td>" + e((x.sumber || []).join(", ")) + "</td></tr>"; }).join("")
      + '</tbody></table></div><p class="lemah">"Muncul" = berapa kali kata itu tampil di saran ketik saat EZRA memeriksa. "Urutan 1" = saran paling atas, tanda paling banyak diketik. Ini bukan jumlah orang.</p>'
      + "<h3>2. Di mana memasang</h3><ul>" + tempat.join("") + "</ul>"
      + "<h3>3. Salinan siap pakai</h3>"
      + "<p><b>Judul produk / iklan</b>" + salin(judul) + '<code class="blok">' + e(judul) + "</code></p>"
      + "<p><b>Caption Instagram / TikTok</b>" + salin(cap) + "<pre>" + e(cap) + "</pre></p>"
      + "<p><b>Status / broadcast WA</b>" + salin(wa) + "<pre>" + e(wa) + "</pre></p>"
      + "<p><b>Kata kunci iklan</b> (Google Ads, Meta, Shopee/Tokopedia Ads; pakai pencocokan persis)" + salin(kk, "Salin 10 kata") + "<pre>" + e(kk) + "</pre></p>"
      + (N.length ? "<p><b>Kata negatif</b>: masukkan ke daftar pengecualian iklan supaya tidak membayar klik orang yang tidak berniat membeli." + salin(N.map(function (x) { return x.kata; }).join("\n")) + '<br><span class="lemah">' + e(N.map(function (x) { return x.kata; }).join(", ")) + "</span></p>" : "")
      + "<h3>4. Langkah minggu ini</h3><ol><li>Ganti judul produk di marketplace dengan judul di atas.</li><li>Unggah 1 video pendek dengan kata nomor 1 sebagai judul.</li>"
      + "<li>Kalau beriklan berbayar: pakai hanya kata di atas (pencocokan persis) dan kata negatif. Mulai dengan anggaran kecil, lalu lihat kata mana yang diklik.</li>"
      + "<li>Minggu depan buka laporan ini lagi: kata bertanda ▲ naik diberi anggaran lebih, yang ▼ turun dikurangi.</li></ol>"
      + '<p class="lemah">Jujur: saran ini dari pola ketikan publik, bukan jaminan laku. Data tidak tahu siapa yang mengetik dan dari wilayah mana.</p></div>';
  };
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest && ev.target.closest("[data-salin-iklan]"); if (!b) return;
    var t = b.getAttribute("data-salin-iklan");
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { b.textContent = "Tersalin ✓"; }, function () { window.prompt("Salin:", t); });
  });
})();
