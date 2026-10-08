/* Jalan SEBELUM app.js (versi ocklu.com).
   1) bahasa awal ikut perangkat: Indonesia -> id, selain itu -> en
   2) kalau bukan id: isi tanaman & ramuan ditukar ke English lewat kamus TERJ_EN.
      Kalimat yang belum ada di kamus tetap teks asli (kamus terus bertambah tiap build). */
(function(){
  var L='id';
  try{
    L=localStorage.getItem('oh_bhs');
    if(!L){L=/^id\b/i.test(navigator.language||'')?'id':'en';localStorage.setItem('oh_bhs',L)}
  }catch(e){L=/^id\b/i.test(navigator.language||'')?'id':'en'}
  window.HERBAL_BHS_AWAL=L;
  if(L==='id'||!window.TERJ_EN||!window.DATA)return;
  var K=window.TERJ_EN, LW={};(window.LEWAT_TERJ||[]).forEach(function(k){LW[k]=1});
  function tukar(o){
    if(typeof o==='string'){var s=o.trim();return K[s]||o}
    if(Array.isArray(o)){for(var i=0;i<o.length;i++)o[i]=tukar(o[i]);return o}
    if(o&&typeof o==='object'){for(var k in o)if(!LW[k])o[k]=tukar(o[k]);return o}
    return o;
  }
  tukar(window.DATA.tanaman);tukar(window.DATA.ramuan);
})();
