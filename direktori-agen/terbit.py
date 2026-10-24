#!/usr/bin/env python3
# Direktori layanan & agen AI dari MCP Registry resmi (ocklu.com/direktori-agen/), siap dibaca AI, 1000 per halaman.
# Berlabel jelas: layanan di sini BELUM bergabung dengan OCKLU Hyper Market; pembuatnya bisa "Klaim & pasang gratis".
# Data: rute publik hypermarket ?r=cermin (cermin FILIPUS). Dijalankan GitHub Actions harian. Semua isi di-escape; link keluar nofollow.
import html, json, pathlib, shutil, urllib.parse, urllib.request

API = "https://njghzieuuopukuagrswu.supabase.co/functions/v1/hypermarket?r=cermin&hal="
DIR = pathlib.Path(__file__).resolve().parent
e = html.escape

def ambil(n):
    req = urllib.request.Request(API + str(n), headers={"User-Agent": "OCKLU-terbit/1.0 (+https://ocklu.com/direktori-agen/)"})
    return json.load(urllib.request.urlopen(req, timeout=60))

hal, semua = 1, []
while True:
    d = ambil(hal)
    if not d.get("data"): break
    semua.append(d["data"]); hal += 1
    if hal > 200: break
total = sum(len(x) for x in semua)

def alamat(n): return "/direktori-agen/" if n == 1 else f"/direktori-agen/hal/{n}/"

def nav(n):
    k = [f'<a href="{alamat(n - 1)}">‹ sebelumnya</a>'] if n > 1 else []
    k += [f'<b>{i}</b>' if i == n else f'<a href="{alamat(i)}">{i}</a>' for i in range(1, len(semua) + 1) if i in (1, len(semua)) or abs(i - n) <= 2]
    k += [f'<a href="{alamat(n + 1)}">berikutnya ›</a>'] if n < len(semua) else []
    return '<p class="nav">' + " · ".join(k) + "</p>"

def halaman(n, xs):
    ld = json.dumps({"@context": "https://schema.org", "@type": "ItemList", "name": f"Direktori agen & layanan AI (MCP Registry) — halaman {n}",
                     "itemListElement": [{"@type": "ListItem", "position": (n - 1) * 1000 + i, "item": {"@type": "SoftwareApplication", "name": x["judul"] or x["nama"],
                       "identifier": x["nama"], "applicationCategory": "AI agent / MCP server", "url": x["situs"], "description": (x["deskripsi"] or "")[:200]}}
                                         for i, x in enumerate(xs, 1)]}, ensure_ascii=False).replace("<", "\\u003c")
    li = "\n".join(
        f'<li><h2>{e(x["judul"] or x["nama"])}</h2><p class="id">{e(x["nama"])}</p><p>{e(x["deskripsi"] or "")}</p>'
        f'<p><a rel="nofollow noopener" href="{e(x["situs"])}">Situs pembuat</a> · '
        f'<a href="/hypermarket/?klaim={urllib.parse.quote(x["nama"])}&amp;situs={urllib.parse.quote(x["situs"], safe="")}#makelar">Ini layanan saya: klaim &amp; pasang gratis</a></p></li>'
        for x in xs)
    return f"""<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Direktori agen & layanan AI dari MCP Registry — halaman {n} | OCKLU</title>
<meta name="description" content="{total} layanan dan agen AI yang terdaftar di MCP Registry resmi, disalin otomatis dan siap dibaca AI. Pembuatnya bisa mengklaim dan memasang gratis di OCKLU Hyper Market.">
<link rel="canonical" href="https://ocklu.com{alamat(n)}">
<script type="application/ld+json">
{ld}
</script>
<style>:root{{color-scheme:light dark;--bg:#fff;--fg:#14181f;--redup:#5b6472;--aksen:#0b7a5e;--garis:#d9dee5}}
@media (prefers-color-scheme:dark){{:root{{--bg:#0f1318;--fg:#e8ecf1;--redup:#9aa4b2;--aksen:#4fd1a8;--garis:#2a313b}}}}
body{{margin:0;background:var(--bg);color:var(--fg);font:16px/1.5 system-ui,sans-serif}}main{{max-width:860px;margin:0 auto;padding:24px 16px 48px}}
h1{{font-size:24px;margin:0 0 6px}}h2{{font-size:17px;margin:0;overflow-wrap:anywhere}}a{{color:var(--aksen)}}p{{margin:4px 0;overflow-wrap:anywhere}}.id,.redup{{color:var(--redup)}}.id{{font-size:13px}}
.label{{border:1px solid var(--aksen);border-radius:12px;padding:12px;margin:12px 0}}ul{{list-style:none;padding:0}}li{{border-bottom:1px solid var(--garis);padding:12px 0}}.nav{{margin:16px 0}}</style>
</head><body><main>
<h1>Direktori agen & layanan AI</h1>
<div class="label"><b>Disalin otomatis dari MCP Registry resmi.</b> Layanan di halaman ini <b>belum bergabung</b> dengan OCKLU Hyper Market dan tidak terafiliasi dengan OCKLU. Kamu pembuatnya? Tekan "klaim & pasang gratis": komisi 7% hanya kalau transaksi terjadi lewat perjodohan OCKLU. / Copied automatically from the official MCP Registry; listings here have not joined OCKLU Hyper Market and are not affiliated with OCKLU. Makers can claim and list for free.</div>
<p class="redup">{total} layanan · halaman {n} dari {len(semua)}. Untuk agen AI: cari lewat MCP <a href="/hypermarket/">OCKLU Hyper Market</a> (com.ocklu/hypermarket), alat cari_agen.</p>
{nav(n)}
<ul>
{li}
</ul>
{nav(n)}
</main></body></html>
"""

berubah = 0
for n, xs in enumerate(semua, 1):
    out = DIR / ("index.html" if n == 1 else f"hal/{n}/index.html")
    out.parent.mkdir(parents=True, exist_ok=True)
    s = halaman(n, xs)
    if not out.exists() or out.read_text(encoding="utf-8") != s:
        out.write_text(s, encoding="utf-8"); berubah += 1
for p in (DIR / "hal").glob("*") if (DIR / "hal").exists() else []:
    if p.is_dir() and p.name.isdigit() and int(p.name) > len(semua): shutil.rmtree(p)
print(f"{total} layanan, {len(semua)} halaman, {berubah} berubah")
