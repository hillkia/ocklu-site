var w=(a,t)=>()=>{try{return t||a((t={exports:{}}).exports,t),t.exports}catch(r){throw t=0,r}};var F=w((Q,M)=>{"use strict";var A=(a,t)=>Math.pow(a-t,2),N=(a,t,r=.25)=>1-A(a,t)/r,x=a=>a.length?a.reduce((t,r)=>t+r,0)/a.length:null;function H(a,t=30){let r=new Map;for(let o of a){let u=Math.min(9,Math.floor(o.p*10));r.has(u)||r.set(u,[]),r.get(u).push(o)}return[...r.entries()].sort((o,u)=>o[0]-u[0]).map(([o,u])=>({bucket:o,rentang:`${o*10}\u2013${o*10+10}%`,klaim:x(u.map(l=>l.p))*100,aktual:x(u.map(l=>l.hasil))*100,n:u.length,cukup:u.length>=t}))}var C=a=>{let t=x(a.map(r=>r.hasil));return t===null?.25:t*(1-t)};function W(a,t={}){let r=t.minSampel??30,o=a.length;if(!o)return{n:0,kosong:!0};let u=a.map(d=>A(d.p,d.hasil)),l=x(u),s=x(a.map(d=>d.hasil)),i=.25,m=s*(1-s),h=a.every(d=>Number.isFinite(d.pasar))?x(a.map(d=>A(d.pasar,d.hasil))):null,b=H(a,r),g=b.filter(d=>d.cukup),n=(x(a.map(d=>d.p))-s)*100,e=g.length?x(g.map(d=>d.klaim-d.aktual)):null,c=n,p=[];l>i&&p.push({berat:"tinggi",teks:`Brier ${l.toFixed(4)} di atas 0.25 \u2014 rata-rata lebih buruk daripada nebak 50/50.`}),m&&l>m&&p.push({berat:"tinggi",teks:`Brier ${l.toFixed(4)} kalah dari tebak-base-rate-terus (${m.toFixed(4)}). Modelnya belum nambah apa-apa di atas "tebak angka rata-rata".`}),h!==null&&l>h&&p.push({berat:"tinggi",teks:`Brier ${l.toFixed(4)} kalah dari harga pasar (${h.toFixed(4)}). Ikut pasar aja hasilnya lebih baik.`}),e!==null&&Math.abs(e-n)>4&&p.push({berat:"sedang",teks:`Bias total ${n.toFixed(1)} poin tapi bias per-bucket ${e.toFixed(1)} poin \u2014 miringnya gak merata, numpuk di rentang keyakinan tertentu.`}),c!==null&&c>5&&p.push({berat:"tinggi",teks:`Rata-rata ngaku ${c.toFixed(1)} poin lebih yakin daripada kenyataan. Ini overconfidence sistematis, bukan apes.`}),c!==null&&c<-5&&p.push({berat:"sedang",teks:`Rata-rata ngaku ${Math.abs(c).toFixed(1)} poin KURANG yakin daripada kenyataan. Underconfident \u2014 peluang ketinggalan.`}),b.length&&g.length<b.length&&p.push({berat:"sedang",teks:`${b.length-g.length} dari ${b.length} bucket punya sampel < ${r}. Titik-titik itu gak boleh dipakai buat nyimpulin apa pun.`}),o<r&&p.push({berat:"tinggi",teks:`Cuma ${o} prediksi. Di bawah ${r}, seluruh laporan ini indikasi arah, bukan kesimpulan.`});let k=a.filter(d=>d.p>=.95||d.p<=.05);if(k.length){let d=k.filter(K=>K.p>.5!=(K.hasil===1)).length;d&&p.push({berat:"tinggi",teks:`${d} dari ${k.length} prediksi "hampir pasti" (\u226595% atau \u22645%) meleset. Klaim ekstrem yang meleset itu yang paling mahal di Brier.`})}return p.length||p.push({berat:"rendah",teks:"Gak ada masalah kalibrasi yang menonjol. Klaim dan kenyataan nempel."}),{n:o,kosong:!1,brier:l,base_rate:s,baseline_koin:i,baseline_base_rate:m,baseline_pasar:h,bss_koin:1-l/i,bss_base_rate:m?1-l/m:null,bss_pasar:h?1-l/h:null,bias_klaim:c,bias_total:n,bias_bucket:e,bucket:b,min_sampel:r,temuan:p,vonis:h!==null?l<=h?"LEBIH BAIK DARI HARGA PASAR":"KALAH DARI HARGA PASAR":m&&l<=m?"LEBIH BAIK DARI BASE RATE":l<=i?"LEBIH BAIK DARI KOIN, TAPI KALAH DARI BASE RATE":"LEBIH BURUK DARI KOIN"}}M.exports={brier:A,bss:N,bucket:H,audit:W,rata:x,baselineBaseRate:C}});var D=w((Z,j)=>{"use strict";var X=F(),B={p:["prediksi","probabilitas","probability","p","p_model","forecast","confidence","prob"],hasil:["hasil","outcome","actual","aktual","y","resolved","truth","label_hasil"],pasar:["pasar","harga_pasar","market","market_price","p_market","konsensus","consensus"],nama:["label","nama","market","market_id","pertanyaan","question","id"]};function U(a){let t=a.split(/\r?\n/).filter(n=>n.trim()),r=n=>{let e=[],c="",p=!1;for(let k of n)k==='"'?p=!p:(k===","||k===";"||k==="	")&&!p?(e.push(c),c=""):c+=k;return e.push(c),e.map(k=>k.trim())},o=r(t[0]).map(n=>n.toLowerCase().replace(/^﻿/,"")),u=n=>o.findIndex(e=>B[n].includes(e)),l=u("p"),s=u("hasil"),i=u("pasar"),m=u("nama");if(l<0||s<0)throw new Error(`Kolom gak ketemu. Butuh kolom probabilitas (${B.p.slice(0,4).join("/")}) dan kolom hasil (${B.hasil.slice(0,4).join("/")}).
  Header yang kebaca: ${o.join(", ")}`);let $=[],h=[];for(let n=1;n<t.length;n++){let e=r(t[n]),c=Number(e[l]),p=Number(e[s]);if(!Number.isFinite(c)||!(p===0||p===1)){h.push(n+1);continue}$.push({p:c,hasil:p,pasar:i>=0?Number(e[i]):NaN,nama:m>=0?e[m]:`baris ${n+1}`})}if(Math.max(...$.map(n=>n.p))>1)for(let n of $)n.p=n.p/100,Number.isFinite(n.pasar)&&(n.pasar=n.pasar/100);let g=$.filter(n=>n.p<0||n.p>1);if(g.length)throw new Error(`${g.length} baris probabilitasnya di luar 0..1. Cek datanya.`);return{data:$,buang:h}}function G(a,t){let s=e=>58+e/100*444,i=e=>402-e/100*384,m=a.bucket,$=m.map(e=>`${s(e.klaim)},${i(e.aktual)}`).join(" "),h=e=>e==null?"\u2014":`${(e*100).toFixed(1)}%`,b=(e,c=4)=>e==null?"\u2014":Number(e).toFixed(c),g=a.vonis.startsWith("LEBIH BAIK")?"#4ADE80":a.vonis.startsWith("KALAH")?"#FF5A5A":a.vonis.includes("KOIN, TAPI")?"#F5A524":"#FF5A5A",n=(e,c,p,k)=>`
    <div class="kartu">
      <div class="k">${e}</div>
      <div class="v" style="color:${p}">${c}</div>
      ${k?`<div class="s">${k}</div>`:""}
    </div>`;return`<!doctype html>
<html lang="id"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Audit Kalibrasi \u2014 ${t.nama}</title>
<style>
  :root{--bg:#070B14;--panel:#0D1424;--text:#E7EDF7;--muted:#9FB0C8;--dim:#5B6B85;
        --gold:#E8C87A;--green:#4ADE80;--red:#FF5A5A;--amber:#F5A524;--line:rgba(120,150,200,.14)}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--text);
       font:14px/1.6 ui-sans-serif,system-ui,-apple-system,sans-serif}
  .wrap{max-width:900px;margin:0 auto;padding:32px 16px 56px}
  h1{font:700 22px/1.3 ui-monospace,Menlo,monospace;letter-spacing:.1em;color:var(--gold);margin:0 0 4px}
  h2{font:700 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.16em;text-transform:uppercase;
     color:var(--text);margin:32px 0 12px}
  .sub{color:var(--dim);font:12px ui-monospace,Menlo,monospace;margin-bottom:24px}
  .vonis{border:1px solid ${g}55;background:${g}12;border-radius:12px;padding:16px 18px;margin:20px 0}
  .vonis .t{font:700 13px ui-monospace,Menlo,monospace;letter-spacing:.1em;color:${g}}
  .grid{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(150px,1fr))}
  .kartu{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:12px 14px}
  .kartu .k{font:10px ui-monospace,Menlo,monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--dim)}
  .kartu .v{font:700 20px ui-monospace,Menlo,monospace;margin-top:4px}
  .kartu .s{font-size:11px;color:var(--dim);margin-top:3px;line-height:1.45}
  table{width:100%;border-collapse:collapse;font:12px ui-monospace,Menlo,monospace}
  th,td{text-align:left;padding:7px 8px;border-bottom:1px solid var(--line)}
  th{color:var(--dim);font-weight:400;font-size:10px;letter-spacing:.1em;text-transform:uppercase}
  .tipis{color:var(--red)}
  ul.temuan{list-style:none;padding:0;margin:0}
  ul.temuan li{background:var(--panel);border:1px solid var(--line);border-left-width:3px;
    border-radius:8px;padding:11px 14px;margin-bottom:8px;font-size:13px;color:var(--muted)}
  li.tinggi{border-left-color:var(--red)} li.sedang{border-left-color:var(--amber)}
  li.rendah{border-left-color:var(--green)}
  .cara{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:16px 18px;
        font-size:12.5px;color:var(--muted);line-height:1.75}
  code{font-family:ui-monospace,Menlo,monospace;color:var(--gold)}
  footer{margin-top:40px;padding-top:14px;border-top:1px solid var(--line);
         font:10px ui-monospace,Menlo,monospace;color:var(--dim);display:flex;gap:12px;flex-wrap:wrap}
  @media print{body{background:#fff;color:#111}.kartu,ul.temuan li,.cara{background:#fff}}
</style></head>
<body><div class="wrap">
  <h1>AUDIT KALIBRASI</h1>
  <div class="sub">${t.nama} \xB7 ${a.n} prediksi \xB7 ${t.tanggal}</div>

  <div class="vonis">
    <div class="t">${a.vonis}</div>
    <div style="color:var(--muted);font-size:13px;margin-top:6px">
      Brier ${b(a.brier)} \u2014 lawan yang relevan bukan koin 50/50, tapi
      ${a.baseline_pasar!==null?"harga pasar":"tebak-base-rate-terus"}
      (${b(a.baseline_pasar!==null?a.baseline_pasar:a.baseline_base_rate)}).
    </div>
  </div>

  <div class="grid">
    
    ${n("Brier score",b(a.brier),a.brier<=(a.baseline_pasar!==null?a.baseline_pasar:a.baseline_base_rate)?"var(--green)":"var(--red)",`makin kecil makin bagus \xB7 lawannya ${a.baseline_pasar!==null?"pasar":"base rate"} ${b(a.baseline_pasar!==null?a.baseline_pasar:a.baseline_base_rate)}`)}
    ${n("BSS vs base rate",b(a.bss_base_rate,3),(a.bss_base_rate??-1)>0?"var(--green)":"var(--red)","&gt; 0 = nambah nilai di atas tebak rata-rata")}
    ${a.baseline_pasar!==null?n("BSS vs pasar",b(a.bss_pasar,3),(a.bss_pasar??-1)>0?"var(--green)":"var(--red)","&gt; 0 = ngalahin konsensus"):""}
    ${n("Bias keyakinan",`${a.bias_total>0?"+":""}${a.bias_total.toFixed(1)} poin`,Math.abs(a.bias_total)>5?"var(--red)":"var(--green)","rata-rata klaim \u2212 kenyataan \xB7 plus = kepedean"+(a.bias_bucket===null?" \xB7 per-bucket: sampel belum cukup":` \xB7 per-bucket ${a.bias_bucket>0?"+":""}${a.bias_bucket.toFixed(1)}`))}
    ${n("Base rate",h(a.base_rate),"var(--muted)","seberapa sering hasilnya YA")}
  </div>

  <h2>Kurva reliabilitas</h2>
  <svg viewBox="0 0 520 460" style="width:100%;max-width:520px;display:block;margin:0 auto">
    <polygon points="${s(0)},${i(0)} ${s(100)},${i(0)} ${s(100)},${i(100)}" fill="rgba(255,90,90,.05)"/>
    <text x="${s(74)}" y="${i(20)}" fill="rgba(255,90,90,.55)" font-size="10" font-family="ui-monospace" text-anchor="middle">zona terlalu pede</text>
    ${[0,25,50,75,100].map(e=>`
      <line x1="${s(e)}" y1="${i(0)}" x2="${s(e)}" y2="${i(100)}" stroke="rgba(120,150,200,.08)"/>
      <line x1="${s(0)}" y1="${i(e)}" x2="${s(100)}" y2="${i(e)}" stroke="rgba(120,150,200,.08)"/>
      <text x="${s(e)}" y="${i(0)+16}" fill="#5B6B85" font-size="9" font-family="ui-monospace" text-anchor="middle">${e}</text>
      <text x="${s(0)-9}" y="${i(e)+3}" fill="#5B6B85" font-size="9" font-family="ui-monospace" text-anchor="end">${e}</text>`).join("")}
    <line x1="${s(0)}" y1="${i(0)}" x2="${s(100)}" y2="${i(100)}" stroke="#5B6B85" stroke-dasharray="4 4"/>
    <text x="${s(26)}" y="${i(34)}" fill="#5B6B85" font-size="9" font-family="ui-monospace"
          transform="rotate(-38 ${s(26)} ${i(34)})">kalibrasi sempurna</text>
    <polyline points="${$}" fill="none" stroke="#E8C87A" stroke-width="1.8"/>
    ${m.map(e=>`
      ${e.cukup?"":`<circle cx="${s(e.klaim)}" cy="${i(e.aktual)}" r="11" fill="none" stroke="#FF5A5A" stroke-dasharray="2 3"/>
      <text x="${s(e.klaim)}" y="${i(e.aktual)-16}" fill="#FF5A5A" font-size="8.5" font-family="ui-monospace" text-anchor="middle">n=${e.n}</text>`}
      <circle cx="${s(e.klaim)}" cy="${i(e.aktual)}" r="${3+Math.sqrt(e.n)/3}"
              fill="${e.klaim-e.aktual>5?"#FF5A5A":"#E8C87A"}" opacity=".9"/>`).join("")}
    <text x="${520/2}" y="450" fill="#9FB0C8" font-size="10" font-family="ui-monospace" text-anchor="middle">probabilitas yang diklaim (%)</text>
    <text x="14" y="${460/2}" fill="#9FB0C8" font-size="10" font-family="ui-monospace" text-anchor="middle" transform="rotate(-90 14 ${460/2})">frekuensi aktual (%)</text>
  </svg>
  <div style="text-align:center;color:var(--dim);font-size:11px;margin-top:6px">
    Titik di bawah garis = ngaku lebih yakin daripada kenyataan.
    Lingkaran putus-putus = sampel &lt; ${a.min_sampel}, jangan disimpulkan.
  </div>

  <h2>Per bucket</h2>
  <table>
    <tr><th>rentang klaim</th><th>rata-rata klaim</th><th>kenyataan</th><th>selisih</th><th>n</th></tr>
    ${m.map(e=>`<tr class="${e.cukup?"":"tipis"}">
      <td>${e.rentang}</td><td>${e.klaim.toFixed(1)}%</td><td>${e.aktual.toFixed(1)}%</td>
      <td>${e.klaim-e.aktual>0?"+":""}${(e.klaim-e.aktual).toFixed(1)}</td>
      <td>${e.n}${e.cukup?"":" \u26A0"}</td></tr>`).join("")}
  </table>

  <h2>Temuan</h2>
  <ul class="temuan">
    ${a.temuan.map(e=>`<li class="${e.berat}">${e.teks}</li>`).join("")}
  </ul>

  ${t.terparah.length?`<h2>Sepuluh meleset terparah</h2>
  <table>
    <tr><th>keputusan</th><th>klaim</th><th>hasil</th><th>Brier</th></tr>
    ${t.terparah.map(e=>`<tr><td>${e.nama}</td><td>${(e.p*100).toFixed(0)}%</td>
      <td>${e.hasil?"YA":"TIDAK"}</td><td class="tipis">${e.brier.toFixed(4)}</td></tr>`).join("")}
  </table>`:""}

  <h2>Cara bacanya</h2>
  <div class="cara">
    <b>Brier score</b> = rata-rata <code>(klaim \u2212 hasil)\xB2</code>. Nol itu sempurna,
    0.25 itu sama aja kayak nebak 50/50 terus.<br><br>
    <b>Yang diukur itu kalibrasi, bukan tebakan bener.</b> Orang yang bilang 90% dan bener
    9 dari 10 kali menang dari orang yang bilang 99% dan bener 9 dari 10 kali. Yang kedua
    sombong, dan Brier menghukumnya.<br><br>
    <b>Baseline 0.25 itu jebakan.</b> Kalau kejadiannya jarang (base rate 10%), model yang
    asal jawab "tidak" terus udah dapet Brier 0.09 \u2014 jauh di bawah 0.25 tanpa skill apa pun.
    Makanya laporan ini bandingin ke <b>base rate</b>${a.baseline_pasar!==null?" dan <b>harga pasar</b>":""},
    bukan ke koin.<br><br>
    <b>Bucket dengan n &lt; ${a.min_sampel} gak dipakai buat nyimpulin.</b> Titik yang cuma berisi
    8 prediksi bisa kelihatan dramatis padahal itu cuma noise. Angka bias keyakinan di atas
    dihitung cuma dari bucket yang sampelnya cukup.
  </div>

  <footer>
    <span>Audit Kalibrasi \u2014 OCKLU</span>
    <span>Ini cermin, bukan nasihat investasi.</span>
    <span style="margin-left:auto">Paid in Full \u2014 Jesus is God \u271D\uFE0F</span>
  </footer>
</div></body></html>`}j.exports={baca:U,html:G,ALIAS:B}});var V=w(()=>{var z=F(),{baca:O,html:q}=D(),f=a=>document.querySelector(a),v=f("#zona"),I=f("#berkas"),L=f("#hasil"),E=f("#bingkai"),R=f("#galat"),Y=f("#ringkas"),P=f("#nama"),y=null;function _(a){R.textContent=a,R.hidden=!1,L.hidden=!0}function S(a,t){R.hidden=!0;let r;try{r=O(a)}catch(i){return _(i.message)}if(!r.data.length)return _("Gak ada baris yang kebaca dari file itu.");let o=z.audit(r.data),u=r.data.map(i=>({...i,brier:z.brier(i.p,i.hasil)})).sort((i,m)=>m.brier-i.brier).slice(0,10),l={nama:(P.value||"").trim()||t.replace(/\.[^.]+$/,""),tanggal:new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"}),terparah:u};y={dok:q(o,l),nama:l.nama},E.srcdoc=y.dok;let s=o.vonis.startsWith("LEBIH BAIK")?"var(--green)":o.vonis.startsWith("KALAH")?"var(--red)":"var(--amber)";Y.innerHTML=`<b style="color:${s}">${o.vonis}</b> \xB7 ${o.n} prediksi \xB7 Brier ${o.brier.toFixed(4)}`+(r.buang.length?` \xB7 <span style="color:var(--amber)">${r.buang.length} baris dilewat (formatnya gak kebaca)</span>`:""),L.hidden=!1,L.scrollIntoView({behavior:"smooth",block:"start"})}function T(a){if(!a)return;let t=new FileReader;t.onload=()=>S(String(t.result),a.name),t.onerror=()=>_("File-nya gagal dibaca."),t.readAsText(a)}["dragenter","dragover"].forEach(a=>v.addEventListener(a,t=>{t.preventDefault(),v.classList.add("aktif")}));["dragleave","drop"].forEach(a=>v.addEventListener(a,t=>{t.preventDefault(),v.classList.remove("aktif")}));v.addEventListener("drop",a=>T(a.dataTransfer.files[0]));v.addEventListener("click",()=>I.click());I.addEventListener("change",()=>T(I.files[0]));f("#unduh").addEventListener("click",()=>{if(!y)return;let a=new Blob([y.dok],{type:"text/html"}),t=document.createElement("a");t.href=URL.createObjectURL(a),t.download=`audit-kalibrasi-${y.nama.replace(/[^\w-]+/g,"-").toLowerCase()}.html`,t.click(),URL.revokeObjectURL(t.href)});f("#cetak").addEventListener("click",()=>{E.contentWindow&&E.contentWindow.print()});f("#contoh").addEventListener("click",async a=>{a.preventDefault(),a.stopPropagation();try{let t=await fetch("contoh.csv").then(r=>{if(!r.ok)throw new Error(`data contoh gak ketemu (HTTP ${r.status})`);return r.text()});P.value="Contoh",S(t,"contoh.csv")}catch(t){_("Data contohnya gak kebaca: "+t.message)}})});export default V();
