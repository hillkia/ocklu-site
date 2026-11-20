/* Ludlud Kota 3D — kota masa depan saat senja (gaya video "2050": gedung kaca bergaris lampu, jalan layang neon,
 * mobil terbang, layar raksasa di dinding gedung). Mesin three.js yang sama dengan dasbor Anak Gusti.
 * Pakai: window.LudludKota3D.render(el, data). Kontrak data sama dengan ludlud-kota.js (SVG cadangan kalau WebGL tidak ada):
 * data = { kavling:[{no:1..12, rumah:{jenis,nama,warna?,keadaan:'buka'|'dibangun'|'usul',inti?,jumlah?,sibuk?,antre?,oleh?,alasan?}}],
 *          agen:[{nama,peran,warna}], kegiatan:[{agen,dari,ke,label}], onLahan(no), onRumah(no), onAgen(nama) }
 * Tiap kavling = satu gedung pencakar langit; layar raksasa di dindingnya = kartu UGC berisi angka asli.
 * Agen = mobil terbang yang mengantar konten antar gedung. el dibuat layar penuh oleh halaman (position:fixed).
 * Kavling 1-6 baris belakang (gedung tinggi), 7-12 baris depan. Seret kiri-kanan untuk jalan-jalan, ketuk gedung/lahan/agen.
 */
import * as THREE from './three.module.min.js';

const GAYA = {
  studio:   { kaca: '#5a3a1a', neon: '#ffc94d', ikon: '🎬', label: 'Studio' },
  mesin:    { kaca: '#2c3446', neon: '#9fb4d9', ikon: '⚙️', label: 'Mesin' },
  youtube:  { kaca: '#4a1418', neon: '#ff4d5e', ikon: '▶️', label: 'YouTube' },
  instagram:{ kaca: '#3e1840', neon: '#ff6ad5', ikon: '📸', label: 'Instagram' },
  tiktok:   { kaca: '#13252b', neon: '#25f4ee', ikon: '🎵', label: 'TikTok' },
  facebook: { kaca: '#132447', neon: '#4d8dff', ikon: '👍', label: 'Facebook' },
  threads:  { kaca: '#26262c', neon: '#f2f2f2', ikon: '🧵', label: 'Threads' },
  x:        { kaca: '#1d1f24', neon: '#d6dbe3', ikon: '✖️', label: 'X' },
  shopee:   { kaca: '#4a2012', neon: '#ff7a45', ikon: '🛍️', label: 'Shopee' },
  tokopedia:{ kaca: '#123a16', neon: '#4ee36a', ikon: '🦉', label: 'Tokopedia' },
  lazada:   { kaca: '#1a1d4a', neon: '#8f8cff', ikon: '💙', label: 'Lazada' },
  linkedin: { kaca: '#12304e', neon: '#4fb0ff', ikon: '💼', label: 'LinkedIn' },
  pinterest:{ kaca: '#481420', neon: '#ff5470', ikon: '📌', label: 'Pinterest' },
  gudang:   { kaca: '#3a2a18', neon: '#e0a35a', ikon: '📦', label: 'Gudang' },
  kantor:   { kaca: '#163a36', neon: '#4fe0c8', ikon: '📊', label: 'Kantor' },
  toko:     { kaca: '#40321a', neon: '#ffd27a', ikon: '🏪', label: 'Toko' },
  lain:     { kaca: '#2e2446', neon: '#b892ff', ikon: '🏢', label: 'Gedung' }
};
const depan = (no) => no > 6;
const posKav = (no) => { const i = (no - 1) % 6; return { x: (i - 2.5) * 7 + (depan(no) ? -1.75 : 1.75), z: depan(no) ? 3 : -9 }; };
const tinggiKav = (no) => depan(no) ? 6.6 + ((no * 3) % 3) * 0.7 : 12 + ((no * 7) % 4) * 1.1;
const layarY = (no) => depan(no) ? 3.9 : tinggiKav(no) - 3.4;
// titik "parkir" mobil terbang: tepat di depan layar gedung
const dok = (no) => { const p = posKav(no); return new THREE.Vector3(p.x, layarY(no), p.z + 3.4); };
const GERAK = !matchMedia('(prefers-reduced-motion: reduce)').matches;
const HP = () => innerWidth < 640;
const FONT = 'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';

function kanvasTeks(lebar, tinggi, gambar) {
  const c = document.createElement('canvas'); c.width = lebar; c.height = tinggi;
  gambar(c.getContext('2d'), lebar, tinggi);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
function bulat(g, x, y, w, h, r) { g.beginPath(); g.roundRect ? g.roundRect(x, y, w, h, r) : g.rect(x, y, w, h); }

// tekstur jendela kantor: kotak-kotak, sebagian menyala kuning hangat
const TEX_JENDELA = kanvasTeks(128, 256, (g, w, h) => {
  g.fillStyle = '#0d1020'; g.fillRect(0, 0, w, h);
  for (let r = 0; r < 24; r++) for (let c = 0; c < 8; c++) {
    const nyala = Math.random();
    g.fillStyle = nyala > 0.74 ? (nyala > 0.94 ? '#fff1c9' : '#ffc77a') : nyala > 0.55 ? '#2a3660' : '#161a2e';
    g.fillRect(c * 16 + 3, r * 10.6 + 2, 10, 7);
  }
});
TEX_JENDELA.wrapS = TEX_JENDELA.wrapT = THREE.RepeatWrapping;
const jendela = (ulang) => { const t = TEX_JENDELA.clone(); t.repeat.set(1, ulang); t.needsUpdate = true; return t; };

// layar raksasa gaya UGC beranda ocklu.com: REC, ikon besar, angka asli Ludlud, @ocklu
function kartuUGC(r) {
  const j = r.jumlah || {}, gy = GAYA[r.jenis] || GAYA.lain;
  const tx = kanvasTeks(360, 640, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, r.warna || gy.neon); gr.addColorStop(1, '#0c0d1a');
    bulat(g, 0, 0, w, h, 28); g.fillStyle = gr; g.fill();
    g.fillStyle = '#ff3b30'; g.beginPath(); g.arc(40, 44, 12, 0, 7); g.fill();
    g.font = `800 28px ${FONT}`; g.fillStyle = '#fff'; g.textBaseline = 'middle'; g.fillText('REC', 62, 45);
    g.textAlign = 'center'; g.font = `160px ${FONT}`; g.fillText(gy.ikon, w / 2, 250);
    g.font = `900 46px ${FONT}`; g.fillText(r.nama || gy.label, w / 2, 400, w - 40);
    g.font = `700 32px ${FONT}`; g.textAlign = 'left';
    let baris = r.keadaan === 'buka'
      ? [['✅', (j.tayang || 0) + ' tayang'], ['⏳', (j.siap_cek || 0) + ' siap dicek'], ['📅', (j.disetujui || 0) + ' terjadwal']]
      : r.keadaan === 'usul' ? [['💡', 'usulan ' + (r.oleh || 'agen')]] : [['🔌', 'belum disambung']];
    if (r.jenis === 'studio' || r.jenis === 'mesin') baris = [['🎞️', (r.antre || 0) + ' antre'], ['⚡', r.sibuk ? 'lagi kerja' : 'santai']];
    baris.forEach((b, i) => g.fillText(b[0] + ' ' + b[1], 34, 470 + i * 46));
    g.font = `600 28px ${FONT}`; g.fillStyle = 'rgba(255,255,255,.75)'; g.fillText('@ocklu', 34, 610);
  });
  return new THREE.Mesh(new THREE.PlaneGeometry(2.6, 4.6), new THREE.MeshBasicMaterial({ map: tx, transparent: true, fog: false }));
}
function label(teks, warna, lebar = 3.4) {
  const tx = kanvasTeks(512, 112, (g, w, h) => {
    bulat(g, 3, 3, w - 6, h - 6, 50); g.fillStyle = 'rgba(8,10,26,.82)'; g.fill(); g.lineWidth = 6; g.strokeStyle = warna; g.stroke();
    g.font = `900 52px ${FONT}`; g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(teks, w / 2, h / 2 + 2, w - 36);
  });
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, depthTest: false, fog: false }));
  s.scale.set(lebar, lebar * 112 / 512, 1); s.renderOrder = 9; return s;
}
function hologram(baris, warna) {
  const tx = kanvasTeks(512, 256, (g, w, h) => {
    bulat(g, 6, 6, w - 12, h - 12, 26); g.fillStyle = 'rgba(10,20,40,.55)'; g.fill(); g.lineWidth = 6; g.strokeStyle = warna; g.stroke();
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff'; g.shadowColor = warna; g.shadowBlur = 18;
    g.font = `900 58px ${FONT}`; g.fillText(baris[0], w / 2, baris[1] ? h * 0.37 : h / 2, w - 40);
    if (baris[1]) { g.font = `700 38px ${FONT}`; g.fillText(baris[1], w / 2, h * 0.7, w - 40); }
  });
  return new THREE.Mesh(new THREE.PlaneGeometry(4, 2), new THREE.MeshBasicMaterial({ map: tx, transparent: true, depthWrite: false, fog: false }));
}
const terang = (w, h, d, warna) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({ color: warna }));

function gedung(no, r, env) {
  const p = posKav(no), gy = GAYA[r.jenis] || GAYA.lain, grp = new THREE.Group(), neon = r.warna || gy.neon;
  grp.position.set(p.x, 0, p.z);
  const H = tinggiKav(no), fz = 2.01, ly = layarY(no);
  const alas = terang(5, 0.08, 5, neon); alas.material.transparent = true; alas.material.opacity = 0.35; alas.position.y = 0.04; grp.add(alas);
  if (r.keadaan === 'usul') {
    const garis = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(4, H, 4)), new THREE.LineBasicMaterial({ color: '#7ef9ff', transparent: true, opacity: 0.8 }));
    garis.position.y = H / 2; grp.add(garis);
    const isi = new THREE.Mesh(new THREE.BoxGeometry(4, H, 4), new THREE.MeshBasicMaterial({ color: '#7ef9ff', transparent: true, opacity: 0.08, depthWrite: false }));
    isi.position.y = H / 2; grp.add(isi); grp.userData.denyut = isi;
    const t = hologram(['💡 Usulan: ' + (r.nama || gy.label), 'oleh ' + (r.oleh || 'agen') + ' · ketuk'], '#7ef9ff'); t.position.set(0, 2.2, fz + 0.6); grp.add(t);
  } else {
    const jadi = r.keadaan === 'dibangun' && !r.inti ? 0.42 : 1, hb = H * jadi;
    const kaca = new THREE.MeshStandardMaterial({ color: gy.kaca, map: jendela(Math.round(hb / 2.5)), emissive: '#ffd09a', emissiveMap: null, emissiveIntensity: 0,
      metalness: 0.85, roughness: 0.16, envMap: env, envMapIntensity: 1.25 });
    kaca.emissiveMap = kaca.map; kaca.emissiveIntensity = 0.32;
    const badan = new THREE.Mesh(new THREE.BoxGeometry(4, hb, 4), kaca); badan.position.y = hb / 2; grp.add(badan);
    // garis lampu tegak di keempat sudut + cincin atas (ciri gedung di video)
    [[-2, -2], [2, -2], [-2, 2], [2, 2]].forEach(([x, z]) => { const s = terang(0.09, hb, 0.09, neon); s.position.set(x, hb / 2, z); grp.add(s); });
    for (const y of [hb, hb * 0.5]) [[0, 2.02, 4.1, 0.08], [0, -2.02, 4.1, 0.08]].forEach(([x, z, w, d]) => { const s = terang(w, 0.07, d, neon); s.position.set(x, y, z); grp.add(s); });
    if (jadi < 1) {
      const rangka = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(4, H, 4, 1, 4, 1)), new THREE.LineBasicMaterial({ color: '#ffc94d' }));
      rangka.position.y = H / 2; grp.add(rangka);
      const tiang = terang(0.18, H + 2, 0.18, '#ffc94d'); tiang.position.set(1.6, (H + 2) / 2, -1.6); grp.add(tiang);
      const lengan = terang(4.4, 0.16, 0.16, '#ffc94d'); lengan.position.set(0.2, H + 1.9, -1.6); grp.add(lengan); grp.userData.derek = lengan;
      const t = label('🏗️ Lagi dibangun: ' + (r.nama || gy.label), '#ffc94d', 4.6); t.position.set(0, hb + 1.4, 2); grp.add(t);
    } else {
      // mahkota: puncak kecil + antena + lambang hologram berputar
      const puncak = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.2, 2.6), kaca); puncak.position.y = H + 0.6; grp.add(puncak);
      const antena = terang(0.06, 2.4, 0.06, neon); antena.position.y = H + 2.4; grp.add(antena);
      const lampu = terang(0.22, 0.22, 0.22, '#ff3b30'); lampu.position.y = H + 3.6; grp.add(lampu); grp.userData.kedip = lampu;
      const ikon = label(gy.ikon, neon, 1.7); ikon.position.y = H + 2.2; grp.add(ikon);
    }
    if (r.jenis === 'studio' || r.jenis === 'mesin') grp.userData.sibuk = !!r.sibuk;
    const jml = r.jumlah || {};
    if (jml.siap_cek) { const b = label('⏳ ' + jml.siap_cek + ' siap dicek', '#ff4d5e', 3.6); b.position.set(0, H + (jadi < 1 ? 3 : 4.6), 0); grp.add(b); }
  }
  // layar raksasa di dinding depan + bingkai neon
  const layar = kartuUGC(r); layar.position.set(0, ly, fz); grp.add(layar);
  const bingkai = terang(2.8, 4.8, 0.05, neon); bingkai.position.set(0, ly, fz - 0.03); grp.add(bingkai);
  const nama = label(gy.ikon + ' ' + (r.nama || gy.label), neon); nama.position.set(0, 0.9, 2.6); grp.add(nama);
  grp.traverse((o) => { o.userData.no = no; });
  return grp;
}

function lahan(no) {
  const p = posKav(no), grp = new THREE.Group(); grp.position.set(p.x, 0, p.z);
  const pad = terang(4.6, 0.06, 4.6, '#1a2a4a'); pad.position.y = 0.03; grp.add(pad);
  const tepi = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(4.6, 0.1, 4.6)), new THREE.LineBasicMaterial({ color: '#7ef9ff' }));
  tepi.position.y = 0.08; grp.add(tepi);
  const t = hologram(['＋ Lahan kosong', 'ketuk untuk bangun'], '#7ef9ff'); t.position.set(0, 1.6, 1.2); grp.add(t); grp.userData.melayang = t;
  grp.traverse((o) => { o.userData.no = no; o.userData.kosong = true; });
  return grp;
}

// mobil terbang (agen dan lalu lintas hiasan)
function mobilTerbang(warna, nama) {
  const g = new THREE.Group();
  const badan = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.9, 4, 10), new THREE.MeshStandardMaterial({ color: warna, metalness: 0.7, roughness: 0.25 }));
  badan.rotation.x = Math.PI / 2; g.add(badan);
  const kubah = new THREE.Mesh(new THREE.SphereGeometry(0.3, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#9ff3ff', transparent: true, opacity: 0.75, metalness: 0.2, roughness: 0.05 }));
  kubah.position.set(0, 0.18, 0.1); g.add(kubah);
  const bawah = terang(0.5, 0.04, 1.1, '#7ef9ff'); bawah.position.y = -0.33; g.add(bawah);
  const ekor = terang(0.5, 0.1, 0.06, '#ff3b5c'); ekor.position.set(0, 0, -0.78); g.add(ekor);
  if (nama) g.traverse((o) => { o.userData.agen = nama; });
  return g;
}

function langitTekstur() {
  return kanvasTeks(16, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    [[0, '#120c33'], [0.35, '#3d1d5e'], [0.58, '#a3407a'], [0.74, '#f2785c'], [0.86, '#ffc27a'], [1, '#2a1838']].forEach(([s, c]) => gr.addColorStop(s, c));
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  });
}

function buatDunia(el) {
  const kanvas = document.createElement('canvas');
  kanvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:pan-y;cursor:grab';
  kanvas.setAttribute('role', 'img');
  const bungkus = document.createElement('div'); bungkus.style.cssText = 'position:relative;width:100%;height:100%';
  const vid = document.createElement('video'); vid.muted = true; vid.loop = true; vid.autoplay = true; vid.playsInline = true;
  vid.setAttribute('playsinline', ''); vid.setAttribute('aria-hidden', 'true');
  vid.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#140c26';
  kanvas.style.position = 'absolute'; kanvas.style.inset = '0';
  bungkus.append(vid, kanvas); el.replaceChildren(bungkus);
  const pilihKlip = () => { const n = innerWidth / innerHeight < 1 ? 'kota-tegak' : 'kota-lebar'; if (vid.dataset.n === n) return;
    vid.dataset.n = n; vid.poster = n + '.jpg'; vid.src = n + '.mp4'; const pr = vid.play(); pr && pr.catch(() => {}); };
  pilihKlip(); addEventListener('resize', pilihKlip);
  addEventListener('pointerdown', () => { if (vid.paused) vid.play().catch(() => {}); }, { once: true });
  const ren = new THREE.WebGLRenderer({ canvas: kanvas, antialias: !HP(), alpha: true, powerPreference: 'high-performance' });
  ren.setPixelRatio(Math.min(devicePixelRatio, HP() ? 1.5 : 2)); ren.outputColorSpace = THREE.SRGBColorSpace;
  ren.toneMapping = THREE.ACESFilmicToneMapping; ren.toneMappingExposure = 1.05;
  const adegan = new THREE.Scene(), langit = langitTekstur();
  ren.setClearColor(0x000000, 0); adegan.fog = new THREE.Fog('#5a3466', 60, 170);
  // pantulan senja di kaca gedung
  const pmrem = new THREE.PMREMGenerator(ren), ruangEnv = new THREE.Scene();
  ruangEnv.add(new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), new THREE.MeshBasicMaterial({ map: langit, side: THREE.BackSide })));
  const env = pmrem.fromScene(ruangEnv, 0.02).texture; pmrem.dispose();
  const kamera = new THREE.PerspectiveCamera(42, 1, 0.1, 400);
  adegan.add(new THREE.HemisphereLight('#ffb38a', '#1a1030', 0.9));
  const mtr = new THREE.DirectionalLight('#ffb070', 1.6); mtr.position.set(-30, 20, -40); adegan.add(mtr);
  const isiDepan = new THREE.DirectionalLight('#8a7dff', 0.55); isiDepan.position.set(10, 15, 40); adegan.add(isiDepan);
  // matahari terbenam
  const mt = new THREE.Sprite(new THREE.SpriteMaterial({ fog: false, depthWrite: false, map: kanvasTeks(256, 256, (g, w) => {
    const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); gr.addColorStop(0, '#fff6d8'); gr.addColorStop(0.18, '#ffd08a'); gr.addColorStop(0.45, 'rgba(255,140,90,.35)'); gr.addColorStop(1, 'rgba(255,120,90,0)');
    g.fillStyle = gr; g.fillRect(0, 0, w, w); }) }));
  mt.scale.set(60, 60, 1); mt.position.set(-8, 10, -150);
  // tanah gelap berkisi neon
  const kisi = kanvasTeks(128, 128, (g, w) => { g.fillStyle = '#000'; g.fillRect(0, 0, w, w); g.strokeStyle = '#6a4bff'; g.lineWidth = 2; g.strokeRect(0, 0, w, w); });
  kisi.wrapS = kisi.wrapT = THREE.RepeatWrapping; kisi.repeat.set(44, 28);
  const pudar = kanvasTeks(128, 128, (g, w) => { const gr = g.createRadialGradient(w / 2, w / 2, w * 0.18, w / 2, w / 2, w / 2); gr.addColorStop(0, '#fff'); gr.addColorStop(1, '#000'); g.fillStyle = gr; g.fillRect(0, 0, w, w); });
  const tanah = new THREE.Mesh(new THREE.PlaneGeometry(110, 70), new THREE.MeshStandardMaterial({ color: '#0b0c1c', emissive: '#ffffff', emissiveMap: kisi, emissiveIntensity: 0.25,
    metalness: 0.4, roughness: 0.45, envMap: env, transparent: true, alphaMap: pudar, opacity: 0.94 }));
  tanah.position.z = -2;
  tanah.rotation.x = -Math.PI / 2; adegan.add(tanah);
  // kaki langit: ratusan gedung di belakang (satu InstancedMesh, ringan)
  const jauh = HP() ? 70 : 120, latar = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: '#252a48', map: jendela(6), emissive: '#ffd09a', emissiveIntensity: 0.3, metalness: 0.75, roughness: 0.25, envMap: env }), jauh);
  latar.material.emissiveMap = latar.material.map;
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion();
  for (let i = 0; i < jauh; i++) {
    const x = (Math.random() - 0.5) * 170, z = -36 - Math.random() * 80, w = 3 + Math.random() * 5, h = 6 + Math.random() * (z < -75 ? 34 : 15);
    m4.compose(new THREE.Vector3(x, h / 2, z), q, new THREE.Vector3(w, h, w)); latar.setMatrixAt(i, m4);
  }

  // jalan layang lurus di antara dua baris gedung + mobil
  const dek = new THREE.Mesh(new THREE.BoxGeometry(90, 0.3, 3.2), new THREE.MeshStandardMaterial({ color: '#161827', metalness: 0.5, roughness: 0.5 }));
  dek.position.set(0, 2.6, -2.2); adegan.add(dek);
  [[-1.62, '#c58bff'], [1.62, '#7ef9ff']].forEach(([dz, c]) => { const s = terang(90, 0.12, 0.08, c); s.position.set(0, 2.82, -2.2 + dz); adegan.add(s); });
  for (let x = -40; x <= 40; x += 9) { const k = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.5, 0.6), dek.material); k.position.set(x, 1.25, -2.2); adegan.add(k); }
  const mobil = [];
  for (let i = 0; i < (HP() ? 10 : 16); i++) {
    const arah = i % 2 ? 1 : -1, g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.35, 0.5), new THREE.MeshStandardMaterial({ color: ['#e6e8f0', '#20232f', '#c0392b', '#2d6cdf'][i % 4], metalness: 0.6, roughness: 0.3 })));
    const lampuDepan = terang(0.05, 0.1, 0.4, '#fff7d6'); lampuDepan.position.x = 0.46 * arah; g.add(lampuDepan);
    const lampuBelakang = terang(0.05, 0.1, 0.4, '#ff2848'); lampuBelakang.position.x = -0.46 * arah; g.add(lampuBelakang);
    g.position.set(0, 2.95, -2.2 + arah * 0.7); adegan.add(g);
    mobil.push({ g, arah, x: (Math.random() - 0.5) * 90, v: 5 + Math.random() * 4 });
  }
  // jalan layang melengkung di kejauhan (pita neon + titik-titik lampu mobil)
  const lengkung = (dz) => new THREE.CatmullRomCurve3([[-90, 6, -16], [-50, 9, -26], [-15, 7, -18], [20, 10, -28], [55, 7, -17], [90, 9, -24]].map(([x, y, z]) => new THREE.Vector3(x, y, z + dz)));
  const jalur = [lengkung(0), lengkung(1.6)];
  jalur.forEach((c, i) => (new THREE.Mesh(new THREE.TubeGeometry(c, 160, 0.09, 6, false), new THREE.MeshBasicMaterial({ color: i ? '#7ef9ff' : '#ff5fd2' }))));
  const titik = [];
  for (let i = 0; i < 0; i++) { const m = terang(0.5, 0.18, 0.3, i % 2 ? '#fff1c9' : '#ff3b5c'); adegan.add(m); titik.push({ m, c: jalur[i % 2], u: Math.random(), v: (0.012 + Math.random() * 0.01) * (i % 2 ? 1 : -1) }); }
  // mobil terbang hiasan berputar di atas kota
  const lalu = [];
  for (let i = 0; i < (HP() ? 5 : 9); i++) {
    const g = mobilTerbang(['#e6e8f0', '#ffb703', '#8ecae6', '#c77dff'][i % 4]); g.scale.setScalar(0.8); adegan.add(g);
    lalu.push({ g, r: 18 + Math.random() * 26, y: 14 + Math.random() * 10, w: (0.05 + Math.random() * 0.06) * (i % 2 ? 1 : -1), f: Math.random() * 7, cz: -14 - Math.random() * 10 });
  }
  const isi = new THREE.Group(); adegan.add(isi);
  const st = { ren, adegan, kamera, isi, env, kanvas, bungkus, mobil, titik, lalu, camX: 0, tujuanX: 0, agen: [], data: null, raf: 0, bingkai: 0 };

  const ukur = () => {
    const w = bungkus.clientWidth || innerWidth, h = bungkus.clientHeight || innerHeight, tegak = w / h < 1;
    ren.setSize(w, h, false); kamera.aspect = w / h; kamera.fov = tegak ? 58 : 42;
    // kota tampil di bagian atas layar (jendela kota); panel kaca ada di bawahnya
    kamera.setViewOffset(w, h, 0, h * (tegak ? 0.2 : 0.16), w, h); kamera.updateProjectionMatrix();
    st.jarak = tegak ? 54 : 52; st.tinggiKam = tegak ? 19 : 17;
    const lebarLihat = 2 * st.jarak * Math.tan(THREE.MathUtils.degToRad(kamera.fov / 2)) * kamera.aspect;
    st.batas = Math.max(0, 21 - lebarLihat / 2 + 4); st.tujuanX = THREE.MathUtils.clamp(st.tujuanX, -st.batas, st.batas);
  };
  ukur(); new ResizeObserver(ukur).observe(bungkus);

  // seret = jalan-jalan; ketuk = pilih
  let awal = null;
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  kanvas.addEventListener('pointerdown', (e) => { awal = { x: e.clientX, y: e.clientY, cx: st.tujuanX, seret: false }; });
  kanvas.addEventListener('pointermove', (e) => {
    if (!awal) return; const dx = e.clientX - awal.x;
    if (Math.abs(dx) > 6) { awal.seret = true; kanvas.style.cursor = 'grabbing'; }
    if (awal.seret) st.tujuanX = THREE.MathUtils.clamp(awal.cx - dx * 0.07, -st.batas, st.batas);
  });
  const lepas = (e) => {
    if (!awal) return; const ketuk = !awal.seret; awal = null; kanvas.style.cursor = 'grab';
    if (!ketuk || !st.data) return;
    const b = kanvas.getBoundingClientRect(); ptr.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
    ray.setFromCamera(ptr, kamera);
    const kena = ray.intersectObjects(isi.children, true).find((h) => h.object.userData.no || h.object.userData.agen);
    if (!kena) return; const u = kena.object.userData, d = st.data;
    if (u.agen) d.onAgen && d.onAgen(u.agen); else terbangKe(st, u.no);
  };
  kanvas.addEventListener('pointerup', lepas); kanvas.addEventListener('pointercancel', () => { awal = null; });
  // pad joystick + tombol ＋ － ⟳ (gaya Anak Gusti): jalan-jalan bebas di kota
  st.joy = { x: 0, y: 0, id: null }; st.geser = new THREE.Vector3(); st.zoom = 1; st.zoomTuju = 1; st.yaw = 0; st.yawTuju = 0;
  const kendali = document.createElement('div'); kendali.id = 'kendaliKota';
  kendali.innerHTML = '<div class="kk-joy" title="Seret untuk jalan"><div></div></div><div class="kk-tombol"><button data-k="+" title="Dekatkan">＋</button><button data-k="-" title="Jauhkan">－</button><button data-k="r" title="Putar kamera">⟳</button><button data-k="0" title="Balik ke awal">⌂</button></div>';
  const gaya = document.createElement('style');
  gaya.textContent = '#kendaliKota .kk-joy{position:fixed;left:18px;bottom:92px;width:112px;height:120px;border-radius:50%;background:rgba(126,249,255,.14);border:2px solid rgba(126,249,255,.7);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);z-index:15;touch-action:none;cursor:grab;box-shadow:0 0 18px rgba(126,249,255,.35);transition:opacity .3s}'
    + '#kendaliKota .kk-joy div{position:absolute;left:50%;top:50%;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:#e9fdff;box-shadow:0 0 14px #7ef9ff}'
    + '#kendaliKota .kk-tombol{position:fixed;right:16px;bottom:92px;display:flex;flex-direction:column;gap:10px;z-index:15;transition:opacity .3s}'
    + '#kendaliKota button{width:48px;height:48px;border-radius:50%;border:2px solid rgba(126,249,255,.7);background:rgba(14,16,40,.6);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);color:#e9fdff;font:900 22px/1 system-ui;cursor:pointer;padding:0;box-shadow:0 0 12px rgba(126,249,255,.3)}'
    + '#kendaliKota.sembunyi>*{opacity:0;pointer-events:none}';
  document.head.append(gaya); document.body.append(kendali); st.kendali = kendali;
  const joyEl = kendali.firstElementChild, bola = joyEl.firstElementChild;
  const gerakJoy = (e) => { const r = joyEl.getBoundingClientRect(); let dx = (e.clientX - r.left - r.width / 2) / (r.width / 2), dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
    const n = Math.hypot(dx, dy); if (n > 1) { dx /= n; dy /= n; } if (n < 0.15) dx = dy = 0;
    st.joy.x = dx; st.joy.y = dy; bola.style.transform = `translate(${dx * 38}px,${dy * 38}px)`; };
  joyEl.addEventListener('pointerdown', (e) => { e.preventDefault(); st.joy.id = e.pointerId; try { joyEl.setPointerCapture(e.pointerId); } catch (x) {} gerakJoy(e); });
  joyEl.addEventListener('pointermove', (e) => { if (e.pointerId === st.joy.id) gerakJoy(e); });
  const lepasJoy = () => { st.joy.id = null; st.joy.x = st.joy.y = 0; bola.style.transform = ''; };
  joyEl.addEventListener('pointerup', lepasJoy); joyEl.addEventListener('pointercancel', lepasJoy);
  kendali.lastElementChild.addEventListener('click', (e) => { const k = e.target.closest('button'); if (!k) return;
    const a = k.dataset.k;
    if (a === '+') st.zoomTuju = Math.max(0.35, st.zoomTuju * 0.75);
    else if (a === '-') st.zoomTuju = Math.min(1.8, st.zoomTuju / 0.75);
    else if (a === 'r') st.yawTuju += Math.PI / 4;
    else terbangKe(st, null); });
  const hud = document.createElement('div'); hud.id = 'hudKokpit';
  hud.innerHTML = '<i class="hk-s a"></i><i class="hk-s b"></i><i class="hk-s c"></i><i class="hk-s d"></i><div class="hk-atas"><b>✈ OCKLU-01</b> <span></span></div><nav class="hk-dok" aria-label="Tujuan terbang"></nav>';
  const gayaHud = document.createElement('style');
  gayaHud.textContent = '#hudKokpit .hk-s{position:fixed;width:30px;height:30px;border:2px solid rgba(126,249,255,.75);z-index:12;pointer-events:none;filter:drop-shadow(0 0 6px #7ef9ff)}'
    + '#hudKokpit .a{top:10px;left:10px;border-right:0;border-bottom:0;border-radius:10px 0 0 0}#hudKokpit .b{top:10px;right:10px;border-left:0;border-bottom:0;border-radius:0 10px 0 0}'
    + '#hudKokpit .c{bottom:74px;left:10px;border-right:0;border-top:0;border-radius:0 0 0 10px}#hudKokpit .d{bottom:74px;right:10px;border-left:0;border-top:0;border-radius:0 0 10px 0}'
    + '#hudKokpit .hk-atas{position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:12;pointer-events:none;white-space:nowrap;font:700 11px/1 ui-monospace,Menlo,monospace;color:#bff9ff;background:rgba(6,10,26,.62);border:1px solid rgba(126,249,255,.45);border-radius:99px;padding:7px 12px;letter-spacing:.04em;max-width:calc(100vw - 90px);overflow:hidden;text-overflow:ellipsis}'
    + '#hudKokpit .hk-atas b{color:#fff}'
    + '#hudKokpit .hk-dok{position:fixed;left:0;right:0;bottom:0;z-index:12;display:flex;gap:8px;overflow-x:auto;padding:12px 12px calc(12px + env(safe-area-inset-bottom));background:linear-gradient(180deg,rgba(6,8,22,0),rgba(6,8,22,.88) 40%);scrollbar-width:none}'
    + '#hudKokpit .hk-dok::-webkit-scrollbar{display:none}'
    + '#hudKokpit .hk-dok button{flex:0 0 auto;font:700 13px/1 system-ui,-apple-system,sans-serif;color:#fff;background:rgba(14,16,40,.75);border:1.5px solid var(--w,#7ef9ff);border-radius:99px;padding:10px 13px;cursor:pointer;white-space:nowrap}'
    + '#hudKokpit .hk-dok button.aktif{background:var(--w,#7ef9ff);color:#08101e;box-shadow:0 0 16px var(--w,#7ef9ff)}';
  document.head.append(gayaHud); document.body.append(hud); st.hud = hud; st.lihatKini = new THREE.Vector3(0, 6.5, -5); st.lokasi = null;
  hud.querySelector('.hk-dok').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b || b.hasAttribute('data-ganti-kota')) return;
    if (b.dataset.a) { st.data && st.data.onAgen && st.data.onAgen(b.dataset.a); return; }
    terbangKe(st, b.dataset.t ? +b.dataset.t : null); });
  // WASD / panah di laptop
  const tombol = {}; addEventListener('keydown', (e) => { if (/input|textarea|select/i.test(e.target.tagName)) return; tombol[e.key.toLowerCase()] = 1; });
  addEventListener('keyup', (e) => { tombol[e.key.toLowerCase()] = 0; }); st.tombol = tombol;
  return st;
}

function susun(st, data) {
  st.isi.traverse((o) => { o.geometry && o.geometry.dispose(); if (o.material) { o.material.map && o.material.map.dispose(); o.material.dispose(); } });
  st.isi.clear(); st.agen = []; st.gedung = [];
  const peta = {}; (data.kavling || []).forEach((k) => { if (k && k.no >= 1 && k.no <= 12) peta[k.no] = k.rumah; });
  const ada = [];
  for (let no = 1; no <= 12; no++) {
    const g = peta[no] ? gedung(no, peta[no], st.env) : lahan(no); st.isi.add(g); st.gedung.push(g);
    if (peta[no]) ada.push(no);
  }
  const giat = {}; (data.kegiatan || []).forEach((k) => { if (k && k.agen && !giat[k.agen]) giat[k.agen] = k; });
  (data.agen || []).forEach((a, i) => {
    const o = mobilTerbang(a.warna || '#44506a', a.nama); st.isi.add(o);
    const k = giat[a.nama], lb = label(a.nama + (k && k.label ? ' · ' + k.label : ''), a.warna || '#7ef9ff', k && k.label ? 4.4 : 2.4);
    lb.position.y = 1.1; o.add(lb);
    const rute = k ? [k.dari, k.ke] : [ada[(i * 3) % ada.length] || 1, ada[(i * 3 + 2) % ada.length] || 6];
    st.agen.push({ o, rute: rute.map((n) => n >= 1 && n <= 12 ? n : 1), t: i * 2.7, cepat: k ? 5 : 3.5 });
  });
  st.peta = peta; st.data = data; gambarDok(st);
  if (!GERAK) st.agen.forEach((a) => a.o.position.copy(dok(a.rute[0])));
  if (!st.raf) putar(st);
}

// terbang dari layar gedung A → melengkung ke layar gedung B → masuk (mengecil) → keluar → balik
const sementara = new THREE.Vector3();
function letakAgen(a, t) {
  const A = dok(a.rute[0]), B = dok(a.rute[1]), jarak = A.distanceTo(B);
  const dur = Math.max(1.5, jarak / a.cepat), diam = 2.5, siklus = 2 * (dur + diam);
  let u = t % siklus, balik = false;
  if (u > dur + diam) { u -= dur + diam; balik = true; }
  const dari = balik ? B : A, ke = balik ? A : B;
  let skala = 1;
  if (u >= dur) {
    a.o.position.copy(ke); const d = u - dur; skala = d < 0.5 ? 1 - d * 2 : d > diam - 0.5 ? (d - (diam - 0.5)) * 2 : 0;
  } else {
    const s = u / dur, e = s * s * (3 - 2 * s), naik = Math.min(5, 1.5 + jarak * 0.15);
    a.o.position.copy(dari).lerp(ke, e); a.o.position.y += Math.sin(Math.PI * e) * naik;
    sementara.copy(dari).lerp(ke, Math.min(1, e + 0.02)); sementara.y = a.o.position.y;
    if (sementara.distanceToSquared(a.o.position) > 1e-6) a.o.lookAt(sementara);
  }
  a.o.position.y += Math.sin(t * 3) * 0.08; a.o.scale.setScalar(Math.max(0.001, skala));
}

function sudutGedung(st, no) {
  if (no == null) return { pos: new THREE.Vector3(0, st.tinggiKam, st.jarak - 6), lihat: new THREE.Vector3(0, 6.5, -5) };
  const p = posKav(no), kosong = !(st.peta && st.peta[no]), y = kosong ? 2.2 : layarY(no), jauh = (st.kamera.aspect < 1 ? 9.5 : 11.5) * (kosong ? 1.15 : 1);
  return { pos: new THREE.Vector3(p.x, y + 0.9, p.z + 2 + jauh), lihat: new THREE.Vector3(p.x, y, p.z + 2) };
}
function terbangKe(st, no) {
  const ke = sudutGedung(st, no);
  st.terbang = { dariPos: st.kamera.position.clone(), dariLihat: st.lihatKini.clone(), ke, t0: performance.now() / 1000, dur: GERAK ? 2.4 : 0.01, no };
  st.basis = no == null ? null : ke; st.geser.set(0, 0, 0); st.zoom = st.zoomTuju = 1; st.yaw = st.yawTuju = 0; st.tujuanX = st.camX = 0; st.lokasi = no;
  st.data && st.data.onBerangkat && st.data.onBerangkat(no); gambarDok(st);
}
function namaLokasi(st, no) {
  if (no == null) return 'Pangkalan'; const r = st.peta && st.peta[no];
  return r ? (r.nama || (GAYA[r.jenis] || GAYA.lain).label) : 'Lahan kosong ' + no;
}
function gambarDok(st) {
  const dok = st.hud && st.hud.querySelector('.hk-dok'); if (!dok) return; const peta = st.peta || {};
  const e = (x) => String(x).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let h = '<button data-t="" class="' + (st.lokasi == null ? 'aktif' : '') + '">🏠 Pangkalan</button>', kosong = 0;
  for (let no = 1; no <= 12; no++) { const r = peta[no]; if (!r) { kosong = kosong || no; continue; }
    const g = GAYA[r.jenis] || GAYA.lain;
    h += '<button data-t="' + no + '" style="--w:' + e(r.warna || g.neon) + '" class="' + (st.lokasi === no ? 'aktif' : '') + '">' + (r.keadaan === 'usul' ? '💡 ' : g.ikon + ' ') + e(r.nama || g.label) + '</button>'; }
  if (kosong) h += '<button data-t="' + kosong + '" class="' + (st.lokasi === kosong ? 'aktif' : '') + '">＋ Lahan</button>';
  h += '<button data-a="YOSUA" style="--w:#ffc94d">📻 Asisten</button><button data-ganti-kota="video" style="--w:#b892ff">🎬 Mode video</button>';
  dok.innerHTML = h;
}
const SUMBU_Y = new THREE.Vector3(0, 1, 0), kamPos = new THREE.Vector3(), kamLihat = new THREE.Vector3();
function jalurKamera(st, p, pos, lihat) {
  const z0 = st.jarak - 6;
  if (!st.jalurK || st.jalurK.z0 !== z0) {
    const v = (a) => a.map(([x, y, z]) => new THREE.Vector3(x, y, z));
    st.jalurK = { z0,
      pos: new THREE.CatmullRomCurve3(v([[0, st.tinggiKam, z0], [-10, 13, 24], [-26, 6, 5], [-25, 4.6, 0], [-8, 4.6, -0.6], [10, 4.7, 0], [26, 5.5, 0], [14, 14, 30]])),
      lihat: new THREE.CatmullRomCurve3(v([[0, 6.5, -5], [-6, 6, -5], [-14, 5, -3], [-12, 5, -2.5], [6, 5.5, -3], [24, 6, -3], [40, 7, -3], [0, 7, -6]])) };
  }
  st.jalurK.pos.getPointAt(p, pos); st.jalurK.lihat.getPointAt(p, lihat);
}
function putar(st) {
  if (document.hidden) { st.raf = 0; return; }
  st.raf = requestAnimationFrame(() => putar(st));
  // saat halaman digulir jauh ke bawah (kota tertutup panel), hemat baterai: separuh bingkai
  if (scrollY > innerHeight * 0.7 && (st.bingkai++ & 1)) return;
  const t = performance.now() / 1000, dt = Math.min(0.05, t - (st.lalu_t || t)); st.lalu_t = t;
  st.camX += (st.tujuanX - st.camX) * 0.1;
  // scroll = terbang: atas halaman pemandangan lebar, makin digulir makin turun menyusuri jalan layang di antara gedung
  const tujuP = Math.min(1, scrollY / Math.max(innerHeight * 1.2, document.documentElement.scrollHeight - innerHeight));
  st.p = (st.p || 0) + (tujuP - (st.p || 0)) * 0.08;
  const goyang = GERAK ? Math.sin(t * 0.5) * 0.12 : 0;
  if (st.terbang) {
    const f = st.terbang, u = Math.min(1, (t - f.t0) / f.dur), e = u * u * (3 - 2 * u);
    kamPos.copy(f.dariPos).lerp(f.ke.pos, e); kamPos.y += Math.sin(Math.PI * e) * Math.min(7, f.dariPos.distanceTo(f.ke.pos) * 0.2);
    kamLihat.copy(f.dariLihat).lerp(f.ke.lihat, e);
    if (u >= 1) { st.terbang = null; const d = st.data; d && d.onTiba && d.onTiba(f.no); }
  } else { const b = st.basis || sudutGedung(st, null); kamPos.copy(b.pos); kamLihat.copy(b.lihat); kamPos.y += goyang; }
  const tb = st.tombol, jx = st.joy.x + ((tb.d || tb.arrowright) ? 1 : 0) - ((tb.a || tb.arrowleft) ? 1 : 0),
    jy = st.joy.y + ((tb.s || tb.arrowdown) ? 1 : 0) - ((tb.w || tb.arrowup) ? 1 : 0);
  st.zoom += (st.zoomTuju - st.zoom) * 0.08; st.yaw += (st.yawTuju - st.yaw) * 0.08;
  kamLihat.x += st.camX; kamPos.x += st.camX;
  const lengan = kamPos.clone().sub(kamLihat).applyAxisAngle(SUMBU_Y, st.yaw).multiplyScalar(st.zoom);
  if (jx || jy) { // maju = arah pandang kamera di bidang datar
    const maju = lengan.clone().setY(0).normalize().negate(), kanan = new THREE.Vector3(-maju.z, 0, maju.x), laju = 14 * dt;
    st.geser.addScaledVector(maju, -jy * laju).addScaledVector(kanan, jx * laju);
    st.geser.x = THREE.MathUtils.clamp(st.geser.x, -40, 40); st.geser.z = THREE.MathUtils.clamp(st.geser.z, -40, 30);
  }
  kamLihat.add(st.geser); kamPos.copy(kamLihat).add(lengan); kamPos.y = Math.max(1.6, kamPos.y);
  st.kamera.position.copy(kamPos); st.kamera.lookAt(kamLihat); st.lihatKini.copy(kamLihat);
  if (!(st.bingkai++ % 12)) { const v = st.kamTadi ? kamPos.distanceTo(st.kamTadi) / Math.max(dt, 0.001) : 0; st.kamTadi = kamPos.clone();
    st.hud.querySelector('.hk-atas span').textContent = '📍 ' + namaLokasi(st, st.terbang ? st.terbang.no : st.lokasi) + (st.terbang ? ' (terbang…)' : '') + ' · ALT ' + Math.round(kamPos.y * 3) + 'm · SPD ' + Math.round(v * 12) + 'km/j'; }
  st.kendali.classList.toggle('sembunyi', document.body.classList.contains('tiba'));
  if (GERAK) {
    st.agen.forEach((a) => letakAgen(a, t + a.t));
    st.mobil.forEach((m) => { m.x += m.v * m.arah * dt; if (m.x > 45) m.x = -45; if (m.x < -45) m.x = 45; m.g.position.x = m.x; });
    st.titik.forEach((p) => { p.u = (p.u + p.v * dt * 4 + 1) % 1; p.c.getPointAt(p.u, p.m.position); });
    st.lalu.forEach((l) => { const a = t * l.w + l.f; l.g.position.set(Math.cos(a) * l.r, l.y + Math.sin(t + l.f) * 0.6, l.cz + Math.sin(a) * l.r * 0.35);
      l.g.rotation.y = -a + (l.w > 0 ? 0 : Math.PI); });
    (st.gedung || []).forEach((g, i) => { const u = g.userData;
      if (u.derek) u.derek.rotation.y = Math.sin(t * 0.6 + i) * 0.6;
      if (u.kedip) u.kedip.visible = Math.sin(t * 3 + i) > -0.2;
      if (u.denyut) u.denyut.material.opacity = 0.06 + (Math.sin(t * 2) + 1) * 0.05;
      if (u.melayang) u.melayang.position.y = 1.6 + Math.sin(t * 1.5 + i) * 0.12; });
  }
  st.ren.render(st.adegan, st.kamera);
}
document.addEventListener('visibilitychange', () => { document.querySelectorAll('[data-lk3d]').forEach((el) => { const s = el.__lk3d; if (s && !document.hidden && !s.raf) putar(s); }); });

function bisaWebGL() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }

if (bisaWebGL()) {
  window.LudludKota3D = {
    render(el, data) {
      if (!el.__lk3d) { el.__lk3d = buatDunia(el); el.setAttribute('data-lk3d', ''); }
      const kunci = JSON.stringify([data.kavling, data.kegiatan, data.agen]);
      el.__lk3d.data = data;
      if (el.__lk3d.kunci === kunci) return;
      el.__lk3d.kunci = kunci; susun(el.__lk3d, data);
      el.__lk3d.kanvas.setAttribute('aria-label', 'Kota Ludlud 3D: ' + (data.kavling || []).map((k) => 'kavling ' + k.no + ' ' + (k.rumah ? k.rumah.nama : 'kosong')).join(', '));
    }
  };
  window.dispatchEvent(new Event('ludlud-kota3d'));
}
