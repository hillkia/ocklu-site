var I=(a,n)=>()=>{try{return n||a((n={exports:{}}).exports,n),n.exports}catch(t){throw n=0,t}};var N=I((la,j)=>{"use strict";var T=(a,n)=>Math.pow(a-n,2),J=(a,n,t=.25)=>1-T(a,n)/t,_=a=>a.length?a.reduce((n,t)=>n+t,0)/a.length:null;function O(a,n=30){let t=new Map;for(let i of a){let u=Math.min(9,Math.floor(i.p*10));t.has(u)||t.set(u,[]),t.get(u).push(i)}return[...t.entries()].sort((i,u)=>i[0]-u[0]).map(([i,u])=>({bucket:i,rentang:`${i*10}\u2013${i*10+10}%`,klaim:_(u.map(o=>o.p))*100,aktual:_(u.map(o=>o.hasil))*100,n:u.length,cukup:u.length>=n}))}var Z=a=>{let n=_(a.map(t=>t.hasil));return n===null?.25:n*(1-n)};function Q(a,n={}){let t=n.minSampel??30,i=a.length;if(!i)return{n:0,kosong:!0};let u=a.map(c=>T(c.p,c.hasil)),o=_(u),b=_(a.map(c=>c.hasil)),r=.25,s=b*(1-b),h=a.every(c=>Number.isFinite(c.pasar))?_(a.map(c=>T(c.pasar,c.hasil))):null,m=O(a,t),y=m.filter(c=>c.cukup),g=(_(a.map(c=>c.p))-b)*100,A=y.length?_(y.map(c=>c.klaim-c.aktual)):null,l=g,e=[],d=(c,X,V)=>e.push({berat:c,kode:X,nilai:V});o>r&&d("tinggi","DI_ATAS_KOIN",{brier:o}),s&&o>s&&d("tinggi","KALAH_BASE_RATE",{brier:o,baseline:s}),h!==null&&o>h&&d("tinggi","KALAH_PASAR",{brier:o,baseline:h}),A!==null&&Math.abs(A-g)>4&&d("sedang","BIAS_TAK_MERATA",{total:g,bucket:A}),g>5&&d("tinggi","KEPEDEAN",{poin:g}),g<-5&&d("sedang","KURANG_PEDE",{poin:Math.abs(g)}),m.length&&y.length<m.length&&d("sedang","BUCKET_TIPIS",{tipis:m.length-y.length,total:m.length,min:t}),i<t&&d("tinggi","DATA_SEDIKIT",{n:i,min:t});let f=a.filter(c=>c.p>=.95||c.p<=.05),$=f.filter(c=>c.p>.5!=(c.hasil===1)).length;return $&&d("tinggi","EKSTREM_MELESET",{salah:$,total:f.length}),e.length||d("rendah","BERSIH",{}),{n:i,kosong:!1,brier:o,base_rate:b,baseline_koin:r,baseline_base_rate:s,baseline_pasar:h,bss_koin:1-o/r,bss_base_rate:s?1-o/s:null,bss_pasar:h?1-o/h:null,bias_klaim:l,bias_total:g,bias_bucket:A,bucket:m,min_sampel:t,temuan:e,vonis:h!==null?o<=h?"MENANG_PASAR":"KALAH_PASAR":s&&o<=s?"MENANG_BASE_RATE":o<=r?"MENANG_KOIN_KALAH_BASE_RATE":"KALAH_KOIN"}}j.exports={brier:T,bss:J,bucket:O,audit:Q,rata:_,baselineBaseRate:Z}});var G=I((ca,C)=>{"use strict";var ua=N(),R={p:["prediksi","probabilitas","probability","p","p_model","forecast","confidence","prob"],hasil:["hasil","outcome","actual","aktual","y","resolved","truth","label_hasil"],pasar:["pasar","harga_pasar","market","market_price","p_market","konsensus","consensus"],nama:["label","nama","market","market_id","pertanyaan","question","id"]},p=a=>Number(a).toFixed(4),k=a=>Number(a).toFixed(1),L={id:{judul:"AUDIT KALIBRASI",prediksi:a=>`${a} prediksi`,vonis:{MENANG_PASAR:"LEBIH BAIK DARI HARGA PASAR",KALAH_PASAR:"KALAH DARI HARGA PASAR",MENANG_BASE_RATE:"LEBIH BAIK DARI BASE RATE",MENANG_KOIN_KALAH_BASE_RATE:"LEBIH BAIK DARI KOIN, TAPI KALAH DARI BASE RATE",KALAH_KOIN:"LEBIH BURUK DARI KOIN"},vonisSub:a=>`Brier ${p(a.brier)} \u2014 lawan yang relevan bukan koin 50/50, tapi ${a.baseline_pasar!==null?"harga pasar":"tebak-base-rate-terus"} (${p(a.baseline_pasar!==null?a.baseline_pasar:a.baseline_base_rate)}).`,kartu:{brier:"Brier score",brierSub:a=>`makin kecil makin bagus \xB7 lawannya ${a.baseline_pasar!==null?"pasar":"base rate"} ${p(a.baseline_pasar!==null?a.baseline_pasar:a.baseline_base_rate)}`,bssBR:"BSS vs base rate",bssBRSub:"&gt; 0 = nambah nilai di atas tebak rata-rata",bssPasar:"BSS vs pasar",bssPasarSub:"&gt; 0 = ngalahin konsensus",bias:"Bias keyakinan",biasSub:a=>"rata-rata klaim \u2212 kenyataan \xB7 plus = kepedean"+(a.bias_bucket===null?" \xB7 per-bucket: sampel belum cukup":` \xB7 per-bucket ${a.bias_bucket>0?"+":""}${k(a.bias_bucket)}`),baseRate:"Base rate",baseRateSub:"seberapa sering hasilnya YA",poin:"poin"},kurva:"Kurva reliabilitas",sumbuX:"probabilitas yang diklaim (%)",sumbuY:"frekuensi aktual (%)",diagonal:"kalibrasi sempurna",zona:"zona terlalu pede",bawahKurva:a=>`Titik di bawah garis = ngaku lebih yakin dari kenyataan. Lingkaran putus-putus = sampel &lt; ${a}, jangan disimpulkan.`,perBucket:"Per bucket",kolom:["rentang klaim","rata-rata klaim","kenyataan","selisih","n"],judulTemuan:"Temuan",terparah:"Sepuluh meleset terparah",kolomTerparah:["keputusan","klaim","hasil","Brier"],ya:"YA",tidak:"TIDAK",caraBaca:"Cara bacanya",cara:a=>`
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
      dihitung cuma dari bucket yang sampelnya cukup.`,kaki:["Audit Kalibrasi \u2014 OCKLU","Ini cermin, bukan nasihat investasi."],temuan:{DI_ATAS_KOIN:a=>`Brier ${p(a.brier)} di atas 0.25 \u2014 rata-rata lebih buruk daripada nebak 50/50.`,KALAH_BASE_RATE:a=>`Brier ${p(a.brier)} kalah dari tebak-base-rate-terus (${p(a.baseline)}). Modelnya belum nambah apa-apa di atas "tebak angka rata-rata".`,KALAH_PASAR:a=>`Brier ${p(a.brier)} kalah dari harga pasar (${p(a.baseline)}). Ikut pasar aja hasilnya lebih baik.`,BIAS_TAK_MERATA:a=>`Bias total ${k(a.total)} poin tapi bias per-bucket ${k(a.bucket)} poin \u2014 miringnya gak merata, numpuk di rentang keyakinan tertentu.`,KEPEDEAN:a=>`Rata-rata ngaku ${k(a.poin)} poin lebih yakin daripada kenyataan. Ini overconfidence sistematis, bukan apes.`,KURANG_PEDE:a=>`Rata-rata ngaku ${k(a.poin)} poin KURANG yakin daripada kenyataan. Underconfident \u2014 peluang ketinggalan.`,BUCKET_TIPIS:a=>`${a.tipis} dari ${a.total} bucket punya sampel < ${a.min}. Titik-titik itu gak boleh dipakai buat nyimpulin apa pun.`,DATA_SEDIKIT:a=>`Cuma ${a.n} prediksi. Di bawah ${a.min}, seluruh laporan ini indikasi arah, bukan kesimpulan.`,EKSTREM_MELESET:a=>`${a.salah} dari ${a.total} prediksi "hampir pasti" (\u226595% atau \u22645%) meleset. Klaim ekstrem yang meleset itu yang paling mahal di Brier.`,BERSIH:()=>"Gak ada masalah kalibrasi yang menonjol. Klaim dan kenyataan nempel."},kolomHilang:(a,n)=>`Kolom gak ketemu. Butuh kolom probabilitas (${a}) dan kolom hasil (${n}).`,headerKebaca:a=>`  Header yang kebaca: ${a}`,diLuarRentang:a=>`${a} baris probabilitasnya di luar 0..1. Cek datanya.`},en:{judul:"CALIBRATION AUDIT",prediksi:a=>`${a} forecasts`,vonis:{MENANG_PASAR:"BEATS THE MARKET PRICE",KALAH_PASAR:"LOSES TO THE MARKET PRICE",MENANG_BASE_RATE:"BEATS THE BASE RATE",MENANG_KOIN_KALAH_BASE_RATE:"BEATS A COIN FLIP, LOSES TO THE BASE RATE",KALAH_KOIN:"WORSE THAN A COIN FLIP"},vonisSub:a=>`Brier ${p(a.brier)} \u2014 the opponent that matters is not a 50/50 coin, it is ${a.baseline_pasar!==null?"the market price":"always guessing the base rate"} (${p(a.baseline_pasar!==null?a.baseline_pasar:a.baseline_base_rate)}).`,kartu:{brier:"Brier score",brierSub:a=>`lower is better \xB7 measured against ${a.baseline_pasar!==null?"market":"base rate"} ${p(a.baseline_pasar!==null?a.baseline_pasar:a.baseline_base_rate)}`,bssBR:"BSS vs base rate",bssBRSub:"&gt; 0 = adds value over guessing the average",bssPasar:"BSS vs market",bssPasarSub:"&gt; 0 = beats the consensus",bias:"Confidence bias",biasSub:a=>"mean claim \u2212 reality \xB7 positive = overconfident"+(a.bias_bucket===null?" \xB7 per bucket: not enough samples yet":` \xB7 per bucket ${a.bias_bucket>0?"+":""}${k(a.bias_bucket)}`),baseRate:"Base rate",baseRateSub:"how often the outcome was YES",poin:"points"},kurva:"Reliability curve",sumbuX:"claimed probability (%)",sumbuY:"actual frequency (%)",diagonal:"perfect calibration",zona:"overconfidence zone",bawahKurva:a=>`Points below the line = claimed more certainty than reality delivered. Dashed circles = fewer than ${a} samples, do not draw conclusions.`,perBucket:"By bucket",kolom:["claim range","mean claim","reality","gap","n"],judulTemuan:"Findings",terparah:"Ten worst misses",kolomTerparah:["decision","claim","outcome","Brier"],ya:"YES",tidak:"NO",caraBaca:"How to read this",cara:a=>`
      <b>Brier score</b> = mean of <code>(claim \u2212 outcome)\xB2</code>. Zero is perfect;
      0.25 is exactly what you get by saying 50/50 every time.<br><br>
      <b>This measures calibration, not being right.</b> Someone who says 90% and is right
      9 times out of 10 beats someone who says 99% and is right 9 times out of 10. The second
      one is overconfident, and Brier punishes that.<br><br>
      <b>The 0.25 baseline is a trap.</b> When the event is rare (base rate 10%), a model that
      always answers "no" already scores 0.09 \u2014 far below 0.25, with no skill at all. That is
      why this report measures against the <b>base rate</b>${a.baseline_pasar!==null?" and the <b>market price</b>":""},
      not against a coin.<br><br>
      <b>Buckets with n &lt; ${a.min_sampel} are not used for conclusions.</b> A point holding only
      8 forecasts can look dramatic while being pure noise. The confidence-bias figure above is
      computed only from buckets with enough samples.`,kaki:["Calibration Audit \u2014 OCKLU","This is a mirror, not investment advice."],temuan:{DI_ATAS_KOIN:a=>`Brier ${p(a.brier)} is above 0.25 \u2014 on average worse than guessing 50/50.`,KALAH_BASE_RATE:a=>`Brier ${p(a.brier)} loses to always guessing the base rate (${p(a.baseline)}). The model adds nothing over "guess the average".`,KALAH_PASAR:a=>`Brier ${p(a.brier)} loses to the market price (${p(a.baseline)}). Simply following the market would have scored better.`,BIAS_TAK_MERATA:a=>`Overall bias ${k(a.total)} points but per-bucket bias ${k(a.bucket)} points \u2014 the skew is uneven, concentrated in certain confidence ranges.`,KEPEDEAN:a=>`On average claims ${k(a.poin)} points more certainty than reality delivered. That is systematic overconfidence, not bad luck.`,KURANG_PEDE:a=>`On average claims ${k(a.poin)} points LESS certainty than reality delivered. Underconfident \u2014 opportunities left on the table.`,BUCKET_TIPIS:a=>`${a.tipis} of ${a.total} buckets hold fewer than ${a.min} samples. Those points cannot support any conclusion.`,DATA_SEDIKIT:a=>`Only ${a.n} forecasts. Below ${a.min}, this whole report indicates direction, not conclusions.`,EKSTREM_MELESET:a=>`${a.salah} of ${a.total} "near certain" forecasts (\u226595% or \u22645%) missed. Extreme claims that miss are the most expensive thing in a Brier score.`,BERSIH:()=>"No calibration problem stands out. Claims and reality track each other."},kolomHilang:(a,n)=>`Columns not found. Need a probability column (${a}) and an outcome column (${n}).`,headerKebaca:a=>`  Headers detected: ${a}`,diLuarRentang:a=>`${a} rows have probabilities outside 0..1. Check the data.`}},M=a=>L[a]||L.id;function aa(a,n="id"){let t=M(n),i=a.split(/\r?\n/).filter(l=>l.trim()),u=l=>{let e=[],d="",f=!1;for(let $ of l)$==='"'?f=!f:($===","||$===";"||$==="	")&&!f?(e.push(d),d=""):d+=$;return e.push(d),e.map($=>$.trim())},o=u(i[0]).map(l=>l.toLowerCase().replace(/^﻿/,"")),b=l=>o.findIndex(e=>R[l].includes(e)),r=b("p"),s=b("hasil"),x=b("pasar"),h=b("nama");if(r<0||s<0)throw new Error(t.kolomHilang(R.p.slice(0,4).join("/"),R.hasil.slice(0,4).join("/"))+`
`+t.headerKebaca(o.join(", ")));let m=[],y=[];for(let l=1;l<i.length;l++){let e=u(i[l]),d=Number(e[r]),f=Number(e[s]);if(!Number.isFinite(d)||!(f===0||f===1)){y.push(l+1);continue}m.push({p:d,hasil:f,pasar:x>=0?Number(e[x]):NaN,nama:h>=0?e[h]:`#${l+1}`})}if(Math.max(...m.map(l=>l.p))>1)for(let l of m)l.p=l.p/100,Number.isFinite(l.pasar)&&(l.pasar=l.pasar/100);let A=m.filter(l=>l.p<0||l.p>1);if(A.length)throw new Error(t.diLuarRentang(A.length));return{data:m,buang:y}}function ea(a,n){let t=M(n.bahasa),i=520,u=460,o=58,b=18,r=e=>o+e/100*(i-o-b),s=e=>u-o-e/100*(u-o-b),x=a.bucket,h=x.map(e=>`${r(e.klaim)},${s(e.aktual)}`).join(" "),m=e=>e==null?"\u2014":`${(e*100).toFixed(1)}%`,y=(e,d=4)=>e==null?"\u2014":Number(e).toFixed(d),g=a.vonis.startsWith("MENANG")?"#4ADE80":a.vonis==="MENANG_KOIN_KALAH_BASE_RATE"?"#F5A524":"#FF5A5A",A=(e,d,f,$)=>`
    <div class="kartu">
      <div class="k">${e}</div>
      <div class="v" style="color:${f}">${d}</div>
      ${$?`<div class="s">${$}</div>`:""}
    </div>`,l=a.baseline_pasar!==null?a.baseline_pasar:a.baseline_base_rate;return`<!doctype html>
<html lang="${n.bahasa==="en"?"en":"id"}"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${t.judul} \u2014 ${n.nama}</title>
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
  <h1>${t.judul}</h1>
  <div class="sub">${n.nama} \xB7 ${t.prediksi(a.n)} \xB7 ${n.tanggal}</div>

  <div class="vonis">
    <div class="t">${t.vonis[a.vonis]||a.vonis}</div>
    <div style="color:var(--muted);font-size:13px;margin-top:6px">${t.vonisSub(a)}</div>
  </div>

  <div class="grid">
    ${A(t.kartu.brier,y(a.brier),a.brier<=l?"var(--green)":"var(--red)",t.kartu.brierSub(a))}
    ${A(t.kartu.bssBR,y(a.bss_base_rate,3),(a.bss_base_rate??-1)>0?"var(--green)":"var(--red)",t.kartu.bssBRSub)}
    ${a.baseline_pasar!==null?A(t.kartu.bssPasar,y(a.bss_pasar,3),(a.bss_pasar??-1)>0?"var(--green)":"var(--red)",t.kartu.bssPasarSub):""}
    ${A(t.kartu.bias,`${a.bias_total>0?"+":""}${k(a.bias_total)} ${t.kartu.poin}`,Math.abs(a.bias_total)>5?"var(--red)":"var(--green)",t.kartu.biasSub(a))}
    ${A(t.kartu.baseRate,m(a.base_rate),"var(--muted)",t.kartu.baseRateSub)}
  </div>

  <h2>${t.kurva}</h2>
  <svg viewBox="0 0 ${i} ${u}" style="width:100%;max-width:${i}px;display:block;margin:0 auto">
    <polygon points="${r(0)},${s(0)} ${r(100)},${s(0)} ${r(100)},${s(100)}" fill="rgba(255,90,90,.05)"/>
    <text x="${r(74)}" y="${s(20)}" fill="rgba(255,90,90,.55)" font-size="10" font-family="ui-monospace" text-anchor="middle">${t.zona}</text>
    ${[0,25,50,75,100].map(e=>`
      <line x1="${r(e)}" y1="${s(0)}" x2="${r(e)}" y2="${s(100)}" stroke="rgba(120,150,200,.08)"/>
      <line x1="${r(0)}" y1="${s(e)}" x2="${r(100)}" y2="${s(e)}" stroke="rgba(120,150,200,.08)"/>
      <text x="${r(e)}" y="${s(0)+16}" fill="#5B6B85" font-size="9" font-family="ui-monospace" text-anchor="middle">${e}</text>
      <text x="${r(0)-9}" y="${s(e)+3}" fill="#5B6B85" font-size="9" font-family="ui-monospace" text-anchor="end">${e}</text>`).join("")}
    <line x1="${r(0)}" y1="${s(0)}" x2="${r(100)}" y2="${s(100)}" stroke="#5B6B85" stroke-dasharray="4 4"/>
    <text x="${r(26)}" y="${s(34)}" fill="#5B6B85" font-size="9" font-family="ui-monospace"
          transform="rotate(-38 ${r(26)} ${s(34)})">${t.diagonal}</text>
    <polyline points="${h}" fill="none" stroke="#E8C87A" stroke-width="1.8"/>
    ${x.map(e=>`
      ${e.cukup?"":`<circle cx="${r(e.klaim)}" cy="${s(e.aktual)}" r="11" fill="none" stroke="#FF5A5A" stroke-dasharray="2 3"/>
      <text x="${r(e.klaim)}" y="${s(e.aktual)-16}" fill="#FF5A5A" font-size="8.5" font-family="ui-monospace" text-anchor="middle">n=${e.n}</text>`}
      <circle cx="${r(e.klaim)}" cy="${s(e.aktual)}" r="${3+Math.sqrt(e.n)/3}"
              fill="${e.klaim-e.aktual>5?"#FF5A5A":"#E8C87A"}" opacity=".9"/>`).join("")}
    <text x="${i/2}" y="${u-10}" fill="#9FB0C8" font-size="10" font-family="ui-monospace" text-anchor="middle">${t.sumbuX}</text>
    <text x="14" y="${u/2}" fill="#9FB0C8" font-size="10" font-family="ui-monospace" text-anchor="middle" transform="rotate(-90 14 ${u/2})">${t.sumbuY}</text>
  </svg>
  <div style="text-align:center;color:var(--dim);font-size:11px;margin-top:6px">${t.bawahKurva(a.min_sampel)}</div>

  <h2>${t.perBucket}</h2>
  <table>
    <tr>${t.kolom.map(e=>`<th>${e}</th>`).join("")}</tr>
    ${x.map(e=>`<tr class="${e.cukup?"":"tipis"}">
      <td>${e.rentang}</td><td>${k(e.klaim)}%</td><td>${k(e.aktual)}%</td>
      <td>${e.klaim-e.aktual>0?"+":""}${k(e.klaim-e.aktual)}</td>
      <td>${e.n}${e.cukup?"":" \u26A0"}</td></tr>`).join("")}
  </table>

  <h2>${t.judulTemuan}</h2>
  <ul class="temuan">
    ${a.temuan.map(e=>`<li class="${e.berat}">${(t.temuan[e.kode]||(()=>e.kode))(e.nilai)}</li>`).join("")}
  </ul>

  ${n.terparah&&n.terparah.length?`<h2>${t.terparah}</h2>
  <table>
    <tr>${t.kolomTerparah.map(e=>`<th>${e}</th>`).join("")}</tr>
    ${n.terparah.map(e=>`<tr><td>${e.nama}</td><td>${(e.p*100).toFixed(0)}%</td>
      <td>${e.hasil?t.ya:t.tidak}</td><td class="tipis">${p(e.brier)}</td></tr>`).join("")}
  </table>`:""}

  <h2>${t.caraBaca}</h2>
  <div class="cara">${t.cara(a)}</div>

  <footer>
    <span>${t.kaki[0]}</span>
    <span>${t.kaki[1]}</span>
    <span style="margin-left:auto">Paid in Full \u2014 Jesus is God \u271D\uFE0F</span>
  </footer>
</div></body></html>`}C.exports={baca:aa,html:ea,ALIAS:R,TEKS:L,pilihTeks:M}});var sa=I(()=>{var z=N(),{baca:ta,html:na,pilihTeks:ia}=G(),w=document.documentElement.lang==="en"?"en":"id",U=ia(w),E=w==="en",v=a=>document.querySelector(a),B=v("#zona"),H=v("#berkas"),P=v("#hasil"),D=v("#bingkai"),F=v("#galat"),ra=v("#ringkas"),Y=v("#nama"),S=null;function K(a){F.textContent=a,F.hidden=!1,P.hidden=!0}function q(a,n){F.hidden=!0;let t;try{t=ta(a,w)}catch(r){return K(r.message)}if(!t.data.length)return K(E?"No usable rows were read from that file.":"Gak ada baris yang kebaca dari file itu.");let i=z.audit(t.data),u=t.data.map(r=>({...r,brier:z.brier(r.p,r.hasil)})).sort((r,s)=>s.brier-r.brier).slice(0,10),o={nama:(Y.value||"").trim()||n.replace(/\.[^.]+$/,""),tanggal:new Date().toLocaleDateString(E?"en-GB":"id-ID",{day:"numeric",month:"long",year:"numeric"}),bahasa:w,terparah:u};S={dok:na(i,o),nama:o.nama},D.srcdoc=S.dok;let b=i.vonis.startsWith("MENANG")?"var(--green)":i.vonis==="MENANG_KOIN_KALAH_BASE_RATE"?"var(--amber)":"var(--red)";ra.innerHTML=`<b style="color:${b}">${U.vonis[i.vonis]||i.vonis}</b> \xB7 ${U.prediksi(i.n)} \xB7 Brier ${i.brier.toFixed(4)}`+(t.buang.length?` \xB7 <span style="color:var(--amber)">${t.buang.length} ${E?"rows skipped (unreadable format)":"baris dilewat (formatnya gak kebaca)"}</span>`:""),P.hidden=!1,P.scrollIntoView({behavior:"smooth",block:"start"})}function W(a){if(!a)return;let n=new FileReader;n.onload=()=>q(String(n.result),a.name),n.onerror=()=>K(E?"The file could not be read.":"File-nya gagal dibaca."),n.readAsText(a)}["dragenter","dragover"].forEach(a=>B.addEventListener(a,n=>{n.preventDefault(),B.classList.add("aktif")}));["dragleave","drop"].forEach(a=>B.addEventListener(a,n=>{n.preventDefault(),B.classList.remove("aktif")}));B.addEventListener("drop",a=>W(a.dataTransfer.files[0]));B.addEventListener("click",()=>H.click());H.addEventListener("change",()=>W(H.files[0]));v("#unduh").addEventListener("click",()=>{if(!S)return;let a=new Blob([S.dok],{type:"text/html"}),n=document.createElement("a");n.href=URL.createObjectURL(a),n.download=`${E?"calibration-audit":"audit-kalibrasi"}-${S.nama.replace(/[^\w-]+/g,"-").toLowerCase()}.html`,n.click(),URL.revokeObjectURL(n.href)});v("#cetak").addEventListener("click",()=>{D.contentWindow&&D.contentWindow.print()});v("#contoh").addEventListener("click",async a=>{a.preventDefault(),a.stopPropagation();try{let n=document.body.dataset.contoh||"contoh.csv",t=await fetch(n).then(i=>{if(!i.ok)throw new Error(`${E?"sample data not found":"data contoh gak ketemu"} (HTTP ${i.status})`);return i.text()});Y.value=E?"Sample":"Contoh",q(t,"contoh.csv")}catch(n){K((E?"Sample data could not be read: ":"Data contohnya gak kebaca: ")+n.message)}})});export default sa();
