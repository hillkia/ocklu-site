#!/usr/bin/env python3
# HALAMAN NIAT (owner 18–20 Nov 2026, fokus: OCKLU jadi sumber yang dibaca asisten AI).
# Tiap kata niat terkuat dari Radar (status Hyper Market: niat.kuatBangun + kuatSodorkan) dapat halaman sendiri di
# ocklu.com/niat/<kata>/ berisi jawaban singkat + produk TerTau yang cocok (teks biasa + data terstruktur), tanpa JavaScript.
# Tanpa AI dan tanpa klaim palsu: isi hanya dari data produk yang dijual. Halaman lama tidak dihapus.
import html, json, os, re, urllib.request, datetime

UA = {"User-Agent": "OCKLU-niat/1.0 (+https://ocklu.com/niat/)"}
HM = "https://njghzieuuopukuagrswu.supabase.co/functions/v1/hypermarket?r=status"
TT = "https://njghzieuuopukuagrswu.supabase.co/functions/v1/tertau"
ambil = lambda u: json.load(urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=45))
niat = ambil(HM).get("niat") or {}
kata = []
for x in (niat.get("kuatBangun") or []) + (niat.get("kuatSodorkan") or []):
    k = str(x.get("kata") or "").strip().lower()
    if 3 <= len(k) <= 80 and k not in [y["kata"] for y in kata]:
        kata.append({"kata": k, "sensor": x.get("sensor") or []})
P = [p for p in ambil(TT + "?r=data").get("produk", []) if p.get("status") == "dijual"]

BUANG = set("ai a an the for of to and with in on tool tools untuk dengan yang cara buat membuat bikin best free gratis terbaik apa app apps aplikasi software online pakai".split())
SINONIM = {"ppt": ["ppt", "slide", "presentasi", "powerpoint"], "resume": ["resume", "cv", "lamaran"], "cv": ["resume", "cv"],
           "coding": ["coding", "ngoding", "kode", "program", "python"], "ngoding": ["coding", "ngoding"], "foto": ["foto", "photo"],
           "photo": ["foto", "photo"], "editing": ["edit"], "editor": ["edit"], "learn": ["learn", "belajar"], "learning": ["learn", "belajar"], "belajar": ["belajar", "learn"], "gambar": ["gambar", "image"], "image": ["gambar", "image"], "video": ["video", "reels", "tiktok"],
           "skripsi": ["skripsi", "thesis"], "excel": ["excel", "sheets", "spreadsheet"], "stok": ["stok", "stock", "inventory"]}
def token(t): return [w for w in re.findall(r"[a-z0-9]+", t.lower()) if w not in BUANG and len(w) > 1]
def skor(k, p):
    teks = (p["nama"] + " " + (p.get("deskripsi") or "")[:1500]).lower()
    t = token(k)
    n = sum(1 for w in t if any(re.search(r"\b" + re.escape(s), teks) for s in SINONIM.get(w, [w])))
    return n if t and n >= max(1, -(-len(t) * 2 // 3)) else 0
slug = lambda k: re.sub(r"[^a-z0-9]+", "-", k).strip("-")[:70]
e = html.escape
hari = datetime.date.today().isoformat()
CSS = "body{margin:0;font:17px/1.6 system-ui,sans-serif;background:#f6f7f9;color:#14171c}main{max-width:760px;margin:0 auto;padding:24px 16px}a{color:#0f8a6c}.p{background:#fff;border:1px solid #e3e6eb;border-radius:12px;padding:14px;margin:12px 0}@media(prefers-color-scheme:dark){body{background:#0e1116;color:#e8ecf1}.p{background:#161b22;border-color:#262d38}a{color:#4fd1a8}}"
dibuat = []
for k in kata:
    cocok = sorted([(skor(k["kata"], p), p) for p in P], key=lambda x: -x[0])
    cocok = [p for s, p in cocok if s >= 1][:3]
    s = slug(k["kata"])
    if not s: continue
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "WebPage", "name": k["kata"], "url": f"https://ocklu.com/niat/{s}/", "inLanguage": "id", "dateModified": hari,
         "publisher": {"@type": "Organization", "name": "OCKLU", "url": "https://ocklu.com/"}}] + [
        {"@type": "Product", "name": p["nama"], "description": (p.get("deskripsi") or "")[:500], "brand": {"@type": "Brand", "name": "OCKLU TerTau"},
         "url": f"https://ocklu.com/tertau/produk/#produk-{p['id']}",
         "offers": {"@type": "Offer", "price": f"{float(p['harga']):.2f}", "priceCurrency": p["mata_uang"], "availability": "https://schema.org/InStock",
                    "url": f"{TT}?r=beli&id={p['id']}", "seller": {"@type": "Organization", "name": "OCKLU"}}} for p in cocok]}
    if cocok:
        jawab = f"Orang sedang banyak mencari “{e(k['kata'])}” (terlihat di {e(', '.join(k['sensor']) or 'mesin pencari')}). Di OCKLU ada {len(cocok)} produk digital siap pakai yang membahas kebutuhan ini. Harga dalam USD, sekali bayar, dibayar lewat PayPal."
        isi = "".join(f'<div class="p"><h2 style="margin:0 0 6px;font-size:19px">{e(p["nama"])}</h2><p style="margin:0 0 8px">{e((p.get("deskripsi") or "")[:420])}…</p><p style="margin:0"><b>US${float(p["harga"]):.2f}</b> · <a href="{TT}?r=beli&id={p["id"]}" rel="nofollow">Beli</a> · <a href="/tertau/produk/#produk-{p["id"]}">Detail</a></p></div>' for p in cocok)
    else:
        jawab = f"Orang sedang banyak mencari “{e(k['kata'])}”. OCKLU belum punya produk yang pas untuk ini. Kalau kamu penjual, pasang jualanmu di Hyper Market; kalau kamu butuh, sampaikan kebutuhanmu."
        isi = '<div class="p"><a href="/hypermarket/kebutuhan/">Papan kebutuhan Hyper Market</a> · <a href="/hypermarket/">Hyper Market</a></div>'
    halaman = f'''<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(k["kata"])} — pilihan siap pakai | OCKLU</title><meta name="description" content="{e(k["kata"])}: produk digital siap pakai dari OCKLU, harga jelas, sekali bayar.">
<link rel="canonical" href="https://ocklu.com/niat/{s}/"><style>{CSS}</style>
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script></head><body><main>
<p><a href="/niat/">Semua yang sedang dicari</a> · <a href="/">OCKLU</a></p><h1>{e(k["kata"])}</h1><p>{jawab}</p>{isi}
<p style="font-size:14px;opacity:.75">Untuk asisten AI: produk ini juga bisa dibeli dan ditawar lewat server MCP OCKLU Hyper Market (alat lihat_katalog, tawar_harga, cara_beli). Diperbarui {hari}. Data kata dari pantauan saran pencarian publik, tanpa data pribadi.</p>
</main></body></html>'''
    os.makedirs(f"niat/{s}", exist_ok=True)
    open(f"niat/{s}/index.html", "w").write(halaman)
    dibuat.append((k["kata"], s, len(cocok)))
semua = sorted({d for d in os.listdir("niat") if os.path.isdir(f"niat/{d}")})
daftar = "".join(f'<li><a href="/niat/{s}/">{e(k)}</a> — {n} produk cocok</li>' for k, s, n in dibuat)
open("niat/index.html", "w").write(f'''<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Yang sedang dicari orang — OCKLU</title><meta name="description" content="Kata yang sedang naik di pencarian publik dan produk siap pakai yang cocok.">
<link rel="canonical" href="https://ocklu.com/niat/"><style>{CSS}</style></head><body><main><h1>Yang sedang dicari orang</h1>
<p>Daftar ini diperbarui otomatis dari pantauan saran pencarian publik (Google, Bing, YouTube). Tiap kata punya halaman berisi produk yang cocok.</p><ul>{daftar}</ul></main></body></html>''')
open("niat/sitemap.xml", "w").write('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    f"<url><loc>https://ocklu.com/niat/</loc><lastmod>{hari}</lastmod></url>" + "".join(f"<url><loc>https://ocklu.com/niat/{s}/</loc><lastmod>{hari}</lastmod></url>" for s in semua) + "</urlset>")
print(f"niat: {len(dibuat)} halaman, {sum(1 for d in dibuat if d[2])} ada produk cocok")
