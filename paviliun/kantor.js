// OCKLU Paviliun — interior Gedung Usaha: worker AI duduk di meja, berbusana China atau koboi.
// Satu worker di tabel paviliun_pekerja = satu meja. Worker baru → meja baru otomatis (grid).
import * as THREE from "three";

export function buatKantor(ren) {
  const adegan = new THREE.Scene();
  adegan.background = new THREE.Color(0x1a1410);
  adegan.fog = new THREE.Fog(0x1a1410, 30, 60);

  // ---------- tekstur
  function tk(w, h, f, ulang = [1, 1], warna = true) {
    const c = document.createElement("canvas"); c.width = w; c.height = h; f(c.getContext("2d"), w, h);
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...ulang);
    if (warna) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = ren.capabilities.getMaxAnisotropy(); return t;
  }
  const derau = (g, w, h, k) => { const d = g.getImageData(0, 0, w, h), a = d.data; for (let i = 0; i < a.length; i += 4) { const n = (Math.random() - .5) * k; a[i] += n; a[i + 1] += n; a[i + 2] += n; } g.putImageData(d, 0, 0); };
  const tLantai = tk(512, 512, (g, w, h) => { for (let y = 0; y < h; y += 32) { const l = 22 + Math.random() * 10; g.fillStyle = `hsl(24,38%,${l}%)`; g.fillRect(0, y, w, 32);
      g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(0, y, w, 1.5); const x = Math.random() * w; g.fillRect(x, y, 1.5, 32);
      for (let i = 0; i < 20; i++) { g.strokeStyle = `rgba(20,10,5,${Math.random() * .25})`; g.beginPath(); const yy = y + Math.random() * 32; g.moveTo(0, yy); g.bezierCurveTo(w / 3, yy + 3, w / 2, yy - 3, w, yy); g.stroke(); } }
    derau(g, w, h, 10); }, [6, 4]);
  const tDinding = tk(512, 512, (g, w, h) => { g.fillStyle = "#e8dccb"; g.fillRect(0, 0, w, h); for (let i = 0; i < 60; i++) { const x = Math.random() * w, y = Math.random() * h, r = 20 + Math.random() * 80;
      const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, "rgba(200,184,160,.25)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); } derau(g, w, h, 8); }, [4, 1]);
  const tKisi = tk(256, 256, (g, w, h) => { g.fillStyle = "#ffe6bf"; g.fillRect(0, 0, w, h); g.strokeStyle = "#3a1d12"; g.lineWidth = 7;
    for (let i = 0; i <= w; i += 42) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, h); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(w, i); g.stroke(); }
    g.lineWidth = 5; for (let i = 21; i < w; i += 84) for (let j = 21; j < h; j += 84) g.strokeRect(i, j, 42, 42); });
  const tKotak = (a, b, c) => tk(128, 128, (g, w, h) => { g.fillStyle = a; g.fillRect(0, 0, w, h);
    g.globalAlpha = .55; g.fillStyle = b; for (let i = 0; i < w; i += 32) { g.fillRect(i, 0, 12, h); g.fillRect(0, i, w, 12); } g.globalAlpha = .5; g.fillStyle = c; for (let i = 0; i < w; i += 32) { g.fillRect(i + 20, 0, 3, h); g.fillRect(0, i + 20, w, 3); } }, [3, 3]);
  const tJeans = tk(128, 128, (g, w, h) => { g.fillStyle = "#2c3e5c"; g.fillRect(0, 0, w, h); for (let i = -h; i < w; i += 3) { g.strokeStyle = `rgba(255,255,255,${.04 + Math.random() * .05})`; g.beginPath(); g.moveTo(i, 0); g.lineTo(i + h, h); g.stroke(); } derau(g, w, h, 14); }, [2, 2]);
  const tBrokat = (dasar, motif) => tk(256, 256, (g, w, h) => { g.fillStyle = dasar; g.fillRect(0, 0, w, h); g.strokeStyle = motif; g.lineWidth = 2; g.globalAlpha = .45;
    for (let x = 0; x < w; x += 64) for (let y = 0; y < h; y += 64) { g.beginPath(); g.arc(x + 32, y + 32, 14, 0, 7); g.stroke(); g.beginPath(); g.arc(x + 32, y + 32, 6, 0, 7); g.stroke();
      g.beginPath(); g.moveTo(x + 32, y + 4); g.quadraticCurveTo(x + 50, y + 18, x + 32, y + 18); g.stroke(); } }, [2, 2]);

  const fisik = (o) => new THREE.MeshPhysicalMaterial(o), std = (o) => new THREE.MeshStandardMaterial(o);
  const M = {
    lantai: std({ map: tLantai, roughness: .55 }), dinding: std({ map: tDinding, roughness: .95 }),
    walnut: std({ color: 0x4a2e1e, roughness: .45 }), baja: std({ color: 0x151515, roughness: .4, metalness: .8 }),
    kisi: std({ map: tKisi, emissive: 0xffd9a0, emissiveMap: tKisi, emissiveIntensity: .9 }),
    kursi: std({ color: 0x2a1c16, roughness: .6 }), layarBingkai: std({ color: 0x0c0c0c, roughness: .3, metalness: .5 }),
    lampu: std({ color: 0xf6e8cf, emissive: 0xffd49a, emissiveIntensity: 2.2 }), perunggu: std({ color: 0x8a6a3d, roughness: .3, metalness: .9 }),
    pot: std({ color: 0x2d3b3a, roughness: .7 }), bambu: std({ color: 0x6f7d43, roughness: .5 }), daun: std({ color: 0x3e5e2c, roughness: .8, side: THREE.DoubleSide }),
    kulit: [0xe0b896, 0xc99a74, 0xa87652, 0xf0cfb0].map((c) => fisik({ color: c, roughness: .55, sheen: .3, sheenColor: new THREE.Color(0xffd6c0) })),
    rambut: [0x111111, 0x2b1d14, 0x5a3a22].map((c) => std({ color: c, roughness: .7 })),
    mata: std({ color: 0x111111, roughness: .2 }), emas: std({ color: 0xd4a63a, roughness: .25, metalness: .9 }),
    jeans: std({ map: tJeans, roughness: .9 }), kulitSapi: std({ color: 0x6b4226, roughness: .65 }), sepatu: std({ color: 0x3a2416, roughness: .5 }),
    topiKoboi: std({ color: 0x8b6a45, roughness: .85 }), bandana: std({ color: 0xa3241a, roughness: .8 }), hitam: std({ color: 0x141414, roughness: .6 }),
    putih: std({ color: 0xf2eee6, roughness: .8 }),
  };
  const tambah = (geo, mat, x = 0, y = 0, z = 0, ind = adegan, b = true) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = b; m.receiveShadow = true; ind.add(m); return m; };

  // ---------- ruang
  const W = 26, D = 18, H = 4.6;
  const l = tambah(new THREE.PlaneGeometry(W, D), M.lantai, 0, 0, 0, adegan, false); l.rotation.x = -Math.PI / 2;
  const dB = tambah(new THREE.PlaneGeometry(W, H), M.dinding, 0, H / 2, -D / 2, adegan, false);
  const dKi = tambah(new THREE.PlaneGeometry(D, H), M.dinding, -W / 2, H / 2, 0, adegan, false); dKi.rotation.y = Math.PI / 2;
  const dKa = tambah(new THREE.PlaneGeometry(D, H), M.dinding, W / 2, H / 2, 0, adegan, false); dKa.rotation.y = -Math.PI / 2;
  const plafon = tambah(new THREE.PlaneGeometry(W, D), std({ color: 0x3a2618, roughness: .8 }), 0, H, 0, adegan, false); plafon.rotation.x = Math.PI / 2;
  for (let x = -W / 2 + 2; x < W / 2; x += 3.2) tambah(new THREE.BoxGeometry(.25, .3, D), M.walnut, x, H - .15, 0, adegan, false);
  // jendela kisi China bercahaya di dinding belakang & kanan
  for (const x of [-8, 0, 8]) { tambah(new THREE.PlaneGeometry(3.6, 2.4), M.kisi, x, 2.5, -D / 2 + .02, adegan, false); tambah(new THREE.BoxGeometry(3.9, .14, .2), M.walnut, x, 3.76, -D / 2 + .1); tambah(new THREE.BoxGeometry(3.9, .14, .2), M.walnut, x, 1.24, -D / 2 + .1); }
  const jk = tambah(new THREE.PlaneGeometry(4, 2.4), M.kisi, W / 2 - .02, 2.5, 0, adegan, false); jk.rotation.y = -Math.PI / 2;
  // layar besar papan angka
  const kanvasPapan = document.createElement("canvas"); kanvasPapan.width = 1024; kanvasPapan.height = 400;
  const tPapan = new THREE.CanvasTexture(kanvasPapan); tPapan.colorSpace = THREE.SRGBColorSpace;
  const papan = tambah(new THREE.PlaneGeometry(6.4, 2.5), std({ map: tPapan, emissive: 0xffffff, emissiveMap: tPapan, emissiveIntensity: .9 }), -W / 2 + .03, 2.6, 0, adegan, false); papan.rotation.y = Math.PI / 2;
  tambah(new THREE.BoxGeometry(.1, 2.7, 6.6), M.layarBingkai, -W / 2 + .02, 2.6, 0);
  // tanaman bambu dalam pot & meja teh
  for (const [x, z] of [[-11.5, -7.5], [11.5, -7.5], [-11.5, 7.5], [11.5, 7.5]]) { tambah(new THREE.CylinderGeometry(.45, .35, .7, 20), M.pot, x, .35, z);
    for (let i = 0; i < 7; i++) { const h = 2.2 + Math.random() * 1.4, b = tambah(new THREE.CylinderGeometry(.03, .04, h, 6), M.bambu, x + (Math.random() - .5) * .5, .7 + h / 2, z + (Math.random() - .5) * .5); b.rotation.z = (Math.random() - .5) * .15;
      for (let j = 0; j < 6; j++) { const d = tambah(new THREE.PlaneGeometry(.5, .09), M.daun, b.position.x + (Math.random() - .5) * .6, .7 + h * (.55 + Math.random() * .45), b.position.z + (Math.random() - .5) * .6, adegan, false); d.rotation.set(Math.random(), Math.random() * 6, Math.random()); } } }
  // pintu keluar (gerbang bulan) di depan
  const gp = new THREE.Group(); gp.position.set(0, 0, D / 2 - .05); adegan.add(gp);
  tambah(new THREE.TorusGeometry(1.5, .12, 10, 48), M.walnut, 0, 1.55, 0, gp);

  // ---------- cahaya: sedikit lampu nyata + panel emissive (pelajaran HQ: banyak PointLight = patah-patah)
  adegan.add(new THREE.HemisphereLight(0xffeedd, 0x3a2a1c, 1.1));
  const ruangLampu = new THREE.DirectionalLight(0xfff0d8, 2.2); ruangLampu.position.set(6, 10, 4); ruangLampu.castShadow = true;
  ruangLampu.shadow.mapSize.set(2048, 2048); Object.assign(ruangLampu.shadow.camera, { left: -15, right: 15, top: 12, bottom: -12 }); adegan.add(ruangLampu);
  for (const [x, z] of [[-6, -3], [6, -3], [-6, 4], [6, 4]]) { const p = new THREE.PointLight(0xffd29a, 14, 14, 1.6); p.position.set(x, H - .9, z); adegan.add(p);
    tambah(new THREE.CylinderGeometry(.005, .005, .8, 4), M.baja, x, H - .4, z, adegan, false); tambah(new THREE.CylinderGeometry(.32, .32, .5, 24, 1, true), M.lampu, x, H - 1.05, z, adegan, false); }

  // ---------- orang
  function sil(r, h, mat, ind, x, y, z) { return tambah(new THREE.CapsuleGeometry(r, h, 6, 14), mat, x, y, z, ind); }
  function topiKoboi(ind) {
    const g = new THREE.Group(); ind.add(g);
    const pr = []; for (let i = 0; i <= 20; i++) { const t = i / 20, r = .07 + t * .17; pr.push(new THREE.Vector2(r, .012 + Math.pow(t, 3) * .05)); }
    const brim = tambah(new THREE.LatheGeometry(pr, 40), M.topiKoboi, 0, 0, 0, g); brim.scale.set(1, 1, .85);
    const mahkota = tambah(new THREE.CylinderGeometry(.095, .115, .15, 24), M.topiKoboi, 0, .085, 0, g); mahkota.scale.set(1, 1, .85);
    tambah(new THREE.TorusGeometry(.112, .012, 6, 30), M.kulitSapi, 0, .025, 0, g).rotation.x = Math.PI / 2;
    return g;
  }
  function topiSemangka(ind) { const g = new THREE.Group(); ind.add(g);
    tambah(new THREE.SphereGeometry(.118, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.hitam, 0, 0, 0, g);
    tambah(new THREE.SphereGeometry(.022, 10, 8), M.bandana, 0, .118, 0, g); return g; }

  function orang(p, i) {
    const cina = p.busana === "cina", wanita = ["Mei", "Lin"].includes(p.nama);
    const warnaSutra = [0x7a1a14, 0x1d2f4f, 0x24584a, 0x5c2a4a][i % 4];
    const sutra = fisik({ map: tBrokat("#" + new THREE.Color(warnaSutra).getHexString(), "#e8c070"), roughness: .35, sheen: 1, sheenRoughness: .35, sheenColor: new THREE.Color(0xffe2b0), color: 0xffffff });
    const kemeja = std({ map: tKotak(["#7a1f1a", "#1f3a5c", "#3d5a2a"][i % 3], "#e8e0d0", "#111"), roughness: .85 });
    const atas = cina ? sutra : kemeja, kulit = M.kulit[i % 4], rambut = M.rambut[i % 3];
    const g = new THREE.Group(); const tubuh = new THREE.Group(); g.add(tubuh);
    // panggul & kaki (duduk)
    const kaki = cina ? sutra : M.jeans;
    for (const s of [-1, 1]) { const paha = sil(.075, .36, kaki, tubuh, s * .1, .52, .2); paha.rotation.x = Math.PI / 2;
      sil(.06, .36, kaki, tubuh, s * .1, .27, .4); tambah(new THREE.BoxGeometry(.11, .09, .26), cina ? M.hitam : M.sepatu, s * .1, .05, .46, tubuh); }
    if (cina) { const rok = tambah(new THREE.CylinderGeometry(.21, .26, .32, 24, 1, true), sutra, 0, .48, .12, tubuh); rok.material.side = THREE.DoubleSide; }
    // badan
    const badan = sil(.17, .34, atas, tubuh, 0, .9, 0); badan.scale.set(1, 1, .72);
    if (!cina) { for (const s of [-1, 1]) { const rompi = tambah(new THREE.BoxGeometry(.13, .42, .03), M.kulitSapi, s * .1, .92, .125, tubuh); rompi.rotation.y = s * .25; }
      const ban = tambah(new THREE.ConeGeometry(.09, .12, 3), M.bandana, 0, 1.11, .1, tubuh); ban.rotation.x = Math.PI; }
    else { tambah(new THREE.CylinderGeometry(.075, .085, .06, 20), sutra, 0, 1.17, 0, tubuh); // kerah mandarin
      for (let k = 0; k < 4; k++) tambah(new THREE.SphereGeometry(.013, 8, 6), M.emas, .02 + k * .028, 1.1 - k * .07, .118, tubuh); }
    // kepala
    const kepala = new THREE.Group(); kepala.position.set(0, 1.3, 0); tubuh.add(kepala);
    tambah(new THREE.CylinderGeometry(.045, .05, .1, 12), kulit, 0, -.1, 0, kepala);
    const muka = tambah(new THREE.SphereGeometry(.105, 28, 22), kulit, 0, 0, 0, kepala); muka.scale.set(.92, 1.12, 1);
    for (const s of [-1, 1]) { tambah(new THREE.SphereGeometry(.012, 8, 6), M.mata, s * .035, .02, .095, kepala, false); tambah(new THREE.SphereGeometry(.02, 8, 6), kulit, s * .1, 0, 0, kepala); }
    tambah(new THREE.ConeGeometry(.014, .04, 8), kulit, 0, -.005, .108, kepala, false).rotation.x = Math.PI / 2;
    for (const s2 of [-1, 1]) { const alis = tambah(new THREE.BoxGeometry(.03, .006, .006), rambut, s2 * .035, .045, .1, kepala, false); alis.rotation.z = s2 * -.12; }
    tambah(new THREE.BoxGeometry(.034, .006, .006), std({ color: 0x7a3a30, roughness: .6 }), 0, -.045, .098, kepala, false);
    const r = tambah(new THREE.SphereGeometry(.113, 24, 16, 0, Math.PI * 2, 0, Math.PI * .42), rambut, 0, .02, -.028, kepala); r.scale.set(.96, 1.12, 1.04); r.rotation.x = -.55; // garis rambut di dahi, wajah terbuka
    if (wanita) { tambah(new THREE.SphereGeometry(.055, 16, 12), rambut, 0, .06, -.11, kepala); const tusuk = tambah(new THREE.CylinderGeometry(.004, .004, .16, 6), M.emas, 0, .08, -.13, kepala); tusuk.rotation.z = 1.1; }
    else if (cina) { const t = topiSemangka(kepala); t.position.set(0, .03, 0); }
    if (!cina) { const t = topiKoboi(kepala); t.position.set(0, .085, 0); t.rotation.x = -.08; if (p.nama === "Doc") t.scale.setScalar(1.05); }
    // lengan (bahu → siku → tangan di keyboard)
    const lengan = [];
    for (const s of [-1, 1]) { const bahu = new THREE.Group(); bahu.position.set(s * .2, 1.1, 0); tubuh.add(bahu);
      const atasL = sil(.05, .22, atas, bahu, 0, -.14, 0); atasL.rotation.x = .25;
      const siku = new THREE.Group(); siku.position.set(0, -.27, .05); bahu.add(siku);
      const bawahL = sil(.042, .22, atas, siku, 0, 0, .14); bawahL.rotation.x = Math.PI / 2;
      if (cina) tambah(new THREE.CylinderGeometry(.05, .05, .04, 14), M.putih, 0, 0, .25, siku, false).rotation.x = Math.PI / 2;
      tambah(new THREE.SphereGeometry(.04, 12, 10), kulit, 0, 0, .3, siku);
      lengan.push(siku); }
    g.userData = { tubuh, kepala, lengan, nama: p.nama, id: p.id };
    return g;
  }

  // ---------- meja per worker
  const kelompok = new THREE.Group(); adegan.add(kelompok);
  const sasaran = []; const meja = new Map();
  function layarTeks(m, p) {
    const c = m.kanvas, g = c.getContext("2d"); g.fillStyle = "#0b0f0e"; g.fillRect(0, 0, c.width, c.height);
    const warna = p.status === "galat" ? "#ff5a4a" : p.status === "bekerja" ? "#5cbfa6" : "#c9a86a";
    g.fillStyle = warna; g.fillRect(0, 0, c.width, 34); g.fillStyle = "#0b0f0e"; g.font = "bold 22px sans-serif"; g.fillText(`${p.nama} · ${p.peran}`, 12, 25);
    g.fillStyle = "#e8e2d6"; g.font = "17px sans-serif"; const kata = String(p.catatan || "belum jalan").split(" "); let baris = "", y = 64;
    for (const k of kata) { if (g.measureText(baris + k).width > c.width - 24) { g.fillText(baris, 12, y); baris = ""; y += 22; if (y > c.height - 30) break; } baris += k + " "; }
    if (y <= c.height - 30) g.fillText(baris, 12, y);
    g.fillStyle = warna; g.font = "bold 16px sans-serif"; g.fillText(p.status.toUpperCase(), 12, c.height - 10);
    m.tekstur.needsUpdate = true;
  }
  function buatMeja(p, i) {
    const g = new THREE.Group(); kelompok.add(g);
    tambah(new THREE.BoxGeometry(1.8, .06, .9), M.walnut, 0, .76, 0, g);
    for (const [x, z] of [[-.85, -.4], [.85, -.4], [-.85, .4], [.85, .4]]) tambah(new THREE.BoxGeometry(.04, .76, .04), M.baja, x, .38, z, g);
    const kanvas = document.createElement("canvas"); kanvas.width = 512; kanvas.height = 300;
    const tekstur = new THREE.CanvasTexture(kanvas); tekstur.colorSpace = THREE.SRGBColorSpace;
    // laptop rendah: wajah worker tetap terlihat dari depan
    tambah(new THREE.BoxGeometry(.42, .018, .3), M.layarBingkai, 0, .8, .12, g);
    const tutupL = new THREE.Group(); tutupL.position.set(0, .81, -.03); tutupL.rotation.x = -.32; g.add(tutupL);
    tambah(new THREE.BoxGeometry(.42, .28, .012), M.layarBingkai, 0, .14, 0, tutupL);
    tambah(new THREE.PlaneGeometry(.4, .25), std({ map: tekstur, emissive: 0xffffff, emissiveMap: tekstur, emissiveIntensity: 1.1 }), 0, .14, .007, tutupL, false);
    const blk = tambah(new THREE.PlaneGeometry(.4, .25), std({ map: tekstur, emissive: 0xffffff, emissiveMap: tekstur, emissiveIntensity: .35 }), 0, .14, -.007, tutupL, false); blk.rotation.y = Math.PI; blk.scale.x = -1;
    tambah(new THREE.CylinderGeometry(.05, .045, .1, 16), M.putih, .7, .84, -.1, g); // cangkir teh
    // kursi
    tambah(new THREE.BoxGeometry(.5, .07, .5), M.kursi, 0, .46, .62, g); tambah(new THREE.BoxGeometry(.5, .6, .06), M.kursi, 0, .8, .88, g);
    tambah(new THREE.CylinderGeometry(.03, .03, .42, 8), M.baja, 0, .23, .62, g);
    const o = orang(p, i); o.position.set(0, 0, .5); o.rotation.y = Math.PI; g.add(o);
    const area = new THREE.Mesh(new THREE.BoxGeometry(1.9, 2, 1.9), new THREE.MeshBasicMaterial({ visible: false })); area.position.set(0, 1, .3); area.userData.id = p.id; g.add(area); sasaran.push(area);
    const m = { g, o, kanvas, tekstur, p }; meja.set(p.id, m); return m;
  }
  function tataLetak() {
    const ids = [...meja.keys()], kol = 3;
    ids.forEach((id, i) => { const m = meja.get(id), c = i % kol, b = Math.floor(i / kol);
      m.g.position.set((c - (kol - 1) / 2) * 4.6, 0, -3.6 + b * 4.2); m.g.rotation.y = Math.PI; }); // wajah worker menghadap pintu masuk
  }
  function isiPekerja(list) {
    for (const p of list) { let m = meja.get(p.id); if (!m) m = buatMeja(p, meja.size); m.p = p; layarTeks(m, p); }
    for (const id of [...meja.keys()]) if (!list.some((p) => p.id === id)) { kelompok.remove(meja.get(id).g); meja.delete(id); }
    tataLetak();
  }
  function isiPapan(d) {
    const g = kanvasPapan.getContext("2d"), w = kanvasPapan.width, h = kanvasPapan.height;
    g.fillStyle = "#0e0b09"; g.fillRect(0, 0, w, h); g.fillStyle = "#c99a2e"; g.font = "bold 34px Georgia,serif"; g.fillText("OCKLU · Gedung Usaha", 36, 60);
    const kotakA = [["Uang dari agen", d.uang], ["Agen datang 7 hr", d.agen], ["Worker bekerja", d.kerja], ["Usaha", d.usaha]];
    kotakA.forEach(([k, v], i) => { const x = 36 + i * 245; g.fillStyle = "#8f7d6b"; g.font = "20px sans-serif"; g.fillText(k.toUpperCase(), x, 140); g.fillStyle = i === 0 ? "#5cbfa6" : "#f5e9dc"; g.font = "bold 64px Georgia,serif"; g.fillText(String(v), x, 215); });
    g.fillStyle = "#8f7d6b"; g.font = "20px sans-serif"; g.fillText(d.catatan || "", 36, 320, w - 72); g.fillText("diperbarui " + new Date().toLocaleTimeString("id-ID"), 36, 360);
    tPapan.needsUpdate = true;
  }
  function tiap(t, gerak) {
    for (const m of meja.values()) { const { tubuh, kepala, lengan } = m.o.userData, s = m.p.status;
      if (!gerak) continue;
      const fase = t * (s === "bekerja" ? 9 : 2) + m.p.id.length;
      lengan.forEach((l, k) => l.position.y = -.27 + (s === "bekerja" ? Math.max(0, Math.sin(fase + k * 1.7)) * .018 : 0));
      tubuh.position.y = Math.sin(t * 1.6 + m.p.id.length) * .006;
      kepala.rotation.x = s === "galat" ? .45 : s === "bekerja" ? .12 + Math.sin(t * .7) * .03 : -.05;
      kepala.rotation.y = s === "istirahat" ? Math.sin(t * .5 + m.p.id.length) * .35 : Math.sin(t * .9) * .05; }
  }
  return { adegan, sasaran, isiPekerja, isiPapan, tiap, meja };
}
