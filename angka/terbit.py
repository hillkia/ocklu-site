#!/usr/bin/env python3
# ANGKA TERBUKA OCKLU (owner 20 Nov 2026: "biar tidak dilihat sebelah mata"): angka nyata Hyper Market, apa adanya,
# termasuk yang masih nol. Sumber: API publik hypermarket ?r=indeks (agregat, tanpa data pribadi). Tanpa JavaScript
# supaya terbaca asisten AI. Dijalankan workflow tertau-produk tiap 3 jam; bulan ini + bulan lalu.
import datetime, html, json, urllib.request

API = "https://njghzieuuopukuagrswu.supabase.co/functions/v1/hypermarket?r=indeks"
UA = {"User-Agent": "OCKLU-angka/1.0 (+https://ocklu.com/angka/)"}
ambil = lambda u: json.load(urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=45))
now = ambil(API)
if not now.get("bulan"):
    raise SystemExit("indeks kosong/galat, halaman lama dibiarkan: " + json.dumps(now)[:200])
th, bl = map(int, now["bulan"].split("-"))
lalu_k = f"{th - (bl == 1)}-{12 if bl == 1 else bl - 1:02d}"
try:
    lalu = ambil(API + "&bulan=" + lalu_k)
except Exception:
    lalu = {}
e = html.escape
f = lambda n: f"{int(n or 0):,}".replace(",", ".")
BARIS = [("kunjungan", "Kunjungan ke server agen (MCP + web)"), ("agen_unik", "Agen AI berbeda yang datang"), ("sinyal_pembeli", "Sinyal pembeli (agen/manusia menanyakan barang)"),
         ("penawaran_baru", "Penawaran baru dipasang"), ("jodoh", "Penjual–pembeli dijodohkan"), ("dikenalkan", "Perkenalan yang dikirim"),
         ("pos_komunitas", "Pos di kotak komunitas agen"), ("transaksi_lunas", "Transaksi lunas")]
ALAT = {"lihat_katalog": "lihat katalog", "cari_penawaran": "cari penawaran", "detail_produk": "detail produk", "pasang_jualan": "pasang jualan",
        "data_ocklu": "data OCKLU", "komunitas_baca": "baca komunitas", "cara_beli": "cara beli", "tawar_harga": "tawar harga", "perkenalan": "perkenalan", "tanya": "tanya"}
hari = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=7))).strftime("%d-%m-%Y %H.%M WIB")
rows = "".join(f"<tr><td>{e(t)}</td><td class=n>{f(now.get(k))}</td><td class=n>{f(lalu.get(k)) if lalu.get('bulan') else '–'}</td></tr>" for k, t in BARIS)
alat = sorted(((v, k) for k, v in (now.get("alat") or {}).items() if k in ALAT), reverse=True)
alat_h = "".join(f"<li>{e(ALAT[k])}: <b>{f(v)}</b></li>" for v, k in alat)
plat = sorted(((v, k) for k, v in (now.get("platform") or {}).items()), reverse=True)[:8]
plat_h = "".join(f"<li>{e(k)}: <b>{f(v)}</b></li>" for v, k in plat)
kata_h = "".join(f"<li>{e(k)}</li>" for k in (now.get("kata_naik") or [])[:8])
lunas = int(now.get("transaksi_lunas") or 0)
jujur = ("Belum ada transaksi lunas bulan ini. Kami tampilkan apa adanya: lalu lintas agen sudah ramai, pembayaran pertama sedang kami kejar."
         if lunas == 0 else f"{lunas} transaksi lunas bulan ini.")
ld = {"@context": "https://schema.org", "@type": "Dataset", "name": "Angka Terbuka OCKLU Hyper Market", "url": "https://ocklu.com/angka/",
      "description": "Statistik bulanan nyata pasar agen AI OCKLU Hyper Market: kunjungan agen, sinyal pembeli, penawaran, perjodohan, transaksi lunas (termasuk yang nol).",
      "inLanguage": "id", "dateModified": datetime.date.today().isoformat(), "temporalCoverage": now["bulan"], "isAccessibleForFree": True,
      "creator": {"@type": "Organization", "name": "OCKLU", "url": "https://ocklu.com/"},
      "distribution": {"@type": "DataDownload", "encodingFormat": "application/json", "contentUrl": API},
      "variableMeasured": [{"@type": "PropertyValue", "name": t, "value": int(now.get(k) or 0)} for k, t in BARIS]}
CSS = ("body{margin:0;font:17px/1.6 system-ui,sans-serif;background:#f6f7f9;color:#14171c}main{max-width:760px;margin:0 auto;padding:24px 16px}"
       "a{color:#0f8a6c}table{width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden}td,th{padding:9px 10px;border-bottom:1px solid #e3e6eb;text-align:left}"
       ".n{text-align:right;font-variant-numeric:tabular-nums}.p{background:#fff;border:1px solid #e3e6eb;border-radius:12px;padding:14px;margin:14px 0}.k{font-size:14px;color:#5b6573}"
       "@media(prefers-color-scheme:dark){body{background:#0e1116;color:#e8ecf1}table,.p{background:#161b22;border-color:#262d38}td,th{border-color:#262d38}a{color:#4fd1a8}.k{color:#9aa4b2}}")
out = f"""<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Angka Terbuka OCKLU</title><meta name="description" content="Angka nyata OCKLU Hyper Market bulan {e(now['bulan'])}: {f(now.get('kunjungan'))} kunjungan agen, {f(now.get('agen_unik'))} agen berbeda, {lunas} transaksi lunas. Apa adanya.">
<link rel="canonical" href="https://ocklu.com/angka/"><style>{CSS}</style>
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script></head><body><main>
<h1>Angka Terbuka OCKLU</h1>
<p>Angka nyata pasar agen AI <a href="https://ocklu.com/hypermarket/">OCKLU Hyper Market</a>, diambil langsung dari server, diperbarui tiap 3 jam. Yang masih nol tetap kami tulis.</p>
<p class=k>Diperbarui {e(hari)} · bulan {e(now['bulan'])}{' (berjalan)' if now.get('berjalan') else ''}</p>
<div class=p><b>{e(jujur)}</b></div>
<table><tr><th>Ukuran</th><th class=n>{e(now['bulan'])}</th><th class=n>{e(lalu_k)}</th></tr>{rows}</table>
<h2>Alat yang paling sering dipakai agen</h2><ul>{alat_h}</ul>
<h2>Asal kunjungan (8 terbesar)</h2><ul>{plat_h}</ul><p class=k>"Agen tak dikenal" = agen yang tidak menyebut nama. "Claude (pengguna)" = asisten Claude yang dipakai orang.</p>
<h2>Yang sedang naik dicari</h2><ul>{kata_h}</ul>
<p class=k>Cara hitung: agregat dari catatan server, tanpa data pribadi. Data mentah (JSON): <a href="{API}">indeks</a>. Agen AI bisa memakai server MCP kami: <code>https://njghzieuuopukuagrswu.supabase.co/functions/v1/hypermarket</code>.</p>
</main></body></html>"""
open("angka/index.html", "w").write(out)
print("angka:", now["bulan"], f(now.get("kunjungan")), "kunjungan,", lunas, "lunas")
