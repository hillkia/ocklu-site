// OCKLU Paviliun — adegan 3D realistis: vila modern perpaduan China + Amerika.
// Semua prosedural (tanpa model/gambar luar). Langit fisik + cahaya lingkungan + pantulan kolam + bloom halus.
import * as THREE from "three";
import { OrbitControls } from "./vendor/OrbitControls.js";
import { Sky } from "./vendor/jsm/objects/Sky.js";
import { Reflector } from "./vendor/jsm/objects/Reflector.js";
import { EffectComposer } from "./vendor/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "./vendor/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "./vendor/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "./vendor/jsm/postprocessing/OutputPass.js";
import { SMAAPass } from "./vendor/jsm/postprocessing/SMAAPass.js";
import { buatKantor } from "./kantor.js";

export function bangun(kanvas, GERAK) {
  const HP = matchMedia("(max-width: 760px)").matches;
  const ren = new THREE.WebGLRenderer({ canvas: kanvas, antialias: false, powerPreference: "high-performance" });
  ren.setPixelRatio(Math.min(devicePixelRatio, HP ? 1.5 : 2));
  ren.shadowMap.enabled = true; ren.shadowMap.type = THREE.PCFSoftShadowMap;
  ren.toneMapping = THREE.ACESFilmicToneMapping; ren.toneMappingExposure = 0.55;
  ren.outputColorSpace = THREE.SRGBColorSpace;
  const adegan = new THREE.Scene();
  const kamera = new THREE.PerspectiveCamera(35, 1, 0.1, 2000);
  kamera.position.set(34, 15, 40);
  const kendali = new OrbitControls(kamera, kanvas);
  kendali.target.set(0, 4.5, 2); kendali.enableDamping = true; kendali.dampingFactor = 0.06;
  kendali.maxPolarAngle = Math.PI * 0.48; kendali.minDistance = 8; kendali.maxDistance = 95;
  kendali.autoRotate = GERAK; kendali.autoRotateSpeed = 0.25;

  // ---------- langit fisik + matahari
  const langitFisik = new Sky(); langitFisik.scale.setScalar(1500); adegan.add(langitFisik);
  const U = langitFisik.material.uniforms;
  U.turbidity.value = 4.5; U.rayleigh.value = 2.2;
  U.mieCoefficient.value = 0.004; U.mieDirectionalG.value = 0.86;
  const arahSurya = new THREE.Vector3();
  const surya = new THREE.DirectionalLight(0xfff0dc, 3.2);
  surya.castShadow = true; surya.shadow.mapSize.set(HP ? 2048 : 4096, HP ? 2048 : 4096);
  Object.assign(surya.shadow.camera, { left: -34, right: 34, top: 34, bottom: -34, near: 1, far: 140 });
  surya.shadow.bias = -0.00025; surya.shadow.normalBias = 0.03; surya.shadow.radius = 4;
  adegan.add(surya, surya.target);
  const langit = new THREE.HemisphereLight(0xdfe8f5, 0x5d5244, 0.45); adegan.add(langit);
  const pmrem = new THREE.PMREMGenerator(ren);
  let envRT = null;
  const adeganLangit = new THREE.Scene(); const salinLangit = new Sky(); salinLangit.scale.setScalar(1500); adeganLangit.add(salinLangit);

  // ---------- tekstur prosedural (derau berlapis, bukan warna rata)
  function derau(g, w, h, warna, kuat, butir = 1) {
    const d = g.getImageData(0, 0, w, h), a = d.data;
    for (let i = 0; i < a.length; i += 4) { const n = (Math.random() - .5) * kuat;
      a[i] = Math.max(0, Math.min(255, a[i] + n)); a[i + 1] = Math.max(0, Math.min(255, a[i + 1] + n)); a[i + 2] = Math.max(0, Math.min(255, a[i + 2] + n * butir)); }
    g.putImageData(d, 0, 0);
  }
  function noda(g, w, h, n, warna, rmin, rmax) {
    for (let i = 0; i < n; i++) { const x = Math.random() * w, y = Math.random() * h, r = rmin + Math.random() * (rmax - rmin);
      const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, warna); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
  }
  function tekstur(w, h, gambar, ulang = [1, 1], warna = true) {
    const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d"); gambar(g, w, h);
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...ulang);
    if (warna) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = ren.capabilities.getMaxAnisotropy(); return t;
  }
  const tKapur = tekstur(512, 512, (g, w, h) => { g.fillStyle = "#ddd3c3"; g.fillRect(0, 0, w, h);
    noda(g, w, h, 40, "rgba(200,186,164,.22)", 30, 110); noda(g, w, h, 30, "rgba(244,238,226,.25)", 20, 80);
    g.strokeStyle = "rgba(150,138,122,.35)"; g.lineWidth = 1.5; for (let y = 0; y <= h; y += 128) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    for (let y = 0; y < h; y += 128) for (let x = (y / 128 % 2) * 128; x < w; x += 256) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 128); g.stroke(); }
    derau(g, w, h, 0, 14); }, [4, 1]);
  const tPlester = tekstur(512, 512, (g, w, h) => { g.fillStyle = "#ebe5da"; g.fillRect(0, 0, w, h);
    noda(g, w, h, 90, "rgba(214,204,188,.35)", 15, 70); derau(g, w, h, 0, 10); }, [3, 2]);
  const tWalnut = tekstur(256, 1024, (g, w, h) => { g.fillStyle = "#4a3021"; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 140; i++) { const x = Math.random() * w; g.strokeStyle = `rgba(${30 + Math.random() * 40},${18 + Math.random() * 20},${10 + Math.random() * 10},${.3 + Math.random() * .4})`;
      g.lineWidth = .5 + Math.random() * 2.5; g.beginPath(); g.moveTo(x, 0); for (let y = 0; y <= h; y += 32) g.lineTo(x + Math.sin(y * .01 + i) * 6, y); g.stroke(); }
    derau(g, w, h, 0, 12); }, [1, 1]);
  const tGenteng = tekstur(512, 512, (g, w, h) => { g.fillStyle = "#2b2d2f"; g.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 32) { const gr = g.createLinearGradient(x, 0, x + 32, 0);
      gr.addColorStop(0, "#151617"); gr.addColorStop(.35, "#3a3d40"); gr.addColorStop(.55, "#4a4e52"); gr.addColorStop(1, "#151617"); g.fillStyle = gr; g.fillRect(x, 0, 32, h); }
    for (let y = 0; y < h; y += 40) { g.fillStyle = "rgba(0,0,0,.45)"; g.fillRect(0, y, w, 4); g.fillStyle = "rgba(255,255,255,.05)"; g.fillRect(0, y + 4, w, 3); }
    derau(g, w, h, 0, 16); }, [8, 4]);
  const tGentengR = tekstur(256, 256, (g, w, h) => { g.fillStyle = "#555"; g.fillRect(0, 0, w, h); noda(g, w, h, 80, "rgba(120,120,120,.6)", 6, 30); derau(g, w, h, 0, 40); }, [8, 4], false);
  const tRumput = tekstur(1024, 1024, (g, w, h) => { g.fillStyle = "#4c6234"; g.fillRect(0, 0, w, h);
    noda(g, w, h, 160, "rgba(98,122,58,.35)", 30, 140); noda(g, w, h, 120, "rgba(52,70,32,.35)", 30, 120);
    for (let i = 0; i < 26000; i++) { g.fillStyle = `hsla(${78 + Math.random() * 26},${28 + Math.random() * 22}%,${24 + Math.random() * 22}%,.8)`; g.fillRect(Math.random() * w, Math.random() * h, 1.5, 3); }
    // garis potong rumput ala halaman Amerika
    for (let x = 0; x < w; x += 128) { g.fillStyle = (x / 128) % 2 ? "rgba(255,255,230,.045)" : "rgba(0,0,0,.04)"; g.fillRect(x, 0, 128, h); } }, [10, 10]);
  const tKerikil = tekstur(512, 512, (g, w, h) => { g.fillStyle = "#a9a194"; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 9000; i++) { const s = 1 + Math.random() * 3; g.fillStyle = `hsl(${30 + Math.random() * 20},${6 + Math.random() * 8}%,${48 + Math.random() * 30}%)`; g.beginPath(); g.arc(Math.random() * w, Math.random() * h, s, 0, 7); g.fill(); } }, [6, 6]);
  function kartuDaun(h1, h2) { return tekstur(256, 256, (g, w, h) => { g.clearRect(0, 0, w, h);
    for (let i = 0; i < 420; i++) { const a = Math.random() * 7, r = Math.sqrt(Math.random()) * 110, x = 128 + Math.cos(a) * r, y = 128 + Math.sin(a) * r * .85;
      g.save(); g.translate(x, y); g.rotate(Math.random() * 7); g.fillStyle = `hsl(${h1 + Math.random() * (h2 - h1)},${35 + Math.random() * 25}%,${16 + Math.random() * 22}%)`;
      g.beginPath(); g.ellipse(0, 0, 3 + Math.random() * 4, 1.5 + Math.random() * 2, 0, 0, 7); g.fill(); g.restore(); } }); }
  const tDaun = kartuDaun(85, 125), tDaunMagnolia = kartuDaun(95, 140), tBambu = kartuDaun(70, 100);

  const fisik = (o) => new THREE.MeshPhysicalMaterial(o), std = (o) => new THREE.MeshStandardMaterial(o);
  const M = {
    kapur: std({ map: tKapur, roughness: .82 }),
    plester: std({ map: tPlester, roughness: .9 }),
    walnut: std({ map: tWalnut, roughness: .55 }),
    oxblood: fisik({ color: 0x5a1612, roughness: .32, clearcoat: .6, clearcoatRoughness: .25 }),
    genteng: std({ map: tGenteng, roughnessMap: tGentengR, color: 0x8a8d90, roughness: .72, metalness: .05, envMapIntensity: .55, side: THREE.DoubleSide }),
    perunggu: std({ color: 0x8a6a3d, roughness: .32, metalness: .9 }),
    baja: std({ color: 0x141516, roughness: .4, metalness: .7 }),
    kaca: fisik({ color: 0x9fb4c0, roughness: .03, metalness: 0, transparent: true, opacity: .26, envMapIntensity: 1.6, clearcoat: 1 }),
    dalam: std({ color: 0x2a2018, emissive: 0xffb36b, emissiveIntensity: .0, roughness: 1 }),
    batang: std({ color: 0x3b2c22, roughness: 1 }),
    daun: std({ map: tDaun, alphaTest: .45, side: THREE.DoubleSide, roughness: .85 }),
    daunM: std({ map: tDaunMagnolia, alphaTest: .45, side: THREE.DoubleSide, roughness: .85 }),
    bambuDaun: std({ map: tBambu, alphaTest: .45, side: THREE.DoubleSide, roughness: .8 }),
    bambu: std({ color: 0x7d8a4a, roughness: .5 }),
    pagar: std({ color: 0x2c4a2a, roughness: .95 }),
    batu: std({ color: 0x8f877b, roughness: .92 }),
    kerikil: std({ map: tKerikil, roughness: 1 }),
    lampion: std({ color: 0xf2e6cf, emissive: 0xffc27a, emissiveIntensity: .25, roughness: .7, transparent: true, opacity: .96 }),
  };
  const tambah = (geo, mat, x = 0, y = 0, z = 0, induk = adegan, bayang = true) => {
    const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = bayang; m.receiveShadow = true; induk.add(m); return m; };
  const kotak = (w, h, d, mat, x, y, z, induk, b) => { const g = new THREE.BoxGeometry(w, h, d);
    const t = mat.map; if (t) { /* skala UV mengikuti ukuran supaya tekstur tak melar */
      const uv = g.attributes.uv, n = g.attributes.normal;
      for (let i = 0; i < uv.count; i++) { const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i));
        const su = ax > .5 ? d : w, sv = ay > .5 ? d : h; uv.setXY(i, uv.getX(i) * su / 4, uv.getY(i) * sv / 4); } }
    return tambah(g, mat, x, y, z, induk, b); };

  // ---------- tanah: rumput bergaris potong + kerikil + jalan batu
  const tanah = tambah(new THREE.CircleGeometry(160, 96), std({ map: tRumput, roughness: 1 }), 0, 0, 0, adegan, false); tanah.rotation.x = -Math.PI / 2;
  const kr = tambah(new THREE.PlaneGeometry(34, 26), M.kerikil, 0, .015, 1, adegan, false); kr.rotation.x = -Math.PI / 2;
  for (let i = 0; i < 9; i++) kotak(3.2, .08, 1.6, M.kapur, 0, .05, 22 + i * 2.1);

  // ---------- atap China melengkung — halus, ujung naik sedikit (modern, bukan kartun)
  function atapChina(w, d, h, lebih = 1.6, naik = .55, seg = 28, tebal = .16) {
    const W = w + 2 * lebih, D = d + 2 * lebih, R = Math.max(0, (W - D) / 2);
    const sisi = [[[-W / 2, D / 2], [W / 2, D / 2], [-R, 0], [R, 0]], [[W / 2, D / 2], [W / 2, -D / 2], [R, 0], [R, 0]],
      [[W / 2, -D / 2], [-W / 2, -D / 2], [R, 0], [-R, 0]], [[-W / 2, -D / 2], [-W / 2, D / 2], [-R, 0], [-R, 0]]];
    const tinggi = (u, v) => h * Math.pow(v, 1.9) + naik * Math.pow(Math.abs(2 * u - 1), 8) * Math.pow(1 - v, 2.6);
    const pos = [], uv = [], idx = [];
    for (const [ea, eb, ra, rb] of sisi) {
      const dasar = pos.length / 3, pj = Math.hypot(eb[0] - ea[0], eb[1] - ea[1]);
      for (let j = 0; j <= seg; j++) for (let i = 0; i <= seg; i++) { const u = i / seg, v = j / seg;
        const ex = ea[0] + (eb[0] - ea[0]) * u, ez = ea[1] + (eb[1] - ea[1]) * u, rx = ra[0] + (rb[0] - ra[0]) * u, rz = ra[1] + (rb[1] - ra[1]) * u;
        pos.push(ex + (rx - ex) * v, tinggi(u, v), ez + (rz - ez) * v); uv.push(u * pj / 3, v * Math.hypot(D / 2, h) / 3); }
      for (let j = 0; j < seg; j++) for (let i = 0; i < seg; i++) { const a = dasar + j * (seg + 1) + i, b = a + 1, c = a + seg + 1, e = c + 1; idx.push(a, c, b, b, c, e); }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
    const grup = new THREE.Group(); tambah(g, M.genteng, 0, 0, 0, grup);
    // lis cucuran tipis (fascia) mengikuti tepi — garis tegas = kesan arsitektural
    for (const [ea, eb] of sisi.map((s) => [s[0], s[1]])) {
      const pts = []; for (let i = 0; i <= 40; i++) { const u = i / 40; pts.push(new THREE.Vector3(ea[0] + (eb[0] - ea[0]) * u, tinggi(u, 0) - tebal / 2, ea[1] + (eb[1] - ea[1]) * u)); }
      tambah(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, tebal * .6, 6), M.baja, 0, 0, 0, grup);
    }
    kotak(Math.max(R * 2, .4) + .5, .28, .34, M.baja, 0, h + .1, 0, grup);
    for (const s of [-1, 1]) { const o = tambah(new THREE.CylinderGeometry(.05, .12, .7, 12), M.perunggu, s * (R + .3), h + .45, 0, grup); o.rotation.z = -s * .35; }
    // plafon kayu di bawah atap
    const pl = tambah(new THREE.PlaneGeometry(W - .2, D - .2), M.walnut, 0, -.06, 0, grup, false); pl.rotation.x = Math.PI / 2;
    return grup;
  }

  // ---------- dinding kaca bingkai baja + ruang dalam hangat
  const lampuDalam = [];
  function dindingKaca(induk, x, y, z, ry, w, h, kolom = 4, jauh = 1.6) {
    const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; induk.add(g);
    tambah(new THREE.PlaneGeometry(w, h), M.kaca, 0, 0, 0, g, false);
    for (let i = 0; i <= kolom; i++) kotak(.07, h, .1, M.baja, -w / 2 + i * w / kolom, 0, 0, g);
    kotak(w, .08, .12, M.baja, 0, h / 2, 0, g); kotak(w, .08, .12, M.baja, 0, -h / 2, 0, g); kotak(w, .05, .1, M.baja, 0, h * .18, 0, g);
    // dinding dalam bercahaya hangat (ruang tampak berisi), sedikit di belakang kaca
    const d = tambah(new THREE.PlaneGeometry(w * .98, h * .98), M.dalam, 0, 0, -jauh, g, false); lampuDalam.push(d);
    if (jauh > .5) for (let i = 0; i < kolom; i++) if (Math.random() > .4) kotak(.5 + Math.random() * .8, .6 + Math.random() * .5, .5, M.batang, -w / 2 + (i + .5) * w / kolom, -h / 2 + .4, -1.1, g, false);
    return g;
  }
  // kisi walnut vertikal (lattice China yang dimodernkan)
  function kisi(induk, x, y, z, ry, w, h, jarak = .16) {
    const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; induk.add(g);
    const n = Math.floor(w / jarak), geo = new THREE.BoxGeometry(.05, h, .12), im = new THREE.InstancedMesh(geo, M.walnut, n), m = new THREE.Matrix4();
    for (let i = 0; i < n; i++) { m.setPosition(-w / 2 + i * jarak + jarak / 2, 0, 0); im.setMatrixAt(i, m); }
    im.castShadow = im.receiveShadow = true; g.add(im); return g;
  }

  // ================================================================== VILA
  const vila = new THREE.Group(); adegan.add(vila);
  // panggung batu kapur + tangga lebar
  kotak(30, .9, 16, M.kapur, 0, .45, 0, vila);
  for (let i = 0; i < 4; i++) kotak(8, .225, .45, M.kapur, 0, .1125 + i * .225, 8.9 - i * .45 + .45, vila);
  // lantai bawah: massa plester putih kolonial + kaca penuh di depan
  kotak(16, 4.4, 7, M.plester, 0, 3.1, -2, vila);
  dindingKaca(vila, 0, 3.0, 3.56, 0, 9.6, 3.9, 6);
  kisi(vila, -6.5, 3.0, 3.6, 0, 2.8, 4.2); kisi(vila, 6.5, 3.0, 3.6, 0, 2.8, 4.2);
  dindingKaca(vila, -8.03, 3.0, -2, -Math.PI / 2, 5, 3.2, 4, .02); dindingKaca(vila, 8.03, 3.0, -2, Math.PI / 2, 5, 3.2, 4, .02);
  // beranda Amerika: tiang walnut ramping, lantai batu, langit-langit kayu
  for (const x of [-7.6, -2.6, 2.6, 7.6]) tambah(new THREE.CylinderGeometry(.16, .16, 4.4, 20), M.oxblood, x, 3.1, 6.6, vila);
  for (const x of [-7.6, -2.6, 2.6, 7.6]) tambah(new THREE.CylinderGeometry(.24, .24, .2, 20), M.perunggu, x, 1.0, 6.6, vila);
  const atapBeranda = atapChina(16, 2.8, .7, .6, .25, 20, .12); atapBeranda.position.set(0, 5.3, 5.3); vila.add(atapBeranda);
  const rokBawah = atapChina(16, 9, 1.2, 1.3, .45); rokBawah.position.set(0, 5.4, -1); vila.add(rokBawah);
  // lantai atas: paviliun kaca dengan tiang lak tua
  kotak(11, .35, 7, M.walnut, 0, 6.6, -1, vila);
  dindingKaca(vila, 0, 8.25, 2.2, 0, 9.6, 3, 6); dindingKaca(vila, 0, 8.25, -4.2, Math.PI, 9.6, 3, 6);
  dindingKaca(vila, -4.85, 8.25, -1, -Math.PI / 2, 6.2, 3, 3); dindingKaca(vila, 4.85, 8.25, -1, Math.PI / 2, 6.2, 3, 3);
  for (const [x, z] of [[-5.1, 2.45], [5.1, 2.45], [-5.1, -4.45], [5.1, -4.45]]) tambah(new THREE.CylinderGeometry(.15, .15, 3.4, 18), M.oxblood, x, 8.4, z, vila);
  const atapAtas = atapChina(10, 6.8, 2.2, 1.9, .7); atapAtas.position.set(0, 10.05, -1); vila.add(atapAtas);
  // cerobong bata kapur (Amerika)
  kotak(1.2, 6.4, 1.2, M.kapur, -6.2, 7.6, -3.6, vila); kotak(1.5, .2, 1.5, M.baja, -6.2, 10.9, -3.6, vila);

  // sayap kanan: gudang / garasi modern (pintu kaca buram, peti usaha di dalam)
  const garasi = new THREE.Group(); garasi.position.set(18.5, .9, -1); vila.add(garasi);
  kotak(9, 3.8, 9, M.plester, 0, 1.9, 0, garasi);
  dindingKaca(garasi, 0, 1.75, 4.52, 0, 6.6, 3.2, 4, .02);
  const atapGarasi = atapChina(9, 9, 1.4, 1, .3, 20); atapGarasi.position.set(0, 3.8, 0); garasi.add(atapGarasi);
  const peti = new THREE.Group(); peti.position.set(0, 0, 2.2); garasi.add(peti);

  // ---------- kolam cermin (pantulan nyata) + batu loncatan
  const kolam = new THREE.Group(); kolam.position.set(0, 0, 15); adegan.add(kolam);
  const cermin = new Reflector(new THREE.PlaneGeometry(20, 9), { textureWidth: HP ? 512 : 1024, textureHeight: HP ? 512 : 1024, color: 0x55646b, clipBias: .003 });
  cermin.rotation.x = -Math.PI / 2; cermin.position.y = .32; kolam.add(cermin);
  kotak(21, .4, .5, M.kapur, 0, .2, 4.75, kolam); kotak(21, .4, .5, M.kapur, 0, .2, -4.75, kolam);
  kotak(.5, .4, 10, M.kapur, -10.25, .2, 0, kolam); kotak(.5, .4, 10, M.kapur, 10.25, .2, 0, kolam);
  for (let i = 0; i < 4; i++) kotak(2.6, .18, 1.3, M.kapur, 0, .38, -3.3 + i * 2.2, kolam);
  const koin = new THREE.Group(); koin.position.set(5, 0, 0); kolam.add(koin);
  const geoKoin = new THREE.CylinderGeometry(.22, .22, .04, 32);

  // ---------- lentera kertas bergaya modern (silinder, cahaya hangat)
  const lampion = [];
  function lentera(x, y, z, s = 1) { const g = new THREE.Group(); g.position.set(x, y, z); adegan.add(g);
    tambah(new THREE.CylinderGeometry(.006, .006, .5, 4), M.baja, 0, -.25, 0, g, false);
    tambah(new THREE.CylinderGeometry(.22 * s, .22 * s, .6 * s, 24, 1, true), M.lampion, 0, -.8 * s, 0, g, false);
    tambah(new THREE.CylinderGeometry(.23 * s, .23 * s, .04, 24), M.baja, 0, -.5 * s, 0, g, false);
    tambah(new THREE.CylinderGeometry(.23 * s, .23 * s, .04, 24), M.baja, 0, -1.1 * s, 0, g, false);
    lampion.push(g); }
  for (const x of [-7.6, -2.6, 2.6, 7.6]) lentera(x, 5.15, 6.6);
  // tiang lampu taman perunggu (Amerika) sepanjang jalan
  const lampuTaman = [];
  for (const z of [22, 27, 32]) for (const s of [-1, 1]) { tambah(new THREE.CylinderGeometry(.06, .08, 1.1, 10), M.perunggu, s * 2.4, .55, z);
    lampuTaman.push(tambah(new THREE.BoxGeometry(.22, .22, .22), M.lampion, s * 2.4, 1.2, z, adegan, false)); }

  // ---------- tanaman: pagar boxwood (Amerika), bambu & pinus & magnolia
  function boxwood(x, z, w, d, h = 1) {
    const geo = new THREE.BoxGeometry(w, h, d, Math.ceil(w * 3), 3, Math.ceil(d * 3)), p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) { p.setX(i, p.getX(i) + (Math.random() - .5) * .06); p.setY(i, p.getY(i) + (Math.random() - .5) * .06); p.setZ(i, p.getZ(i) + (Math.random() - .5) * .06); }
    geo.computeVertexNormals(); const m = std({ map: tekstur(256, 256, (g, W, H) => { g.fillStyle = "#24391f"; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 6000; i++) { g.fillStyle = `hsl(${90 + Math.random() * 30},${30 + Math.random() * 25}%,${12 + Math.random() * 20}%)`; g.fillRect(Math.random() * W, Math.random() * H, 2, 2); } }, [w, h]), roughness: 1 });
    tambah(geo, m, x, h / 2, z); }
  for (const s of [-1, 1]) { boxwood(s * 12.5, 10, 6, 1.1, 1.1); boxwood(s * 16, 1, 1.1, 14, 1.3); }
  const geoKartu = new THREE.PlaneGeometry(1, 1);
  function tajuk(induk, cx, cy, cz, rx, ry, rz, n, mat, ukuran = 1.6) {
    const im = new THREE.InstancedMesh(geoKartu, mat, n), m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3();
    for (let i = 0; i < n; i++) { const u = Math.random() * 2 - 1, t = Math.random() * Math.PI * 2, r = Math.cbrt(Math.random());
      const x = cx + rx * r * Math.sqrt(1 - u * u) * Math.cos(t), y = cy + ry * r * u, z = cz + rz * r * Math.sqrt(1 - u * u) * Math.sin(t);
      e.set(Math.random() * 3, Math.random() * 3, Math.random() * 3); q.setFromEuler(e); const k = ukuran * (.7 + Math.random() * .6); s.set(k, k, k);
      m.compose(new THREE.Vector3(x, y, z), q, s); im.setMatrixAt(i, m); }
    im.castShadow = true; im.receiveShadow = true; induk.add(im); }
  function pohon(x, z, s = 1, mat = M.daun, bentuk = "bulat") { const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); adegan.add(g);
    tambah(new THREE.CylinderGeometry(.16, .3, 4.2, 10), M.batang, 0, 2.1, 0, g);
    for (let i = 0; i < 3; i++) { const c = tambah(new THREE.CylinderGeometry(.05, .1, 2, 6), M.batang, 0, 3.4, 0, g); c.rotation.set((Math.random() - .5) * 1.4, i * 2, (Math.random() - .5) * 1.4); }
    if (bentuk === "pinus") for (let i = 0; i < 4; i++) tajuk(g, (Math.random() - .5) * 2.2, 3.6 + i * .9, (Math.random() - .5) * 2.2, 1.8, .45, 1.4, 70, mat, 1.3);
    else tajuk(g, 0, 5, 0, 2.6, 2, 2.6, 260, mat, 1.5); }
  function rumpunBambu(x, z, n = 14) { const g = new THREE.Group(); g.position.set(x, 0, z); adegan.add(g);
    for (let i = 0; i < n; i++) { const h = 5 + Math.random() * 3, px = (Math.random() - .5) * 2.4, pz = (Math.random() - .5) * 2.4;
      const b = tambah(new THREE.CylinderGeometry(.045, .06, h, 6), M.bambu, px, h / 2, pz, g); b.rotation.set((Math.random() - .5) * .12, 0, (Math.random() - .5) * .12);
      tajuk(g, px, h * .8, pz, .9, h * .25, .9, 26, M.bambuDaun, .9); } }
  pohon(-19, -8, 1.15, M.daun, "pinus"); pohon(-24, 6, 1, M.daunM); pohon(27, 9, 1.1, M.daunM); pohon(29, -10, 1.2, M.daun, "pinus");
  pohon(-13, 26, .9, M.daunM); pohon(14, 28, .85, M.daun); pohon(-30, -14, 1.3, M.daun, "pinus"); pohon(8, -18, 1.25, M.daun);
  rumpunBambu(-13, -1); rumpunBambu(12.5, -8, 10); rumpunBambu(-22, 16, 12);

  // ---------- tembok taman + gerbang bulan (kiri)
  const taman = new THREE.Group(); taman.position.set(-18.5, 0, 9); adegan.add(taman);
  const bentuk = new THREE.Shape(); bentuk.moveTo(-5, 0); bentuk.lineTo(5, 0); bentuk.lineTo(5, 3.6); bentuk.lineTo(-5, 3.6); bentuk.lineTo(-5, 0);
  const lub = new THREE.Path(); lub.absarc(0, 1.85, 1.45, 0, Math.PI * 2, true); bentuk.holes.push(lub);
  const tb = tambah(new THREE.ExtrudeGeometry(bentuk, { depth: .45, bevelEnabled: false, curveSegments: 48 }), M.plester, -.22, 0, 0, taman); tb.rotation.y = Math.PI / 2;
  const tt = atapChina(.45, 10, .25, .3, .12, 10, .08); tt.rotation.y = Math.PI / 2; tt.position.y = 3.65; taman.add(tt);

  // ---------- bintang
  const gb = new THREE.BufferGeometry(), pb = [];
  for (let i = 0; i < 1500; i++) { const t = Math.random() * Math.PI * 2, p = Math.random() * Math.PI * .46; pb.push(800 * Math.sin(p) * Math.cos(t), 800 * Math.cos(p), 800 * Math.sin(p) * Math.sin(t)); }
  gb.setAttribute("position", new THREE.Float32BufferAttribute(pb, 3));
  const bintang = new THREE.Points(gb, new THREE.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0, fog: false })); adegan.add(bintang);

  // ---------- pasca-proses: bloom halus + SMAA
  const komposer = new EffectComposer(ren);
  const lulusRender = new RenderPass(adegan, kamera); komposer.addPass(lulusRender);
  const kantor = buatKantor(ren); let diDalam = false, simpanKam = null;
  function masuk() { if (diDalam) return; diDalam = true; simpanKam = { p: kamera.position.clone(), t: kendali.target.clone() };
    lulusRender.scene = kantor.adegan; terbang = null; kendali.autoRotate = false;
    const sempit = kamera.aspect < 1; kamera.fov = sempit ? 68 : 52; kamera.updateProjectionMatrix(); kamera.position.set(0, 2.5, 5.2); kendali.target.set(0, 1.15, -2.2); kendali.maxDistance = 10.5; kendali.minDistance = 2; kendali.maxPolarAngle = Math.PI * .49;
    ren.toneMappingExposure = 1.0; bloom.strength = .18; }
  function keluar() { if (!diDalam) return; diDalam = false; lulusRender.scene = adegan;
    kamera.position.copy(simpanKam.p); kendali.target.copy(simpanKam.t); kendali.maxDistance = 95; kendali.minDistance = 8; kendali.maxPolarAngle = Math.PI * .48; kamera.fov = 35; kamera.updateProjectionMatrix(); aturWaktu(malam); }
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), .25, .55, .92); komposer.addPass(bloom);
  komposer.addPass(new OutputPass());
  const smaa = new SMAAPass(1, 1); komposer.addPass(smaa);

  // ---------- siang / malam
  let malam = false;
  function aturWaktu(m) {
    malam = m;
    const elev = m ? -4 : 9, azi = 215;
    arahSurya.setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - elev), THREE.MathUtils.degToRad(azi));
    U.sunPosition.value.copy(arahSurya); salinLangit.material.uniforms.sunPosition.value.copy(arahSurya);
    for (const k of ["turbidity", "rayleigh", "mieCoefficient", "mieDirectionalG"]) salinLangit.material.uniforms[k].value = U[k].value;
    if (envRT) envRT.dispose(); envRT = pmrem.fromScene(adeganLangit); adegan.environment = envRT.texture;
    const bulan = new THREE.Vector3().setFromSphericalCoords(1, THREE.MathUtils.degToRad(50), THREE.MathUtils.degToRad(140));
    surya.position.copy((m ? bulan : arahSurya).clone().multiplyScalar(60)); surya.target.position.set(0, 0, 0);
    surya.color.set(m ? 0xa9bcff : 0xffe4c2); surya.intensity = m ? .9 : 3.2;
    langit.intensity = m ? .35 : .45; adegan.environmentIntensity = m ? .5 : .9;
    ren.toneMappingExposure = m ? 1.25 : .55;
    adegan.fog = new THREE.FogExp2(m ? 0x0b1220 : 0xcdb89c, m ? .005 : .0022);
    bintang.material.opacity = m ? .85 : 0; langitFisik.visible = true;
    M.dalam.emissiveIntensity = m ? 2.2 : .35; M.lampion.emissiveIntensity = m ? 3 : .25;
    bloom.strength = m ? .55 : .12;
  }

  // ---------- data → dunia
  function isiPeti(u) {
    peti.clear(); const g = new THREE.BoxGeometry(.5, .5, .5);
    const bahan = { mandiri: std({ color: 0x3e6b5c, roughness: .5 }), hidup: std({ color: 0x5c8f7a, roughness: .5, emissive: 0x2b6650, emissiveIntensity: .8 }),
      sewa: std({ color: 0xa48a5c, roughness: .7 }), mati: std({ color: 0x6e2a22, roughness: .6 }) };
    u.forEach((x, i) => { const m = new THREE.Mesh(g, x.mandiri ? bahan.mandiri : x.hidup ? bahan.hidup : x.titik_mati.length >= 3 ? bahan.mati : bahan.sewa);
      const kol = i % 11, bar = Math.floor(i / 11) % 4, lapis = Math.floor(i / 44);
      m.position.set(-2.9 + kol * .58, .27 + bar * .55, -lapis * .6); m.castShadow = true; peti.add(m); });
  }
  function isiKoin(n) { koin.clear();
    for (let i = 0; i < Math.min(n, 80); i++) { const c = new THREE.Mesh(geoKoin, M.perunggu); c.position.set((i % 10) * .5 - 2.2, .45 + Math.floor(i / 10) * .05, Math.floor(i / 10) % 2 * .5); c.rotation.y = i; koin.add(c); } }
  const bendera = { rotation: {}, position: {} }; // kompatibel; tanda tunggu kini lewat lampu taman
  function aturTunggu(ada) { lampuTaman.forEach((l) => l.material = ada ? std({ color: 0xffd9a0, emissive: 0xffb04a, emissiveIntensity: 3 }) : M.lampion); }

  // ---------- sasaran klik
  const sasaran = [];
  function sasaranRuang(id, v, r = 2.6) { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 6), new THREE.MeshBasicMaterial({ visible: false }));
    m.position.copy(v); m.userData.ruang = id; adegan.add(m); sasaran.push(m); }

  // ---------- terbang kamera & putaran
  let terbang = null;
  const lembut = (x) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  function terbangKe(kam, tgt, ms = 1500) { terbang = { a: kamera.position.clone(), b: new THREE.Vector3(...kam), ta: kendali.target.clone(), tb: new THREE.Vector3(...tgt), t0: performance.now(), ms: GERAK ? ms : 1 }; kendali.autoRotate = false; }
  kendali.addEventListener("start", () => { terbang = null; kendali.autoRotate = false; });
  function ukuran() { const w = innerWidth, h = innerHeight; ren.setSize(w, h, false); komposer.setSize(w, h); kamera.aspect = w / h; kamera.updateProjectionMatrix(); }
  addEventListener("resize", ukuran); ukuran();
  const jam = new THREE.Clock(); const tiapBingkai = [];
  function putar() {
    const t = jam.getElapsedTime();
    if (terbang) { const x = Math.min(1, (performance.now() - terbang.t0) / terbang.ms), e = lembut(x);
      kamera.position.lerpVectors(terbang.a, terbang.b, e); kendali.target.lerpVectors(terbang.ta, terbang.tb, e); if (x >= 1) terbang = null; }
    if (GERAK) { lampion.forEach((l, i) => l.rotation.z = Math.sin(t * .9 + i) * .025);
      koin.children.forEach((c, i) => c.rotation.y = t * .6 + i); }
    kantor.tiap(t, GERAK);
    if (diDalam) { kamera.position.y = Math.min(4.1, Math.max(.8, kamera.position.y)); kamera.position.x = Math.max(-12.2, Math.min(12.2, kamera.position.x)); kamera.position.z = Math.max(-8.4, Math.min(8.6, kamera.position.z)); }
    kendali.update(); komposer.render(); tiapBingkai.forEach((f) => f());
    requestAnimationFrame(putar);
  }
  aturWaktu(matchMedia("(prefers-color-scheme: dark)").matches);
  putar();
  return { kantor, masuk, keluar, diDalam: () => diDalam, kamera, kendali, adegan, sasaran, sasaranRuang, terbangKe, aturWaktu, malam: () => malam, isiPeti, isiKoin, aturTunggu, tiapBingkai, THREE };
}
