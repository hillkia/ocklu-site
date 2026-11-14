#!/usr/bin/env python3
# Halaman per kebutuhan (ocklu.com/hypermarket/kebutuhan/k/<slug>/) supaya tiap kebutuhan bisa ditemukan Google & agen AI.
# Sumber: rute publik ?r=kebutuhan (tanpa sumber asli, tanpa tender pemerintah). Isi berasal dari pihak luar → semua di-escape.
# Dijalankan GitHub Actions (tertau-produk.yml) tiap 3 jam. Halaman yang kebutuhannya sudah hilang dihapus; sitemap kebutuhan ditulis ulang.
import hashlib, html, json, pathlib, re, shutil, urllib.request

API = "https://njghzieuuopukuagrswu.supabase.co/functions/v1/hypermarket?r=kebutuhan"
AKAR = pathlib.Path(__file__).resolve().parent / "k"
req = urllib.request.Request(API, headers={"User-Agent": "OCKLU-terbit/1.0 (+https://ocklu.com/hypermarket/kebutuhan/)"})
K = json.load(urllib.request.urlopen(req, timeout=40)).get("kebutuhan", [])
e = html.escape


def slug(x):
    s = re.sub(r"[^a-z0-9]+", "-", x["judul"].lower()).strip("-")[:60].strip("-") or "kebutuhan"
    return f"{s}-{hashlib.sha1(x['id'].encode()).hexdigest()[:6]}"


dibuat = set()
for x in K:
    sl = slug(x)
    dibuat.add(sl)
    url = f"https://ocklu.com/hypermarket/kebutuhan/k/{sl}/"
    ld = {"@context": "https://schema.org", "@type": "Demand", "name": x["judul"], "description": (x.get("ringkas") or x["judul"])[:500], "url": url,
          "availabilityStarts": x.get("tanggal"), "seller": {"@type": "Organization", "name": "OCKLU Hyper Market (broker)", "url": "https://ocklu.com/hypermarket/"}}
    if x.get("negara"):
        ld["eligibleRegion"] = x["negara"]
    ld = {k: v for k, v in ld.items() if v}
    hal = f"""<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dicari: {e(x['judul'][:80])} · OCKLU Hyper Market</title>
<meta name="description" content="{e(('Dicari pemasok: ' + x['judul'] + '. ' + (x.get('ringkas') or ''))[:155])}">
<link rel="canonical" href="{url}">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False).replace('<', '\\u003c')}</script>
<style>body{{margin:0;background:#f7f6f2;color:#1d1f24;font:16px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}}main{{max-width:760px;margin:0 auto;padding:24px 16px 80px}}
@media (prefers-color-scheme:dark){{body{{background:#12151a;color:#e9e7e2}}.kotak{{background:#1b1e23!important;border-color:#2c3038!important}}}}
h1{{font-size:26px;line-height:1.25}}.kotak{{background:#fff;border:1px solid #e3e1da;border-radius:12px;padding:14px;margin:14px 0}}a.btn{{display:inline-block;background:#0f7b6c;color:#fff;padding:10px 16px;border-radius:10px;text-decoration:none;font-weight:700}}.meta{{opacity:.7;font-size:14px}}</style>
</head><body><main>
<p><a href="/hypermarket/kebutuhan/">← Papan Kebutuhan Terbuka</a></p>
<p class="meta">Dicari / Wanted · {e(x.get('tanggal') or '')}{(' · ' + e(x['negara'])) if x.get('negara') else ''}{(' · ' + e(x['jenis_sumber'])) if x.get('jenis_sumber') else ''}</p>
<h1>{e(x['judul'])}</h1>
{('<p>' + e(x['ringkas']) + '</p>') if x.get('ringkas') else ''}
<div class="kotak"><b>Anda bisa memenuhi ini? / Can you supply this?</b><br>
Pasang penawaran Anda (gratis 30 hari). Agen OCKLU mencocokkan dan mempertemukan; komisi 7% hanya kalau transaksi jadi. OCKLU adalah makelar, bukan pihak yang membutuhkan.<br>
<span lang="en">List your offer (free for 30 days). OCKLU agents match and introduce; 7% only on completed deals. OCKLU is the broker, not the buyer.</span></div>
<p><a class="btn" href="/hypermarket/?kebutuhan={e(x['id'])}#makelar">Saya bisa memenuhi ini →</a></p>
<p class="meta">Untuk agen AI: <code>POST https://njghzieuuopukuagrswu.supabase.co/functions/v1/hypermarket?r=kebutuhan</code> untuk memasang kebutuhan, atau alat MCP <code>pasang_jualan</code> untuk menawarkan.</p>
</main><script src="/hm.js" defer></script></body></html>
"""
    d = AKAR / sl
    d.mkdir(parents=True, exist_ok=True)
    (d / "index.html").write_text(hal, encoding="utf-8")

if AKAR.exists():
    for d in AKAR.iterdir():
        if d.is_dir() and d.name not in dibuat:
            shutil.rmtree(d)

peta = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
peta += [f"<url><loc>https://ocklu.com/hypermarket/kebutuhan/k/{s}/</loc><changefreq>weekly</changefreq><priority>0.5</priority></url>" for s in sorted(dibuat)]
peta.append("</urlset>")
(pathlib.Path(__file__).resolve().parent / "sitemap.xml").write_text("\n".join(peta) + "\n", encoding="utf-8")
print(f"{len(dibuat)} halaman kebutuhan")
