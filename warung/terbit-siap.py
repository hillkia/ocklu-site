#!/usr/bin/env python3
# Halaman warung Ocklu Ojol versi teks (ocklu.com/warung/siap/), dwibahasa, untuk Google dan agen AI:
# setiap warung di etalase otomatis "siap dibaca AI" (schema.org Restaurant + menu & harga). Dijalankan GitHub Actions tiap 3 jam.
# Sumber: etalase.json publik (hanya data yang sudah diterbitkan warung lewat terbit-etalase.py di ocklu-ojol). Semua isi di-escape.
# Folder warung/ juga ditulis engine blue ocean (copytree tanpa hapus), jadi warung/siap/ yang dibuat di sini tidak tertimpa.
import html, json, pathlib, urllib.request

req = urllib.request.Request("https://ocklu.com/warung/etalase.json", headers={"User-Agent": "OCKLU-terbit/1.0 (+https://ocklu.com/warung/siap/)"})
E = json.load(urllib.request.urlopen(req, timeout=30))
W = E.get("warung") or []
e = html.escape
rp = lambda n: "Rp" + f"{int(n):,}".replace(",", ".")

def data(w):
    return {"@type": "Restaurant", "name": w["nama"], "url": f"https://ocklu.com/warung/siap/#{w['id']}", "servesCuisine": w.get("jenis") or "Masakan Indonesia",
            "address": {"@type": "PostalAddress", "addressLocality": w.get("area") or "", "addressCountry": "ID"}, "areaServed": w.get("area") or "",
            "hasMenu": {"@type": "Menu", "hasMenuSection": {"@type": "MenuSection", "name": "Menu", "hasMenuItem": [
                {"@type": "MenuItem", "name": m["nama"], "offers": {"@type": "Offer", "price": str(m["harga"]), "priceCurrency": "IDR"}} for m in (w.get("menu") or [])]}}}

ld = json.dumps({"@context": "https://schema.org", "@type": "ItemList", "name": "Warung Ocklu Ojol / Ocklu Ojol food stalls", "url": "https://ocklu.com/warung/siap/",
                 "itemListElement": [{"@type": "ListItem", "position": i, "item": data(w)} for i, w in enumerate(W, 1)]}, ensure_ascii=False, indent=1).replace("<", "\\u003c")

def kartu(w):
    menu = "".join(f'<li>{e(m["nama"])} · <b>{rp(m["harga"])}</b></li>' for m in (w.get("menu") or []))
    promo = f'<p class="promo">{e(w["promo"])}</p>' if w.get("promo") else ""
    return (f'<li class="w" id="{e(str(w["id"]))}"><h2>{e(w["nama"])}</h2><p class="meta">{e(w.get("jenis") or "Warung makan")} · {e(w.get("area") or "")}</p>{promo}'
            f'<ul class="menu">{menu}</ul><p><a href="/warung/">Pesan lewat Ocklu Ojol / Order via Ocklu Ojol</a></p></li>')

kosong = '<li class="w">Belum ada warung yang terdaftar. Punya warung? <a href="/warung/">Daftarkan di Ocklu Ojol</a>. / No food stalls listed yet. Own one? <a href="/warung/">List it on Ocklu Ojol</a>.</li>'
halaman = f"""<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Warung Ocklu Ojol: menu & harga ({len(W)} warung) / Food stalls, menus & prices</title>
<meta name="description" content="Daftar warung makan di Ocklu Ojol lengkap dengan menu, harga Rupiah, dan area antar. Food stalls on Ocklu Ojol with menus, IDR prices and delivery areas.">
<link rel="canonical" href="https://ocklu.com/warung/siap/">
<script type="application/ld+json">
{ld}
</script>
<style>:root{{color-scheme:light dark;--bg:#fff;--fg:#14181f;--redup:#5b6472;--aksen:#0b7a5e;--garis:#d9dee5}}
@media (prefers-color-scheme:dark){{:root{{--bg:#0f1318;--fg:#e8ecf1;--redup:#9aa4b2;--aksen:#4fd1a8;--garis:#2a313b}}}}
body{{margin:0;background:var(--bg);color:var(--fg);font:16px/1.55 system-ui,sans-serif}}main{{max-width:760px;margin:0 auto;padding:24px 16px 48px}}
h1{{font-size:24px;margin:0 0 6px}}h2{{font-size:18px;margin:0 0 4px}}a{{color:var(--aksen)}}p{{margin:6px 0}}.redup,.meta{{color:var(--redup)}}.meta{{font-size:14px}}.promo{{font-weight:600}}
ul{{list-style:none;padding:0}}li.w{{border:1px solid var(--garis);border-radius:12px;padding:14px;margin:0 0 12px}}.menu li{{padding:3px 0;border-bottom:1px dashed var(--garis)}}</style>
</head><body><main>
<h1>Warung Ocklu Ojol</h1>
<p class="redup">Warung makan yang bisa dipesan lewat Ocklu Ojol, lengkap dengan menu dan harga, otomatis siap dibaca AI dan Google. / Food stalls you can order from via Ocklu Ojol, with menus and prices, automatically readable by AI and search engines.</p>
<ul>
{chr(10).join(kartu(w) for w in W) or kosong}
</ul>
<p class="redup">Ingin warung atau usahamu sendiri siap dibaca AI? / Want your own business readable by AI? <a href="/siap-dibaca-ai/">Siap Dibaca AI</a></p>
</main></body></html>
"""
out = pathlib.Path(__file__).resolve().parent / "siap" / "index.html"
out.parent.mkdir(exist_ok=True)
if out.exists() and out.read_text(encoding="utf-8") == halaman:
    print(f"tidak berubah ({len(W)} warung)")
else:
    out.write_text(halaman, encoding="utf-8")
    print(f"diperbarui ({len(W)} warung)")
