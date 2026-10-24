#!/usr/bin/env python3
# Halaman statis produk TerTau (ocklu.com/tertau/produk/) untuk Google dan agen AI yang tidak menjalankan JavaScript.
# Dijalankan GitHub Actions tiap 3 jam (.github/workflows/tertau-produk.yml). Sumber data: API publik TerTau.
# Link beli diberi nofollow: tiap kunjungan ke ?r=beli membuat pesanan, jadi bot mesin pencari tidak boleh mengikutinya.
# Tanpa stempel waktu di halaman, supaya commit hanya terjadi kalau produk/harga benar-benar berubah.
import html, json, pathlib, urllib.request

API = "https://njghzieuuopukuagrswu.supabase.co/functions/v1/tertau"
req = urllib.request.Request(API + "?r=data", headers={"User-Agent": "OCKLU-terbit/1.0 (+https://ocklu.com/tertau/produk/)"})
data = json.load(urllib.request.urlopen(req, timeout=30))
P = [p for p in data.get("produk", []) if p.get("status") == "dijual"]
e = html.escape
harga = lambda p: f"{float(p['harga']):.2f}"
beli = lambda p: f"{API}?r=beli&id={p['id']}"

ld = {"@context": "https://schema.org", "@type": "ItemList", "name": "Toko TerTau: produk digital OCKLU", "url": "https://ocklu.com/tertau/produk/",
      "itemListElement": [{"@type": "ListItem", "position": i, "item": {
          "@type": "Product", "name": p["nama"], "description": (p.get("deskripsi") or p["nama"])[:500], "sku": f"tertau-{p['id']}",
          "category": "Produk digital", "brand": {"@type": "Brand", "name": "OCKLU TerTau"}, "url": f"https://ocklu.com/tertau/produk/#produk-{p['id']}",
          "offers": {"@type": "Offer", "price": harga(p), "priceCurrency": p["mata_uang"], "availability": "https://schema.org/InStock",
                     "url": f"https://ocklu.com/tertau/produk/#produk-{p['id']}", "seller": {"@type": "Organization", "name": "OCKLU", "url": "https://ocklu.com/"}}}}
          for i, p in enumerate(P, 1)]}
ld_teks = json.dumps(ld, ensure_ascii=False, indent=1).replace("</", "<\\/")

daftar = "\n".join(
    f'<li id="produk-{p["id"]}"><h2>{e(p["nama"])}</h2><p class="harga">{e(p["mata_uang"])} {harga(p)}</p>'
    f'<p>{e(p.get("deskripsi") or "")}</p><p><a class="beli" rel="nofollow" href="{e(beli(p))}">Beli lewat PayPal</a> · file terkirim otomatis setelah PayPal mengonfirmasi pembayaran.</p></li>'
    for p in P) or "<li>Belum ada produk yang dijual saat ini.</li>"

ringkas = ", ".join(f'{p["nama"]} ({p["mata_uang"]} {harga(p)})' for p in P)[:300] or "Produk digital buatan agen AI TerTau."
halaman = f"""<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Produk TerTau: template Google Sheets untuk UMKM dan seller | OCKLU</title>
<meta name="description" content="{e(ringkas)}">
<link rel="canonical" href="https://ocklu.com/tertau/produk/">
<script type="application/ld+json">
{ld_teks}
</script>
<style>:root{{color-scheme:light dark;--bg:#fff;--fg:#14181f;--redup:#5b6472;--aksen:#0b7a5e;--garis:#d9dee5}}
@media (prefers-color-scheme:dark){{:root{{--bg:#0f1318;--fg:#e8ecf1;--redup:#9aa4b2;--aksen:#4fd1a8;--garis:#2a313b}}}}
body{{margin:0;background:var(--bg);color:var(--fg);font:16px/1.55 system-ui,sans-serif}}main{{max-width:760px;margin:0 auto;padding:24px 16px 48px}}
h1{{font-size:24px;margin:0 0 6px}}h2{{font-size:18px;margin:0 0 4px}}a{{color:var(--aksen)}}p{{margin:6px 0}}.redup{{color:var(--redup)}}
ul{{list-style:none;padding:0}}li{{border:1px solid var(--garis);border-radius:12px;padding:14px;margin:0 0 12px}}.harga{{font-weight:700}}</style>
</head><body><main>
<h1>Produk TerTau</h1>
<p class="redup">Produk digital buatan TerTau, agen AI OCKLU. Bayar lewat PayPal; file dikirim otomatis setelah pembayaran terkonfirmasi. Halaman lengkap dan obrolan: <a href="/tertau/">ocklu.com/tertau</a>. Untuk agen AI: katalog yang sama tersedia lewat MCP <a href="/hypermarket/">OCKLU Hyper Market</a>.</p>
<ul>
{daftar}
</ul>
</main></body></html>
"""
out = pathlib.Path(__file__).resolve().parent / "produk" / "index.html"
out.parent.mkdir(exist_ok=True)
if out.exists() and out.read_text(encoding="utf-8") == halaman:
    print(f"tidak berubah ({len(P)} produk)")
else:
    out.write_text(halaman, encoding="utf-8")
    print(f"diperbarui ({len(P)} produk)")
