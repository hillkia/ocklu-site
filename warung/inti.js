/* Fungsi murni untuk ocklu.com/warung — dipakai halaman & diuji node. */
(function (g) {
  const rp = n => "Rp" + Math.round(n || 0).toLocaleString("id-ID");
  // Potongan per pesanan: OCKLU 7% dari harga menu vs aplikasi pesan-antar (kisaran 20–30%).
  function banding(harga, jumlah) {
    const total = Math.max(0, harga || 0) * Math.max(0, jumlah || 0);
    const ocklu = Math.round(total * 0.07);
    const apl20 = Math.round(total * 0.20), apl30 = Math.round(total * 0.30);
    return { total, ocklu, apl20, apl30, hematMin: apl20 - ocklu, hematMax: apl30 - ocklu };
  }
  // Pesanan pembeli → teks WA. pilihan: {namaMenu: qty}
  function pesanan(w, pilihan, cara, ongkir) {
    const baris = [], harga = {};
    (w.menu || []).forEach(m => harga[m.nama] = m.harga);
    let total = 0;
    for (const [n, q] of Object.entries(pilihan || {})) {
      if (!(q > 0) || !harga[n]) continue;
      baris.push(`${q} x ${n} (${rp(harga[n])})`); total += q * harga[n];
    }
    const antar = cara === "antar" && w.antar;
    const ong = antar ? (ongkir || 0) : 0;
    const teks = [
      `Kode ${w.kodeOjol} · ${w.nama}`,
      ...baris,
      `Total makanan: ${rp(total)}${antar ? ` + ongkir ${rp(ong)}` : ""}`,
      antar ? "Cara: diantar. Alamat saya: " : "Cara: ambil sendiri",
      "Makanan dibayar ke QRIS warung."
    ].join("\n");
    return { teks, total, ongkir: ong, kosong: baris.length === 0 };
  }
  function linkWA(nomor, teks) {
    const n = String(nomor || "").replace(/\D/g, "").replace(/^0/, "62");
    if (n.length < 10) return "";
    return `https://wa.me/${n}?text=${encodeURIComponent(teks)}`;
  }
  const api = { rp, banding, pesanan, linkWA };
  if (typeof module !== "undefined") module.exports = api; else g.Warung = api;
})(this);
