#!/usr/bin/env python3
# Halaman ocklu.com/siap-dibaca-ai versi statis untuk Google & agen AI, dibangun dari templat (.templat.html, tidak ikut tayang)
# dan isi yang diedit owner di database (fungsi siapdibaca). Dijalankan GitHub Actions tiap 3 jam. Semua isi di-escape.
import html, json, pathlib, re, urllib.parse, urllib.request

DIR = pathlib.Path(__file__).resolve().parent
req = urllib.request.Request("https://njghzieuuopukuagrswu.supabase.co/functions/v1/siapdibaca?r=data", headers={"User-Agent": "OCKLU-terbit/1.0 (+https://ocklu.com/siap-dibaca-ai/)"})
D = json.load(urllib.request.urlopen(req, timeout=30))
P = {p["id"]: p for p in D["paket"]}
e = html.escape
rp = lambda n: "Rp" + f"{int(n):,}".replace(",", ".")

def kartu(p):
    isi = "".join(f"<li>{e(x)}</li>" for x in p["isi"].split("\n") if x.strip())
    pesan = urllib.parse.quote("Pesan Siap Dibaca AI - " + p["nama"])
    return (f'<div class="kartu{" utama" if p["utama"] else ""}" data-p="{e(p["id"])}"><h3>{e(p["nama"])}</h3><div class="harga">{rp(p["harga"])}</div>'
            f'<div class="redup">{e(p["keterangan"])}</div><ul>{isi}</ul><a class="tombol" href="mailto:octavianus@ocklu.com?subject={pesan}">Pesan {e(p["nama"])}</a></div>')

s = (DIR / ".templat.html").read_text(encoding="utf-8")
s = re.sub(r"<!--PAKET:([\w,]+)-->.*?<!--/PAKET-->", lambda m: f"<!--PAKET:{m[1]}-->" + "".join(kartu(P[i]) for i in m[1].split(",") if i in P) + "<!--/PAKET-->", s, flags=re.S)
s = re.sub(r'(<(\w+) data-t="(\w+)"[^>]*>).*?(</\2>)', lambda m: m[1] + e(D["teks"].get(m[3], "")) + m[4], s, flags=re.S)
ld = {"@context": "https://schema.org", "@type": "Service", "name": D["teks"].get("judul", "Siap Dibaca AI"), "serviceType": "Optimasi agar produk dapat dibaca AI (GEO/AEO)",
      "provider": {"@type": "Organization", "name": "OCKLU", "url": "https://ocklu.com/", "email": "octavianus@ocklu.com"}, "areaServed": "ID", "url": "https://ocklu.com/siap-dibaca-ai/",
      "description": D["teks"].get("pembuka", "")[:500],
      "offers": [{"@type": "Offer", "name": p["nama"], "price": str(p["harga"]), "priceCurrency": "IDR", "description": p["keterangan"]} for p in D["paket"]]}
s = re.sub(r"<!--LD-->.*?<!--/LD-->", lambda m: '<!--LD--><script type="application/ld+json">\n' + json.dumps(ld, ensure_ascii=False).replace("<", "\\u003c") + "\n</script><!--/LD-->", s, flags=re.S)
out = DIR / "index.html"
if out.exists() and out.read_text(encoding="utf-8") == s:
    print(f"tidak berubah ({len(P)} paket)")
else:
    out.write_text(s, encoding="utf-8")
    print(f"diperbarui ({len(P)} paket)")
