/* Jalan SESUDAH app.js (versi ocklu.com).
   - ganti bahasa id <-> lainnya = muat ulang, karena isi data ditukar di pra.js sebelum app jalan
   - tombol ⭐: early access gratis, nanti $5/bulan + daftar email (Supabase herbal_antre, insert-only) */
(function(){
  var SB='https://njghzieuuopukuagrswu.supabase.co/rest/v1/herbal_antre';
  var KUNCI='sb_publishable_Flgot78lOen26q5dQDV8JA_4MV_0FSn';
  var TX={
    id:{judul:'Early access',gratis:'Gratis sekarang',nanti:'Nanti $5 / bulan',isi:'Semua fitur terbuka selama masa early access. Saat berbayar dimulai, fitur keselamatan (cek campuran berbahaya, pantangan hamil/anak, tabrakan obat) tetap gratis selamanya.',
        dapat:['Racikan tersimpan tanpa batas','Arsip ramuan harian','Unduh & cetak tanpa batas','Peta lengkap + daftar negara','Fitur baru duluan'],
        email:'Email kamu',daftar:'Kabari saya',ok:'Terima kasih. Kamu akan dikabari sebelum harga berlaku.',salah:'Alamat email belum benar.',gagal:'Belum terkirim. Coba lagi sebentar.',privasi:'Email hanya dipakai untuk kabar Ocklu Herbal. Tidak dijual.'},
    en:{judul:'Early access',gratis:'Free right now',nanti:'Later $5 / month',isi:'Every feature is open during early access. When paid plans start, safety features (dangerous-mix check, pregnancy/child warnings, drug interactions) stay free forever.',
        dapat:['Unlimited saved formulas','Daily remedy archive','Unlimited export & print','Full map + country lists','New features first'],
        email:'Your email',daftar:'Notify me',ok:'Thank you. You will hear from us before pricing starts.',salah:'That email address doesn’t look right.',gagal:'Not sent yet. Please try again shortly.',privasi:'Your email is only used for Ocklu Herbal news. Never sold.'}
  };
  var bhs=function(){try{return localStorage.getItem('oh_bhs')||'en'}catch(e){return 'en'}};
  var x=function(){return TX[bhs()==='id'?'id':'en']};
  var el=document.getElementById('bhs');
  if(el)el.addEventListener('change',function(){
    var baru=el.value,awal=window.HERBAL_BHS_AWAL||'id';
    if((baru==='id')!==(awal==='id'))setTimeout(function(){location.reload()},30);
  });
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function buka(){
    var t=x();
    document.getElementById('lembarIsi').innerHTML=
      '<div class="tutup"><button type="button" class="btn" onclick="tutup()">✕</button><b>⭐ '+esc(t.judul)+'</b><span></span></div>'+
      '<section class="blok" style="border:0"><div class="kotak baik"><b>✓ '+esc(t.gratis)+'</b><div class="mini">'+esc(t.nanti)+'</div></div>'+
      '<div class="kotak"><div class="mini" style="margin-bottom:8px">'+esc(t.isi)+'</div><ul class="daftar">'+t.dapat.map(function(d){return '<li>'+esc(d)+'</li>'}).join('')+'</ul></div>'+
      '<form class="kotak" id="formAntre" style="display:flex;gap:8px;flex-wrap:wrap"><input class="t" id="emailAntre" type="email" required autocomplete="email" placeholder="'+esc(t.email)+'" style="flex:1;min-width:180px">'+
      '<button class="btn utama" type="submit">'+esc(t.daftar)+'</button><div class="mini" id="hasilAntre" style="width:100%">'+esc(t.privasi)+'</div></form></section>';
    document.getElementById('formAntre').onsubmit=function(e){
      e.preventDefault();var em=(document.getElementById('emailAntre').value||'').trim(),h=document.getElementById('hasilAntre');
      if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){h.textContent=t.salah;return}
      fetch(SB,{method:'POST',headers:{'apikey':KUNCI,'Authorization':'Bearer '+KUNCI,'Content-Type':'application/json','Prefer':'return=minimal'},
        body:JSON.stringify({email:em,bahasa:bhs()})})
      .then(function(r){h.textContent=(r.ok||r.status===409)?'✓ '+t.ok:t.gagal})
      .catch(function(){h.textContent=t.gagal});
    };
    var l=document.getElementById('lembar');l.classList.add('buka');l.scrollTop=0;document.body.style.overflow='hidden';
  }
  var b=document.getElementById('btnPremium');if(b)b.onclick=buka;
  window.bukaPremium=buka;
})();
