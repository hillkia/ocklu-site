/* Ludlud Kota 3D — jalan kota mainan (gaya video Seedance + kartu UGC beranda ocklu.com), mesin three.js yang sama dengan dasbor Anak Gusti.
 * Pakai: window.LudludKota3D.render(el, data) — data sama dengan ludlud-kota.js (SVG), yang tetap dipakai sebagai cadangan kalau WebGL tidak ada.
 * data = { kavling:[{no:1..12, rumah:{jenis,nama,warna?,keadaan:'buka'|'dibangun'|'usul',inti?,jumlah?,sibuk?,antre?,oleh?,alasan?}}],
 *          agen:[{nama,peran,warna}], kegiatan:[{agen,dari,ke,label}], tema?, onLahan(no), onRumah(no), onAgen(nama) }
 * Kavling 1-6 di sisi utara jalan, 7-12 di sisi selatan. Geser (seret) untuk jalan-jalan, ketuk rumah/lahan/agen.
 */
import * as THREE from './three.module.min.js';

const GAYA = {
  studio:   { dinding: '#ffd166', atap: '#ef476f', ikon: '🎬', label: 'Studio' },
  mesin:    { dinding: '#a8b3c7', atap: '#4a5568', ikon: '⚙️', label: 'Mesin' },
  youtube:  { dinding: '#ff6b6b', atap: '#c1121f', ikon: '▶️', label: 'YouTube' },
  instagram:{ dinding: '#f7a1c4', atap: '#8e44ad', ikon: '📸', label: 'Instagram' },
  tiktok:   { dinding: '#4a4a5a', atap: '#25f4ee', ikon: '🎵', label: 'TikTok' },
  facebook: { dinding: '#8fb8ff', atap: '#1877f2', ikon: '👍', label: 'Facebook' },
  threads:  { dinding: '#e5e5e5', atap: '#222222', ikon: '🧵', label: 'Threads' },
  x:        { dinding: '#cfd4da', atap: '#111111', ikon: '✖️', label: 'X' },
  shopee:   { dinding: '#ffb38a', atap: '#ee4d2d', ikon: '🛍️', label: 'Shopee' },
  tokopedia:{ dinding: '#9be29b', atap: '#03ac0e', ikon: '🦉', label: 'Tokopedia' },
  lazada:   { dinding: '#b7b9f5', atap: '#0f146d', ikon: '💙', label: 'Lazada' },
  linkedin: { dinding: '#9cc7ef', atap: '#0a66c2', ikon: '💼', label: 'LinkedIn' },
  pinterest:{ dinding: '#ffadb5', atap: '#e60023', ikon: '📌', label: 'Pinterest' },
  gudang:   { dinding: '#d9a066', atap: '#8b5a2b', ikon: '📦', label: 'Gudang' },
  kantor:   { dinding: '#b8e0d2', atap: '#2a9d8f', ikon: '📊', label: 'Kantor' },
  toko:     { dinding: '#ffe5a0', atap: '#f4a261', ikon: '🏪', label: 'Toko' },
  lain:     { dinding: '#e2d4f0', atap: '#7b5ea7', ikon: '🏠', label: 'Rumah' }
};
const JARAK = 7, SISI = 6.2;            // jarak antar kavling, jarak rumah dari tengah jalan
const posKav = (no) => ({ x: (((no - 1) % 6) - 2.5) * JARAK, z: no <= 6 ? -SISI : SISI, hadap: no <= 6 ? 1 : -1 });
// semua rumah menghadap kamera; pintu masuk agen di sisi yang menghadap jalan
const pintu = (no) => { const p = posKav(no); return new THREE.Vector3(p.x - 0.3, 0, p.z + p.hadap * 2.4); };
const GERAK = !matchMedia('(prefers-reduced-motion: reduce)').matches;

function kanvasTeks(lebar, tinggi, gambar) {
  const c = document.createElement('canvas'); c.width = lebar; c.height = tinggi;
  gambar(c.getContext('2d'), lebar, tinggi);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
function bulat(g, x, y, w, h, r) { g.beginPath(); g.roundRect ? g.roundRect(x, y, w, h, r) : g.rect(x, y, w, h); }
const FONT = 'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';

// papan nama di atas pintu
function papan(teks, ikon, warna) {
  const tx = kanvasTeks(512, 128, (g, w, h) => {
    bulat(g, 4, 4, w - 8, h - 8, 36); g.fillStyle = '#fffdf6'; g.fill(); g.lineWidth = 8; g.strokeStyle = warna; g.stroke();
    g.font = `900 64px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#1d2433';
    g.fillText((ikon ? ikon + ' ' : '') + teks, w / 2, h / 2 + 4, w - 40);
  });
  return new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.9), new THREE.MeshBasicMaterial({ map: tx, transparent: true }));
}
// kartu gaya UGC (seperti beranda ocklu.com): REC, ikon besar, angka asli Ludlud, @ocklu
function kartuUGC(r) {
  const j = r.jumlah || {}, gy = GAYA[r.jenis] || GAYA.lain;
  const tx = kanvasTeks(360, 640, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, r.warna || gy.atap); gr.addColorStop(1, '#14161b');
    bulat(g, 0, 0, w, h, 40); g.fillStyle = gr; g.fill();
    g.fillStyle = '#ff3b30'; g.beginPath(); g.arc(40, 44, 12, 0, 7); g.fill();
    g.font = `800 28px ${FONT}`; g.fillStyle = '#fff'; g.textBaseline = 'middle'; g.fillText('REC', 62, 45);
    g.textAlign = 'center'; g.font = `160px ${FONT}`; g.fillText(gy.ikon, w / 2, 250);
    g.font = `900 46px ${FONT}`; g.fillText(r.nama || gy.label, w / 2, 400, w - 40);
    g.font = `700 32px ${FONT}`; g.textAlign = 'left';
    const baris = r.keadaan === 'buka'
      ? [['✅', (j.tayang || 0) + ' tayang'], ['⏳', (j.siap_cek || 0) + ' siap dicek'], ['📅', (j.disetujui || 0) + ' terjadwal']]
      : r.jenis === 'studio' ? [['🎞️', (r.antre || 0) + ' antre'], ['⚡', r.sibuk ? 'lagi bikin' : 'santai']]
      : [['🔌', 'belum disambung']];
    if (r.jenis === 'studio' || r.jenis === 'mesin') baris.splice(0, 9, ['🎞️', (r.antre || 0) + ' antre'], ['⚡', r.sibuk ? 'lagi kerja' : 'santai']);
    baris.forEach((b, i) => g.fillText(b[0] + ' ' + b[1], 34, 470 + i * 46));
    g.font = `600 28px ${FONT}`; g.fillStyle = 'rgba(255,255,255,.75)'; g.fillText('@ocklu', 34, 610);
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.85), new THREE.MeshBasicMaterial({ map: tx, transparent: true }));
  return m;
}
function papanTanda(baris, warna) {
  const tx = kanvasTeks(512, 256, (g, w, h) => {
    bulat(g, 4, 4, w - 8, h - 8, 30); g.fillStyle = warna; g.fill(); g.lineWidth = 8; g.strokeStyle = '#fff'; g.stroke();
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#1d2433';
    g.font = `900 60px ${FONT}`; g.fillText(baris[0], w / 2, baris[1] ? h * 0.36 : h / 2, w - 40);
    if (baris[1]) { g.font = `700 40px ${FONT}`; g.fillText(baris[1], w / 2, h * 0.7, w - 40); }
  });
  const grp = new THREE.Group();
  const m = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.2), new THREE.MeshBasicMaterial({ map: tx, transparent: true }));
  m.position.y = 1.7; grp.add(m);
  [-0.9, 0.9].forEach((x) => { const t = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.2), new THREE.MeshStandardMaterial({ color: '#8b5a2b' })); t.position.set(x, 0.6, -0.02); grp.add(t); });
  return grp;
}
function label(teks, warna) {
  const tx = kanvasTeks(256, 64, (g, w, h) => {
    bulat(g, 2, 2, w - 4, h - 4, 30); g.fillStyle = warna; g.fill(); g.font = `900 34px ${FONT}`; g.fillStyle = '#fff';
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(teks, w / 2, h / 2 + 2, w - 20);
  });
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, depthTest: false })); s.scale.set(1.6, 0.4, 1); s.renderOrder = 9; return s;
}

const kotak = (w, h, d, warna, opsi = {}) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color: warna, roughness: 0.75, ...opsi }));
  m.castShadow = m.receiveShadow = true; return m;
};

function rumah(no, r, malam) {
  const p = posKav(no), gy = GAYA[r.jenis] || GAYA.lain, grp = new THREE.Group();
  grp.position.set(p.x, 0, p.z); 
  const tanah = kotak(6.2, 0.12, 4.6, r.keadaan === 'usul' ? '#c9e8a6' : '#8fd18f'); tanah.position.y = 0.06; grp.add(tanah);
  if (r.keadaan === 'usul') {
    const t = papanTanda(['Usulan: ' + (r.nama || gy.label), 'oleh ' + (r.oleh || 'agen') + ' · ketuk'], '#ffe08a'); grp.add(t);
  } else if (r.keadaan === 'dibangun' && !(r.jenis === 'studio' || r.jenis === 'mesin')) {
    const fondasi = kotak(3.6, 0.4, 3, '#d8d2c4'); fondasi.position.set(-0.3, 0.3, 0); grp.add(fondasi);
    const dinding = kotak(3.6, 1.2, 3, gy.dinding); dinding.position.set(-0.3, 1.1, 0); grp.add(dinding);
    const rangka = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(4, 3.4, 3.4)), new THREE.LineBasicMaterial({ color: '#e0a100' }));
    rangka.position.set(-0.3, 1.8, 0); grp.add(rangka);
    const tiang = kotak(0.2, 5, 0.2, '#f4b400'); tiang.position.set(2.1, 2.5, -1.4); grp.add(tiang);
    const lengan = kotak(3.2, 0.18, 0.18, '#f4b400'); lengan.position.set(0.8, 4.9, -1.4); grp.add(lengan);
    const t = papan('Lagi dibangun: ' + (r.nama || gy.label), '🏗️', '#f4b400'); t.position.set(-0.3, 2.9, 1.75); grp.add(t);
    grp.userData.derek = lengan;
  } else {
    const tinggi = r.jenis === 'kantor' ? 3.6 : r.jenis === 'mesin' || r.jenis === 'gudang' ? 2.4 : 2.8;
    const badan = kotak(3.6, tinggi, 3, gy.dinding); badan.position.set(-0.3, tinggi / 2 + 0.12, 0); grp.add(badan);
    const atap = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 2.75, 1.5, 4, 1), new THREE.MeshStandardMaterial({ color: gy.atap, roughness: 0.6, flatShading: true }));
    atap.rotation.y = Math.PI / 4; atap.scale.set(1.05, 1, 0.85); atap.position.set(-0.3, tinggi + 0.12 + 0.75, 0); atap.castShadow = true; grp.add(atap);
    const pintuM = kotak(0.8, 1.4, 0.08, '#5b3a29'); pintuM.position.set(-0.3, 0.82, 1.52); grp.add(pintuM);
    const kaca = new THREE.MeshStandardMaterial({ color: malam ? '#ffe9a3' : '#bfe6ff', emissive: malam ? '#ffcf4d' : '#000', emissiveIntensity: malam ? 0.9 : 0 });
    [-1.35, 0.75].forEach((x) => { const w = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.7, 0.06), kaca); w.position.set(x, tinggi * 0.42 + 0.2, 1.53); grp.add(w); });
    const n = papan(r.nama || gy.label, gy.ikon, gy.atap); n.position.set(-0.3, tinggi - 0.3, 1.62); grp.add(n);
    if (r.jenis === 'mesin' || r.jenis === 'studio') {
      const cerobong = kotak(0.45, 1.4, 0.45, '#6b7280'); cerobong.position.set(0.8, tinggi + 0.9, -0.6); grp.add(cerobong);
      if (r.sibuk) grp.userData.asap = cerobong;
    }
    const j = r.jumlah || {};
    if (j.siap_cek) { const b = label('⏳ ' + j.siap_cek + ' siap dicek', '#e63946'); b.position.set(-0.3, tinggi + 2.1, 0.5); grp.add(b); }
  }
  // kartu UGC berdiri di samping rumah, menghadap jalan
  if (r.keadaan !== 'usul') {
    const k = kartuUGC(r); k.position.set(2.45, 1.6, 1.3); k.rotation.y = -0.25; grp.add(k);
    const kaki = kotak(0.08, 0.35, 0.08, '#444'); kaki.position.set(2.35, 0.18, 1.2); grp.add(kaki);
  }
  grp.traverse((o) => { o.userData.no = no; });
  return grp;
}

function lahan(no) {
  const p = posKav(no), grp = new THREE.Group(); grp.position.set(p.x, 0, p.z); 
  const t = kotak(6.2, 0.1, 4.6, '#a7d98a'); t.position.y = 0.05; grp.add(t);
  [[-2.9, -2.1], [2.9, -2.1], [-2.9, 2.1], [2.9, 2.1]].forEach(([x, z]) => { const a = kotak(0.12, 0.5, 0.12, '#c0392b'); a.position.set(x, 0.3, z); grp.add(a); });
  const s = papanTanda(['＋ Lahan kosong', 'ketuk untuk bangun'], '#fff6d6'); s.scale.setScalar(1.05); s.position.z = 1; grp.add(s);
  grp.traverse((o) => { o.userData.no = no; o.userData.kosong = true; });
  return grp;
}

function orang(warna, nama) {
  const g = new THREE.Group();
  const badan = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.5, 4, 10), new THREE.MeshStandardMaterial({ color: warna, roughness: 0.6 }));
  badan.position.y = 0.6; badan.castShadow = true; g.add(badan);
  const kepala = new THREE.Mesh(new THREE.SphereGeometry(0.27, 16, 12), new THREE.MeshStandardMaterial({ color: '#f1c27d', roughness: 0.7 }));
  kepala.position.y = 1.22; kepala.castShadow = true; g.add(kepala);
  const topi = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.12, 16), new THREE.MeshStandardMaterial({ color: warna }));
  topi.position.y = 1.44; g.add(topi);
  g.traverse((o) => { o.userData.agen = nama; });
  return g;
}

function buatDunia(el) {
  const kanvas = document.createElement('canvas');
  kanvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:pan-y;cursor:grab;border-radius:14px';
  kanvas.setAttribute('role', 'img');
  const bungkus = document.createElement('div');
  bungkus.style.cssText = 'position:relative;width:100%;height:' + (innerWidth < 640 ? 380 : 460) + 'px';
  const petunjuk = document.createElement('div');
  petunjuk.textContent = '👆 geser untuk jalan-jalan · ketuk rumah atau lahan';
  petunjuk.style.cssText = 'position:absolute;left:10px;bottom:8px;font:600 11px ' + FONT + ';color:#fff;background:rgba(0,0,0,.45);padding:3px 8px;border-radius:99px;pointer-events:none';
  bungkus.append(kanvas, petunjuk); el.replaceChildren(bungkus);
  const ren = new THREE.WebGLRenderer({ canvas: kanvas, antialias: true, alpha: false });
  ren.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 640 ? 1.5 : 2));
  ren.shadowMap.enabled = true; ren.shadowMap.type = THREE.PCFSoftShadowMap; ren.outputColorSpace = THREE.SRGBColorSpace;
  const adegan = new THREE.Scene();
  const kamera = new THREE.PerspectiveCamera(38, 1, 0.1, 300);
  const hemi = new THREE.HemisphereLight('#ffffff', '#88aa77', 1.1); adegan.add(hemi);
  const mtr = new THREE.DirectionalLight('#fff4dd', 2.2); mtr.position.set(-14, 22, 12); mtr.castShadow = true;
  mtr.shadow.mapSize.set(1024, 1024); Object.assign(mtr.shadow.camera, { left: -26, right: 26, top: 16, bottom: -16, far: 80 }); adegan.add(mtr);
  // jalan, trotoar, garis putus-putus, rumput
  const dasar = new THREE.Group();
  const rumput = new THREE.Mesh(new THREE.PlaneGeometry(90, 50), new THREE.MeshStandardMaterial({ color: '#7cc576', roughness: 1 }));
  rumput.rotation.x = -Math.PI / 2; rumput.receiveShadow = true; dasar.add(rumput);
  const aspal = kotak(60, 0.04, 5, '#5c6370'); aspal.position.y = 0.02; dasar.add(aspal);
  [-1, 1].forEach((s) => { const tr = kotak(60, 0.16, 1.4, '#e9e2d0'); tr.position.set(0, 0.08, s * 3.2); dasar.add(tr); });
  for (let x = -28; x < 29; x += 3) { const g = kotak(1.4, 0.05, 0.16, '#ffffff'); g.position.set(x, 0.05, 0); dasar.add(g); }
  for (let x = -24.5; x <= 25; x += 7) [-1, 1].forEach((s) => { // pohon & lampu jalan di sela kavling
    const bt = kotak(0.25, 1, 0.25, '#8b5a2b'); bt.position.set(x - 3.5, 0.5, s * 4.3); dasar.add(bt);
    const dn = new THREE.Mesh(new THREE.IcosahedronGeometry(0.8, 0), new THREE.MeshStandardMaterial({ color: '#4caf50', flatShading: true }));
    dn.position.set(x - 3.5, 1.5, s * 4.3); dn.castShadow = true; dasar.add(dn);
  });
  adegan.add(dasar);
  const isi = new THREE.Group(); adegan.add(isi);
  const st = { ren, adegan, kamera, isi, hemi, mtr, kanvas, bungkus, camX: 0, tujuanX: 0, agen: [], data: null, jalan: true, raf: 0 };

  const ukur = () => {
    const w = bungkus.clientWidth || 360, h = bungkus.clientHeight;
    ren.setSize(w, h, false); kamera.aspect = w / h; kamera.updateProjectionMatrix();
    st.batas = Math.max(0, 21 - (2 * 33 * Math.tan(THREE.MathUtils.degToRad(19)) * kamera.aspect) / 2 + 3);
  };
  ukur(); new ResizeObserver(ukur).observe(bungkus);
  new IntersectionObserver((e) => { st.jalan = e[0].isIntersecting; if (st.jalan && !st.raf) putar(st); }).observe(bungkus);

  // seret = jalan-jalan; ketuk = pilih
  let awal = null;
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  kanvas.addEventListener('pointerdown', (e) => { awal = { x: e.clientX, y: e.clientY, cx: st.tujuanX, seret: false }; });
  kanvas.addEventListener('pointermove', (e) => {
    if (!awal) return; const dx = e.clientX - awal.x;
    if (Math.abs(dx) > 6) { awal.seret = true; kanvas.style.cursor = 'grabbing'; }
    if (awal.seret) st.tujuanX = THREE.MathUtils.clamp(awal.cx - dx * 0.06, -st.batas, st.batas);
  });
  const lepas = (e) => {
    if (!awal) return; const ketuk = !awal.seret; awal = null; kanvas.style.cursor = 'grab';
    if (!ketuk || !st.data) return;
    const b = kanvas.getBoundingClientRect(); ptr.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
    ray.setFromCamera(ptr, kamera);
    const kena = ray.intersectObjects(isi.children, true).find((h) => h.object.userData.no || h.object.userData.agen);
    if (!kena) return; const u = kena.object.userData, d = st.data;
    if (u.agen) d.onAgen && d.onAgen(u.agen); else if (u.kosong) d.onLahan && d.onLahan(u.no); else d.onRumah && d.onRumah(u.no);
  };
  kanvas.addEventListener('pointerup', lepas); kanvas.addEventListener('pointercancel', () => { awal = null; });
  return st;
}

function susun(st, data) {
  const malam = data.tema === 'gelap' || (data.tema !== 'terang' && matchMedia('(prefers-color-scheme: dark)').matches);
  st.adegan.background = new THREE.Color(malam ? '#141a3a' : '#9fd8ff');
  st.adegan.fog = new THREE.Fog(st.adegan.background, 45, 90);
  st.hemi.intensity = malam ? 0.35 : 1.1; st.mtr.intensity = malam ? 0.45 : 2.2;
  st.isi.traverse((o) => { o.geometry && o.geometry.dispose(); if (o.material) { o.material.map && o.material.map.dispose(); o.material.dispose(); } });
  st.isi.clear(); st.agen = []; st.derek = []; st.asap = [];
  const peta = {}; (data.kavling || []).forEach((k) => { if (k && k.no >= 1 && k.no <= 12) peta[k.no] = k.rumah; });
  const ada = [];
  for (let no = 1; no <= 12; no++) {
    const g = peta[no] ? rumah(no, peta[no], malam) : lahan(no); st.isi.add(g);
    if (peta[no]) ada.push(no);
    if (g.userData.derek) st.derek.push(g.userData.derek);
    if (g.userData.asap) st.asap.push(g.userData.asap);
  }
  const giat = {}; (data.kegiatan || []).forEach((k) => { if (k && k.agen && !giat[k.agen]) giat[k.agen] = k; });
  (data.agen || []).forEach((a, i) => {
    const o = orang(a.warna || '#44506a', a.nama); st.isi.add(o);
    const k = giat[a.nama], lb = label(a.nama + (k && k.label ? ' · ' + k.label : ''), a.warna || '#44506a');
    lb.position.y = 2.05; lb.scale.set(k && k.label ? 2.6 : 1.4, 0.4, 1); o.add(lb);
    const rute = k ? [k.dari, k.ke] : [ada[(i * 3) % ada.length] || 1, ada[(i * 3 + 2) % ada.length] || 6];
    st.agen.push({ o, rute: rute.map((n) => n >= 1 && n <= 12 ? n : 1), t: i * 2.7, cepat: k ? 2.2 : 1.4 });
  });
  st.data = data;
  if (!GERAK) st.agen.forEach((a) => a.o.position.copy(pintu(a.rute[0])));
  if (!st.raf) putar(st);
}

// jalan dari pintu A → ke tengah jalan → sepanjang jalan → pintu B → masuk (mengecil) → keluar → balik
function letakAgen(a, t) {
  const A = pintu(a.rute[0]), B = pintu(a.rute[1]), jalanA = new THREE.Vector3(A.x, 0, Math.sign(A.z) * 1.2), jalanB = new THREE.Vector3(B.x, 0, Math.sign(B.z) * 1.2);
  const titik = [A, jalanA, jalanB, B], panjang = [A.distanceTo(jalanA), jalanA.distanceTo(jalanB), jalanB.distanceTo(B)];
  const total = panjang.reduce((s, x) => s + x, 0) || 1, durJalan = total / a.cepat, diam = 2.5, siklus = 2 * (durJalan + diam);
  let u = t % siklus, balik = false;
  if (u > durJalan + diam) { u -= durJalan + diam; balik = true; }
  let skala = 1, pos;
  if (u >= durJalan) { pos = balik ? A : B; const d = u - durJalan; skala = d < 0.5 ? 1 - d * 2 : d > diam - 0.5 ? (d - (diam - 0.5)) * 2 : 0; }
  else {
    let s = (u / durJalan) * total; const urut = balik ? [...titik].reverse() : titik, pj = balik ? [...panjang].reverse() : panjang;
    let i = 0; while (i < 2 && s > pj[i]) { s -= pj[i]; i++; }
    pos = urut[i].clone().lerp(urut[i + 1], pj[i] ? s / pj[i] : 1);
    a.o.lookAt(urut[i + 1].x, 0, urut[i + 1].z);
  }
  a.o.position.copy(pos); a.o.position.y = skala > 0.99 ? Math.abs(Math.sin(t * 9)) * 0.08 : 0; a.o.scale.setScalar(Math.max(0.001, skala));
}

function putar(st) {
  if (!st.jalan || document.hidden) { st.raf = 0; return; }
  st.raf = requestAnimationFrame(() => putar(st));
  const t = performance.now() / 1000;
  st.camX += (st.tujuanX - st.camX) * 0.12;
  st.kamera.position.set(st.camX, 19, 27); st.kamera.lookAt(st.camX, 0, -0.5);
  if (GERAK) {
    st.agen.forEach((a) => letakAgen(a, t + a.t));
    st.derek.forEach((d, i) => { d.rotation.y = Math.sin(t * 0.6 + i) * 0.5; });
    st.asap.forEach((c) => { c.scale.y = 1 + Math.sin(t * 4) * 0.08; });
  }
  st.ren.render(st.adegan, st.kamera);
}
document.addEventListener('visibilitychange', () => { document.querySelectorAll('[data-lk3d]').forEach((el) => { const s = el.__lk3d; if (s && !document.hidden && !s.raf) putar(s); }); });

function bisaWebGL() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }

if (bisaWebGL()) {
  window.LudludKota3D = {
    render(el, data) {
      if (!el.__lk3d) { el.__lk3d = buatDunia(el); el.setAttribute('data-lk3d', ''); }
      const kunci = JSON.stringify([data.kavling, data.kegiatan, data.agen, data.tema]);
      el.__lk3d.data = data;
      if (el.__lk3d.kunci === kunci) return;
      el.__lk3d.kunci = kunci; susun(el.__lk3d, data);
      el.__lk3d.kanvas.setAttribute('aria-label', 'Kota Ludlud 3D: ' + (data.kavling || []).map((k) => 'kavling ' + k.no + ' ' + (k.rumah ? k.rumah.nama : 'kosong')).join(', '));
    }
  };
  window.dispatchEvent(new Event('ludlud-kota3d'));
}
