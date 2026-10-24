#!/usr/bin/env python3
# Halaman Kartu Siap Dibaca AI (ocklu.com/kartu/<slug>/) untuk penjual tanpa situs: satu identitas (schema.org sameAs ke semua sosmed),
# katalog & harga Rupiah, tombol WhatsApp. Data dari fungsi siapdibaca (?r=kartu); isi ditulis klien → semua di-escape.
# Dijalankan GitHub Actions tiap 3 jam. Editor (link pribadi / perangkat owner) ada di kartu/kartu.js dan juga memuat data terbaru.
import html, json, pathlib, shutil, urllib.parse, urllib.request

API = "https://njghzieuuopukuagrswu.supabase.co/functions/v1/siapdibaca?r=kartu"
DIR = pathlib.Path(__file__).resolve().parent
K = json.load(urllib.request.urlopen(urllib.request.Request(API, headers={"User-Agent": "OCKLU-terbit/1.0 (+https://ocklu.com/kartu/)"}), timeout=30))
e = html.escape
NAMA = {"youtube": "YouTube", "instagram": "Instagram", "tiktok": "TikTok", "threads": "Threads", "snack": "Snack Video", "x": "X", "facebook": "Facebook",
        "telegram": "Telegram", "whatsapp_channel": "Saluran WhatsApp", "shopee": "Shopee", "tokopedia": "Tokopedia", "situs": "Situs"}
rp = lambda n: "Rp" + f"{int(n):,}".replace(",", ".")
GAYA = """:root{color-scheme:light dark;--bg:#fff;--fg:#14181f;--redup:#5b6472;--aksen:#0b7a5e;--garis:#d9dee5}
@media (prefers-color-scheme:dark){:root{--bg:#0f1318;--fg:#e8ecf1;--redup:#9aa4b2;--aksen:#4fd1a8;--garis:#2a313b}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.55 system-ui,sans-serif}main{max-width:640px;margin:0 auto;padding:28px 16px 48px}
h1{font-size:28px;margin:0 0 4px}a{color:var(--aksen)}.redup{color:var(--redup)}.sos{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0}
.sos a{border:1px solid var(--garis);border-radius:999px;padding:6px 14px;text-decoration:none}ul{list-style:none;padding:0}li{border-bottom:1px solid var(--garis);padding:10px 0}
.harga{font-weight:700}.wa{display:block;text-align:center;margin:18px 0;padding:14px;border-radius:12px;background:#1f9d55;color:#fff;font-weight:700;text-decoration:none}"""

def halaman(k):
    url = f"https://ocklu.com/kartu/{k['slug']}/"
    wa = f"https://wa.me/{k['wa']}?text=" + urllib.parse.quote(f"Halo {k['nama']}, saya lihat katalog di ocklu.com/kartu/{k['slug']}") if k["wa"] else ""
    ld = {"@context": "https://schema.org", "@type": "Organization", "name": k["nama"], "description": k["tagline"] or k["nama"], "url": url,
          "sameAs": list(k["sosmed"].values()), "address": {"@type": "PostalAddress", "addressLocality": k["kota"], "addressCountry": "ID"},
          "makesOffer": [{"@type": "Offer", "price": str(x["harga"]), "priceCurrency": "IDR", "url": url,
                          "itemOffered": {"@type": "Product", "name": x["nama"], "description": x["ket"] or x["nama"]}} for x in k["katalog"]]}
    if wa: ld["contactPoint"] = {"@type": "ContactPoint", "contactType": "sales", "url": wa}
    sos = "".join(f'<a rel="me noopener" href="{e(v)}">{e(NAMA.get(n, n))}</a>' for n, v in k["sosmed"].items())
    kat = "".join(f'<li><b>{e(x["nama"])}</b> · <span class="harga">{rp(x["harga"]) if x["harga"] else "tanya harga"}</span>{"<br><span class=redup>" + e(x["ket"]) + "</span>" if x["ket"] else ""}</li>' for x in k["katalog"])
    return f"""<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(k["nama"])}{" · " + e(k["kota"]) if k["kota"] else ""}: katalog & kontak</title>
<meta name="description" content="{e((k["tagline"] + " · " if k["tagline"] else "") + ", ".join(x["nama"] for x in k["katalog"][:8]))[:300]}">
<link rel="canonical" href="{url}">
<script type="application/ld+json">
{json.dumps(ld, ensure_ascii=False).replace("<", "\\u003c")}
</script>
<style>{GAYA}</style></head><body><main data-kartu="{e(k["slug"])}">
<h1 id="kNama">{e(k["nama"])}</h1><p class="redup" id="kSub">{e(k["tagline"])}{" · " + e(k["kota"]) if k["kota"] else ""}</p>
<div class="sos" id="kSos">{sos}</div>
<h2 style="font-size:18px">Katalog</h2><ul id="kKat">{kat or "<li class=redup>Katalog belum diisi.</li>"}</ul>
{f'<a class="wa" id="kWa" href="{e(wa)}">Pesan lewat WhatsApp</a>' if wa else ""}
<p class="redup" style="font-size:13px">Kartu ini siap dibaca AI · dibuat dengan <a href="/siap-dibaca-ai/#kartu">Kartu Siap Dibaca AI</a> dari OCKLU</p>
<div id="kEdit"></div></main><script src="/kartu/kartu.js" defer></script></body></html>
"""

aktif = set()
for k in K:
    aktif.add(k["slug"]); out = DIR / k["slug"] / "index.html"; out.parent.mkdir(exist_ok=True)
    s = halaman(k)
    if not out.exists() or out.read_text(encoding="utf-8") != s: out.write_text(s, encoding="utf-8")
for p in DIR.iterdir():
    if p.is_dir() and p.name not in aktif and (p / "index.html").exists(): shutil.rmtree(p)
daftar = "".join(f'<li><a href="/kartu/{e(k["slug"])}/"><b>{e(k["nama"])}</b></a>{" · " + e(k["kota"]) if k["kota"] else ""}<br><span class="redup">{e(k["tagline"])}</span></li>' for k in K)
idx = f"""<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Kartu Siap Dibaca AI: penjual OCKLU</title>
<meta name="description" content="Penjual tanpa situs yang bisa dibaca AI: katalog, harga Rupiah, dan semua akun sosmed dalam satu kartu."><link rel="canonical" href="https://ocklu.com/kartu/">
<style>{GAYA}</style></head><body><main><h1>Kartu Siap Dibaca AI</h1><p class="redup">Penjual yang memakai kartu OCKLU. Mau punya kartu juga? <a href="/siap-dibaca-ai/#kartu">Lihat paketnya</a>.</p>
<ul>{daftar or "<li class=redup>Belum ada kartu.</li>"}</ul></main></body></html>
"""
if not (DIR / "index.html").exists() or (DIR / "index.html").read_text(encoding="utf-8") != idx: (DIR / "index.html").write_text(idx, encoding="utf-8")
print(f"{len(K)} kartu")
