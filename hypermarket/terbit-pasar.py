#!/usr/bin/env python3
# Halaman pasar Hyper Market versi teks (ocklu.com/hypermarket/pasar/), dwibahasa, untuk Google dan agen AI:
# setiap penawaran aktif otomatis "siap dibaca AI" (schema.org Product/Service). Dijalankan GitHub Actions bersama terbit TerTau.
# Isi penawaran ditulis penjual, jadi diperlakukan sebagai data asing: semua di-escape, link penjual hanya http(s) dan nofollow ugc.
# Kontak penjual tidak pernah ada di sini (rute ?r=pasar hanya memberi kolom publik). Tanpa stempel waktu: commit hanya kalau ada perubahan.
import html, json, pathlib, urllib.request

API = "https://njghzieuuopukuagrswu.supabase.co/functions/v1/hypermarket"
req = urllib.request.Request(API + "?r=pasar", headers={"User-Agent": "OCKLU-terbit/1.0 (+https://ocklu.com/hypermarket/pasar/)"})
P = json.load(urllib.request.urlopen(req, timeout=30)).get("penawaran", [])
e = html.escape
JENIS = {"produk": "Produk / Product", "jasa": "Jasa / Service", "agen": "Agen AI / AI agent", "data": "Data / Dataset"}

def harga(p):
    return f'{p["mata_uang"]} {float(p["harga"]):,.0f}'.replace(",", ".") if p.get("harga") is not None else "Harga dinegosiasikan / Price on request"

def butir(i, p):
    it = {"@type": "Service" if p["jenis"] in ("jasa", "agen") else "Product", "name": p["judul"], "description": (p.get("deskripsi") or p["judul"])[:500],
          "category": p.get("industri") or "lainnya", "url": f"https://ocklu.com/hypermarket/pasar/#p-{p['id']}"}
    if it["@type"] == "Product": it["sku"] = f"hm-{p['id']}"
    if p.get("penjual"): it["provider" if it["@type"] == "Service" else "brand"] = {"@type": "Organization" if it["@type"] == "Service" else "Brand", "name": p["penjual"]}
    if p.get("harga") is not None:
        it["offers"] = {"@type": "Offer", "price": f'{float(p["harga"]):.2f}', "priceCurrency": p["mata_uang"], "url": it["url"],
                        "availability": "https://schema.org/InStock", "areaServed": p.get("wilayah") or None}
        it["offers"] = {k: v for k, v in it["offers"].items() if v}
    return {"@type": "ListItem", "position": i, "item": it}

ld = {"@context": "https://schema.org", "@type": "ItemList", "name": "OCKLU Hyper Market — penawaran aktif / active listings",
      "url": "https://ocklu.com/hypermarket/pasar/", "itemListElement": [butir(i, p) for i, p in enumerate(P, 1)]}
ld_teks = json.dumps(ld, ensure_ascii=False, indent=1).replace("</", "<\\/")

def kartu(p):
    situs = p.get("url") or ""
    situs = f' · <a rel="nofollow ugc noopener" href="{e(situs)}">situs penjual / seller site</a>' if situs.startswith(("https://", "http://")) else ""
    return (f'<li id="p-{p["id"]}"><h2>{e(p["judul"])}</h2><p class="meta">{e(JENIS.get(p["jenis"], p["jenis"]))} · {e(p.get("industri") or "lainnya")}'
            f' · {e(p.get("wilayah") or "Global")} · oleh / by {e(p.get("penjual") or "penjual")}</p><p class="harga">{e(harga(p))}</p>'
            f'<p>{e(p.get("deskripsi") or "")}</p><p><a href="/hypermarket/#makelar">Minta dipertemukan / Ask for an introduction</a>{situs}</p></li>')

halaman = f"""<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Pasar OCKLU Hyper Market: {len(P)} penawaran aktif / active listings</title>
<meta name="description" content="Produk, jasa, agen AI, dan data dari berbagai industri di OCKLU Hyper Market. Products, services, AI agents and datasets from many industries. Kontak dibuka setelah kedua pihak setuju / contacts open only after both sides agree.">
<link rel="canonical" href="https://ocklu.com/hypermarket/pasar/">
<script type="application/ld+json">
{ld_teks}
</script>
<style>:root{{color-scheme:light dark;--bg:#fff;--fg:#14181f;--redup:#5b6472;--aksen:#0b7a5e;--garis:#d9dee5}}
@media (prefers-color-scheme:dark){{:root{{--bg:#0f1318;--fg:#e8ecf1;--redup:#9aa4b2;--aksen:#4fd1a8;--garis:#2a313b}}}}
body{{margin:0;background:var(--bg);color:var(--fg);font:16px/1.55 system-ui,sans-serif}}main{{max-width:820px;margin:0 auto;padding:24px 16px 48px}}
h1{{font-size:24px;margin:0 0 6px}}h2{{font-size:18px;margin:0 0 4px;overflow-wrap:anywhere}}a{{color:var(--aksen)}}p{{margin:6px 0;overflow-wrap:anywhere}}.redup,.meta{{color:var(--redup)}}.meta{{font-size:14px}}
ul{{list-style:none;padding:0}}li{{border:1px solid var(--garis);border-radius:12px;padding:14px;margin:0 0 12px}}.harga{{font-weight:700}}</style>
</head><body><main>
<h1>Pasar OCKLU Hyper Market</h1>
<p class="redup">Semua penawaran aktif di Hyper Market, otomatis siap dibaca AI. Kontak penjual dirahasiakan sampai kedua pihak setuju; komisi 7% hanya kalau transaksi terjadi lewat perjodohan OCKLU. Mau ikut tampil di sini? <a href="/hypermarket/#makelar">Pasang jualan gratis</a>. Ingin situsmu sendiri siap dibaca AI? <a href="/siap-dibaca-ai/">Siap Dibaca AI</a>.</p>
<p class="redup">All active Hyper Market listings, automatically readable by AI. Seller contacts stay private until both sides agree; 7% fee only on deals made through an OCKLU match. List for free at <a href="/hypermarket/#makelar">Hyper Market</a>; AI agents can use the MCP server (com.ocklu/hypermarket) with cari_penawaran and minta_dipertemukan.</p>
<ul>
{chr(10).join(kartu(p) for p in P) or "<li>Belum ada penawaran aktif / No active listings yet.</li>"}
</ul>
</main></body></html>
"""
out = pathlib.Path(__file__).resolve().parent / "pasar" / "index.html"
out.parent.mkdir(exist_ok=True)
if out.exists() and out.read_text(encoding="utf-8") == halaman:
    print(f"tidak berubah ({len(P)} penawaran)")
else:
    out.write_text(halaman, encoding="utf-8")
    print(f"diperbarui ({len(P)} penawaran)")
