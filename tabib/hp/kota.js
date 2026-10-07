/* Ocklu Healer — kota agen 3D (pulau terang, seperti video). Satu berkas untuk laptop & HP.
   Kota(el, {onAgen(kunci), onPasien(nama)}) → .isi({agen, pasien}) · .pesan(dari, ke)
   Butuh THREE (r128) + THREE.OrbitControls dimuat lebih dulu. */
(function () {
  const OR = 0xff5a1f, OR_GELAP = 0xb8400f, PUTIH = 0xf6f2ec, BIRU = 0x3aa0ff;
  const WARNA_PASIEN = { sehat: 0xf3efe8, bolong: 0xf2c94c, diamati: 0xf2c94c, sakit: 0xe0384a, rusak: 0xe0384a,
    mati: 0xe0384a, "tak-dimuat": 0x9b85e8, tidur: 0xb9b2a8 };
  const ATAP_PASIEN = { sehat: 0x2fbf7f };
  // posisi tetap 8 agen mengelilingi Lukas di tengah
  const URUT = ["rafael", "tabita", "tomas", "nehemia", "barukh", "natanael", "lidia", "silas"];

  function mat(c, o = {}) { return new THREE.MeshStandardMaterial({ color: c, roughness: 0.55, metalness: 0.05, ...o }); }
  function kotak(w, h, d, m) { const x = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); x.castShadow = x.receiveShadow = true; return x; }
  function silinder(rt, rb, h, m, seg = 24) { const x = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m); x.castShadow = x.receiveShadow = true; return x; }
  function di(o, x, y, z) { o.position.set(x, y, z); return o; }

  // Tiap agen punya bentuk gedung sendiri. Bagian berwarna "badan" ikut berubah biru saat bekerja.
  function gedungAgen(k) {
    const g = new THREE.Group(), badan = mat(OR), aksen = mat(PUTIH), gelap = mat(0x2b2724);
    const pakai = [];
    const B = (o) => { pakai.push(o); return o; };
    if (k === "lukas") {
      g.add(B(di(silinder(2.4, 2.8, 3, badan), 0, 1.5, 0)), di(silinder(2.6, 2.6, 0.3, aksen), 0, 3.15, 0),
        B(di(silinder(1.7, 2.1, 4, badan), 0, 5.3, 0)), di(silinder(1.9, 1.9, 0.3, aksen), 0, 7.45, 0),
        B(di(silinder(1.0, 1.3, 3, badan), 0, 9.1, 0)), di(silinder(0.08, 0.08, 3, aksen), 0, 12, 0));
      const cincin = new THREE.Mesh(new THREE.TorusGeometry(3.4, 0.12, 8, 48), mat(OR, { emissive: OR, emissiveIntensity: 0.6 }));
      cincin.rotation.x = Math.PI / 2; cincin.position.y = 6.5; g.add(cincin); g.userData.cincin = cincin;
    } else if (k === "rafael") { // rumah sakit + palang + helipad
      g.add(B(di(kotak(4.2, 4.6, 3.4, badan), 0, 2.3, 0)), di(kotak(4.4, 0.3, 3.6, aksen), 0, 4.75, 0),
        di(silinder(1.2, 1.2, 0.15, gelap), 0, 4.98, 0));
      const p1 = di(kotak(1.6, 0.45, 0.1, mat(0xe0384a)), 0, 2.8, 1.76), p2 = di(kotak(0.45, 1.6, 0.1, mat(0xe0384a)), 0, 2.8, 1.76);
      const latar = di(kotak(2.1, 2.1, 0.06, aksen), 0, 2.8, 1.72); g.add(latar, p1, p2);
    } else if (k === "tabita") { // perawat: silinder ber-kubah
      g.add(B(di(silinder(1.8, 1.8, 3.6, badan), 0, 1.8, 0)), di(silinder(1.95, 1.95, 0.25, aksen), 0, 3.7, 0));
      const kubah = new THREE.Mesh(new THREE.SphereGeometry(1.8, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), aksen);
      kubah.position.y = 3.8; kubah.castShadow = true; g.add(kubah);
    } else if (k === "tomas") { // juru uji: lab + antena piring
      g.add(B(di(kotak(3.2, 3.2, 3.2, badan), 0, 1.6, 0)), di(kotak(3.4, 0.25, 3.4, aksen), 0, 3.3, 0),
        di(silinder(0.12, 0.12, 1.6, gelap), 0, 4.2, 0));
      const piring = new THREE.Mesh(new THREE.ConeGeometry(1.3, 0.6, 24, 1, true), mat(PUTIH, { side: THREE.DoubleSide }));
      piring.position.y = 5.1; piring.rotation.x = -0.6; g.add(piring);
    } else if (k === "nehemia") { // penjaga jadwal: menara jam
      g.add(B(di(kotak(2.4, 7, 2.4, badan), 0, 3.5, 0)), di(kotak(2.7, 0.3, 2.7, aksen), 0, 7.15, 0));
      const atap = new THREE.Mesh(new THREE.ConeGeometry(1.9, 2.2, 4), mat(OR_GELAP)); atap.position.y = 8.4; atap.rotation.y = Math.PI / 4; atap.castShadow = true; g.add(atap);
      const jam = new THREE.Mesh(new THREE.CircleGeometry(0.85, 32), aksen); jam.position.set(0, 5.6, 1.22); g.add(jam);
      const jarum = di(kotak(0.08, 0.6, 0.04, gelap), 0, 5.85, 1.25); g.add(jarum); g.userData.jarum = jarum;
    } else if (k === "barukh") { // juru catat: lempeng bertumpuk (perpustakaan)
      for (let i = 0; i < 5; i++) g.add(B(di(kotak(3.6 - i * 0.35, 0.8, 2.8 - i * 0.25, i % 2 ? aksen : badan), 0, 0.4 + i * 0.85, 0)));
    } else if (k === "natanael") { // peneliti: observatorium
      g.add(B(di(silinder(1.9, 2.1, 2.8, badan), 0, 1.4, 0)));
      const kubah = new THREE.Mesh(new THREE.SphereGeometry(2, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), aksen);
      kubah.position.y = 2.8; kubah.castShadow = true; g.add(kubah);
      const teropong = silinder(0.35, 0.45, 2.4, gelap); teropong.position.set(0.7, 4.1, 0); teropong.rotation.z = -0.8; g.add(teropong);
    } else if (k === "lidia") { // penjual: toko beratap miring + tenda
      g.add(B(di(kotak(4, 2.8, 3, badan), 0, 1.4, 0)));
      const atap = kotak(4.4, 0.25, 3.4, aksen); atap.position.set(0, 3.05, 0); atap.rotation.x = 0.12; g.add(atap);
      for (let i = 0; i < 5; i++) g.add(di(kotak(0.8, 0.12, 1, mat(i % 2 ? PUTIH : 0xe0384a)), -1.6 + i * 0.8, 2.2, 1.9));
    } else { // silas: menara ramping berujung pena
      g.add(B(di(silinder(1.0, 1.4, 6, badan), 0, 3, 0)), di(silinder(1.15, 1.15, 0.25, aksen), 0, 6.1, 0));
      const pena = new THREE.Mesh(new THREE.ConeGeometry(0.9, 2.4, 6), gelap); pena.position.y = 7.4; pena.castShadow = true; g.add(pena);
    }
    // alas bundar putih di bawah tiap gedung
    const alas = di(silinder(3.2, 3.4, 0.3, mat(0xece6dc), 32), 0, 0.15, 0); alas.receiveShadow = true; g.add(alas);
    // tiang cahaya biru saat bekerja
    const tiang = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 1.6, 26, 20, 1, true),
      new THREE.MeshBasicMaterial({ color: BIRU, transparent: true, opacity: 0.0, depthWrite: false, side: THREE.DoubleSide }));
    tiang.position.y = 13; g.add(tiang);
    g.userData.badan = pakai; g.userData.tiang = tiang;
    return g;
  }

  function Kota(el, opsi = {}) {
    const W = () => el.clientWidth, H = () => el.clientHeight;
    const ren = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    ren.setPixelRatio(Math.min(devicePixelRatio, 2)); ren.setSize(W(), H());
    ren.shadowMap.enabled = true; ren.shadowMap.type = THREE.PCFSoftShadowMap;
    ren.outputEncoding = THREE.sRGBEncoding;
    el.appendChild(ren.domElement);
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0xf1ece4); scene.fog = new THREE.Fog(0xf1ece4, 90, 170);
    const cam = new THREE.PerspectiveCamera(38, W() / H(), 0.5, 400);
    const hp = W() < 700; cam.position.set(hp ? 44 : 30, hp ? 50 : 30, hp ? 44 : 34);
    const kontrol = new THREE.OrbitControls(cam, ren.domElement);
    kontrol.enableDamping = true; kontrol.dampingFactor = 0.08; kontrol.maxPolarAngle = 1.25; kontrol.minDistance = 22; kontrol.maxDistance = 140;
    kontrol.autoRotate = true; kontrol.autoRotateSpeed = 0.35; kontrol.target.set(0, 2, 0);
    ren.domElement.addEventListener("pointerdown", () => { kontrol.autoRotate = false; });

    scene.add(new THREE.HemisphereLight(0xffffff, 0xb9ae9f, 0.42));
    const mat_ = new THREE.DirectionalLight(0xfff4e6, 0.85); mat_.position.set(30, 55, 20); mat_.castShadow = true;
    mat_.shadow.mapSize.set(hp ? 1024 : 2048, hp ? 1024 : 2048);
    Object.assign(mat_.shadow.camera, { left: -45, right: 45, top: 45, bottom: -45, near: 1, far: 140 }); scene.add(mat_);

    // pulau
    const pulau = new THREE.Mesh(new THREE.CylinderGeometry(36, 33, 3, 96), mat(0xdcd6cc)); pulau.position.y = -1.5; pulau.receiveShadow = true; scene.add(pulau);
    const bawah = new THREE.Mesh(new THREE.ConeGeometry(33, 14, 96), mat(0xbfb7aa)); bawah.position.y = -10; bawah.rotation.x = Math.PI; scene.add(bawah);
    const rumput = new THREE.Mesh(new THREE.CircleGeometry(35.6, 96), mat(0xd8d2c7)); rumput.rotation.x = -Math.PI / 2; rumput.position.y = 0.01; rumput.receiveShadow = true; scene.add(rumput);
    // jalan: lingkar dalam (agen) & lingkar luar (pasien) + garis putus putih
    function cincinJalan(r, lebar) {
      const j = new THREE.Mesh(new THREE.RingGeometry(r - lebar / 2, r + lebar / 2, 128), mat(0x2b2724, { roughness: 0.9 }));
      j.rotation.x = -Math.PI / 2; j.position.y = 0.03; j.receiveShadow = true; scene.add(j);
      for (let i = 0; i < 48; i++) {
        const a = (i / 48) * Math.PI * 2, s = kotak(0.12, 0.02, 0.9, mat(0xffffff));
        s.position.set(Math.cos(a) * r, 0.05, Math.sin(a) * r); s.rotation.y = -a; s.castShadow = false; scene.add(s);
      }
    }
    cincinJalan(17, 2.4); cincinJalan(28.5, 1.8);
    // jalan jari-jari dari pusat ke tiap agen
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
      const j = kotak(1.4, 0.04, 28, mat(0x3a3531)); j.castShadow = false; j.position.set(Math.cos(a) * 14, 0.02, Math.sin(a) * 14); j.rotation.y = -a + Math.PI / 2; scene.add(j);
    }
    // pohon
    const daun = mat(0x7fb37a), batang = mat(0x8a6a4a);
    for (let i = 0; i < 46; i++) {
      const a = Math.random() * Math.PI * 2, r = 31.5 + Math.random() * 3.2;
      const p = new THREE.Group(); p.add(di(silinder(0.12, 0.15, 0.8, batang, 6), 0, 0.4, 0));
      const c = new THREE.Mesh(new THREE.ConeGeometry(0.7 + Math.random() * 0.4, 1.8, 7), daun); c.position.y = 1.5; c.castShadow = true; p.add(c);
      p.position.set(Math.cos(a) * r, 0, Math.sin(a) * r); scene.add(p);
    }

    // label HTML melayang
    const lapisLabel = document.createElement("div");
    lapisLabel.style.cssText = "position:absolute;inset:0;pointer-events:none;overflow:hidden;font:600 11px Inter,system-ui,sans-serif";
    el.style.position = "relative"; el.appendChild(lapisLabel);
    function label(teks, klik) {
      const d = document.createElement("div");
      if (klik) { d.style.pointerEvents = "auto"; d.style.cursor = "pointer"; d.addEventListener("click", (e) => { e.stopPropagation(); klik(); }); }
      d.style.cssText += ";position:absolute;transform:translate(-50%,-100%);white-space:nowrap;background:#0e0c0bdd;color:#fff;padding:3px 8px;border-radius:99px;font-size:11px;box-shadow:0 4px 14px #0003;transition:background .3s";
      d.innerHTML = teks; lapisLabel.appendChild(d); return d;
    }

    const AGEN = {}, PASIEN = {}, klikBisa = [];
    function pasangAgen(daftar) {
      daftar.forEach((a) => {
        if (AGEN[a.kunci]) return;
        const g = gedungAgen(a.kunci);
        if (a.kunci === "lukas") g.position.set(0, 0, 0);
        else { const i = URUT.indexOf(a.kunci), ang = (i / 8) * Math.PI * 2 + Math.PI / 8; g.position.set(Math.cos(ang) * 17, 0, Math.sin(ang) * 17); g.position.multiplyScalar(0.7); g.rotation.y = -ang - Math.PI / 2; }
        g.scale.setScalar(a.kunci === "lukas" ? 1.25 : 1.2);
        g.traverse((o) => { if (o.isMesh) { o.userData.agen = a.kunci; klikBisa.push(o); } });
        scene.add(g);
        const tiang = g.userData.tiang; g.remove(tiang);
        const tinggi = new THREE.Box3().setFromObject(g).max.y + 1.2; g.add(tiang);
        AGEN[a.kunci] = { g, l: label("", () => opsi.onAgen && opsi.onAgen(a.kunci)), tinggi, aktif: false };
      });
    }
    function pasangPasien(daftar) {
      const ada = new Set(daftar.map((p) => p.nama));
      Object.keys(PASIEN).forEach((n) => { if (!ada.has(n)) { scene.remove(PASIEN[n].g); delete PASIEN[n]; } });
      const n = daftar.length;
      daftar.forEach((p, i) => {
        let q = PASIEN[p.nama];
        if (!q) {
          const lap = i % 2, a = (i / n) * Math.PI * 2, r = lap ? 31.6 : 25.2;
          const tinggi = p.jenis === "jadwal" || p.jenis === "cron" ? 1.2 : p.jenis === "web" ? 2.6 : 1.8 + ((p.nama.length * 7) % 10) / 4;
          const g = new THREE.Group();
          const badan = kotak(1.5, tinggi, 1.5, mat(0xffffff)); badan.position.y = tinggi / 2; g.add(badan);
          const atap = kotak(1.6, 0.18, 1.6, mat(0xffffff)); atap.position.y = tinggi + 0.09; g.add(atap);
          g.position.set(Math.cos(a) * r, 0, Math.sin(a) * r); g.rotation.y = -a;
          g.traverse((o) => { if (o.isMesh) { o.userData.pasien = p.nama; klikBisa.push(o); } });
          scene.add(g); q = PASIEN[p.nama] = { g, badan, atap, tinggi };
        }
        const w = WARNA_PASIEN[p.keadaan] ?? 0xdedad3;
        q.badan.material.color.setHex(w); q.atap.material.color.setHex(ATAP_PASIEN[p.keadaan] ?? w);
        q.sakit = ["sakit", "rusak", "mati"].includes(p.keadaan); q.keadaan = p.keadaan;
        const perlu = q.sakit || ["bolong", "diamati", "tak-dimuat"].includes(p.keadaan);
        if (q.dulu && !perlu && p.keadaan === "sehat") q.keluarSampai = performance.now() + 120000; // baru sembuh → papan hijau 2 menit
        q.dulu = perlu;
        const keluar = !perlu && q.keluarSampai && performance.now() < q.keluarSampai;
        if (keluar && !q.papan) q.papan = label("", () => opsi.onPasien && opsi.onPasien(p.nama));
        if (keluar) { q.papan.style.display = "block"; q.papan.dataset.tampil = "1"; q.papan.style.background = "#1f9d6bee"; q.papan.innerHTML = `✅ ${p.nama.replace(/^💻 /, "")} · sembuh, keluar`; }
        if (perlu && !q.papan) { q.papan = label("", () => opsi.onPasien && opsi.onPasien(p.nama)); }
        if (q.papan && !keluar) { q.papan.style.display = perlu ? "block" : "none"; q.papan.dataset.tampil = perlu ? "1" : "";
          q.papan.style.background = q.sakit ? "#d6304aee" : "#b98a0cee";
          q.papan.innerHTML = `❗ ${p.nama.replace(/^💻 /, "")}`; }
      });
    }

    // bola pesan berjalan di jalan lingkar dalam dari menara ke menara
    const bola = [];
    function posAgen(k) { const a = AGEN[k]; return a ? a.g.position.clone() : new THREE.Vector3(); }
    function pesan(dari, ke) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 12), new THREE.MeshBasicMaterial({ color: BIRU }));
      const cahaya = new THREE.PointLight(BIRU, 1.4, 8); b.add(cahaya);
      b.userData = { a: posAgen(dari), z: posAgen(ke), t: 0 }; scene.add(b); bola.push(b);
    }

    // klik: bedakan klik dari geser
    const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(); let turun = null;
    ren.domElement.addEventListener("pointerdown", (e) => { turun = [e.clientX, e.clientY]; });
    ren.domElement.addEventListener("pointerup", (e) => {
      const batas = e.pointerType === "touch" ? 12 : 6;
      if (!turun || Math.hypot(e.clientX - turun[0], e.clientY - turun[1]) > batas) return;
      const r = ren.domElement.getBoundingClientRect();
      ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ptr, cam);
      let ud = (ray.intersectObjects(klikBisa, false)[0] || {}).object?.userData;
      if (!ud || (!ud.agen && !ud.pasien && !ud.owner)) {
        // meleset (umum di HP): ambil benda terdekat di layar dalam 36px
        let best = null, jarak = 36;
        const cek = (pos, tinggi, data) => { v.copy(pos); v.y = tinggi; v.project(cam); if (v.z > 1) return;
          const x = ((v.x + 1) / 2) * r.width, y = ((1 - v.y) / 2) * r.height, d = Math.hypot(x - (e.clientX - r.left), y - (e.clientY - r.top));
          if (d < jarak) { jarak = d; best = data; } };
        Object.entries(PASIEN).forEach(([n, q]) => cek(q.g.position, q.tinggi / 2, { pasien: n }));
        Object.entries(PK).forEach(([k, p]) => cek(p.g.position, 1.2, { agen: k }));
        Object.entries(AGEN).forEach(([k, a]) => cek(a.g.position, 3, { agen: k }));
        cek(OWNER.g.position, 1.2, { owner: true });
        ud = best;
      }
      if (!ud) return;
      if (ud.agen && opsi.onAgen) opsi.onAgen(ud.agen);
      else if (ud.pasien && opsi.onPasien) opsi.onPasien(ud.pasien);
      else if (ud.owner && opsi.onOwner) opsi.onOwner();
    });
    ren.domElement.style.cursor = "grab";

    const v = new THREE.Vector3(); let t0 = performance.now();
    // ───────── PEKERJA: pasukan hitam yang berjalan, bekerja, berdiskusi, menghampiri owner ─────────
    const PK = {}, lantai = 0.02;
    function badanOrang(visor, jas = 0x151210) {
      const g = new THREE.Group(), mJas = mat(jas, { roughness: 0.6 }), mKulit = mat(0x2a2522);
      const kaki = (x) => { const p = new THREE.Group(); p.position.set(x, 0.78, 0); const k = kotak(0.22, 0.78, 0.24, mJas); k.position.y = -0.39; p.add(k); const s = kotak(0.24, 0.12, 0.34, mat(0x0a0908)); s.position.set(0, -0.76, 0.05); p.add(s); g.add(p); return p; };
      const tangan = (x) => { const p = new THREE.Group(); p.position.set(x, 1.5, 0); const k = kotak(0.16, 0.62, 0.18, mJas); k.position.y = -0.31; p.add(k); const t = kotak(0.14, 0.14, 0.14, mKulit); t.position.y = -0.66; p.add(t); g.add(p); return p; };
      const kk = kaki(-0.14), kn = kaki(0.14);
      const tubuh = kotak(0.62, 0.78, 0.36, mJas); tubuh.position.y = 1.17; g.add(tubuh);
      const kemeja = kotak(0.2, 0.5, 0.02, mat(0xf3efe8)); kemeja.position.set(0, 1.28, 0.19); g.add(kemeja);
      const dasi = kotak(0.07, 0.38, 0.03, mat(0x0a0908)); dasi.position.set(0, 1.25, 0.205); g.add(dasi);
      const tk = tangan(-0.39), tn = tangan(0.39);
      const helm = new THREE.Mesh(new THREE.SphereGeometry(0.31, 20, 16), mat(0x121010, { roughness: 0.25, metalness: 0.4 })); helm.position.y = 1.86; helm.castShadow = true; g.add(helm);
      const mv = new THREE.MeshStandardMaterial({ color: visor, emissive: visor, emissiveIntensity: 0.55, roughness: 0.15, metalness: 0.3 });
      const kaca = new THREE.Mesh(new THREE.SphereGeometry(0.315, 20, 10, -1.1, 2.2, 1.15, 0.7), mv); kaca.position.y = 1.86; g.add(kaca);
      const bawa = kotak(0.42, 0.34, 0.34, mat(0xc98a4a)); bawa.position.set(0, 1.08, 0.42); bawa.visible = false; g.add(bawa);
      const percik = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), new THREE.MeshBasicMaterial({ color: BIRU })); percik.visible = false; g.add(percik);
      g.userData = { kk, kn, tk, tn, mv, bawa, percik, tubuh };
      return g;
    }
    function titikDepan(pos, jarak = 2.2) { const arah = pos.clone().setY(0); const d = arah.length() || 1; return arah.multiplyScalar((d - jarak) / d).setY(lantai); }
    const OWNER = (() => {
      const g = badanOrang(0xff8a3d, 0xf3efe8); g.scale.setScalar(1.15); g.position.set(0, lantai, 14.2); g.rotation.y = Math.PI;
      g.traverse((o) => { if (o.isMesh) { o.userData.owner = true; klikBisa.push(o); } }); scene.add(g);
      const l = label("👤 Anda", () => opsi.onOwner && opsi.onOwner()); l.style.background = "#ff5a1fee"; return { g, l };
    })();
    function gelembung(p, teks, detik = 4.5) {
      if (!teks) return; p.bubble.textContent = teks.length > 90 ? teks.slice(0, 88) + "…" : teks;
      p.bubble.style.display = "block"; p.bubbleSampai = performance.now() + detik * 1000;
    }
    function buatPekerja(k, nama) {
      const g = badanOrang(0xff7a3d); g.scale.setScalar(1.1);
      const rumah = titikDepan(AGEN[k].g.position, -3.2);
      g.position.copy(rumah); scene.add(g);
      g.traverse((o) => { if (o.isMesh) { o.userData.agen = k; klikBisa.push(o); } });
      const l = label(nama, () => opsi.onAgen && opsi.onAgen(k)); l.style.fontSize = "10px";
      const bubble = document.createElement("div");
      bubble.style.cssText = "position:absolute;transform:translate(-50%,-100%);max-width:190px;background:#fff;color:#17130f;padding:6px 9px;border-radius:12px 12px 12px 3px;font:500 11px/1.35 Inter,system-ui,sans-serif;box-shadow:0 6px 18px #0002;display:none;white-space:normal";
      lapisLabel.appendChild(bubble);
      PK[k] = { k, g, l, bubble, rumah, tujuan: null, laju: 2.6 + Math.random() * 0.8, fase: Math.random() * 6, mode: "diam", sampai: performance.now() + 1500 + Math.random() * 4000, bubbleSampai: 0 };
    }
    function jalanKe(p, titik, mode, sesudah) { p.tujuan = titik.clone().setY(lantai); p.mode = "jalan"; p.lanjut = mode; p.sesudah = sesudah; }
    function pasienAcak(syarat) { const xs = Object.entries(PASIEN).filter(([n, q]) => !syarat || syarat(q)); return xs.length ? xs[Math.floor(Math.random() * xs.length)] : null; }
    function pilihKegiatan(p, now) {
      const r = Math.random(), ucap = opsi.ucapan || (() => "");
      const idle = Object.values(PK).filter((x) => x !== p && x.mode === "diam" && !x.kerjaNyata);
      if (r < 0.32) { const x = pasienAcak(); if (x) { const [n, q] = x; jalanKe(p, titikDepan(q.g.position, -1.6), "periksa", () => gelembung(p, ucap(p.k, "periksa", n))); return; } }
      if (r < 0.52) { const x = pasienAcak((q) => q.sakit || q.keadaan === "bolong") || pasienAcak(); if (x) { const [n, q] = x; p.g.userData.bawa.visible = true; jalanKe(p, titikDepan(q.g.position, -1.6), "taruh", () => { p.g.userData.bawa.visible = false; gelembung(p, ucap(p.k, "antar", n)); }); return; } }
      if (r < 0.78 && idle.length) { const teman = idle[Math.floor(Math.random() * idle.length)];
        const tengah = p.g.position.clone().lerp(teman.g.position, 0.5); const geser = new THREE.Vector3(0.9, 0, 0);
        jalanKe(p, tengah.clone().add(geser), "diskusi", () => gelembung(p, ucap(p.k, "diskusi", teman.k)));
        jalanKe(teman, tengah.clone().sub(geser), "diskusi", () => setTimeout(() => gelembung(teman, ucap(teman.k, "balas", p.k)), 2200));
        p.teman = teman; teman.teman = p; return; }
      if (r < 0.86) { jalanKe(p, OWNER.g.position.clone().add(new THREE.Vector3((Math.random() - 0.5) * 2.4, 0, -1.6)), "lapor", () => gelembung(p, ucap(p.k, "lapor"), 6)); return; }
      jalanKe(p, p.rumah, "diam");
    }
    function langkah(p, dt, now, t) {
      const u = p.g.userData;
      // kerja nyata dari data menang atas segalanya
      if (p.kerjaNyata && p.mode !== "jalan" && p.mode !== "kerja" && p.mode !== "panggil") {
        const q = PASIEN[p.kerjaNyata]; const ke = q ? titikDepan(q.g.position, -1.6) : titikDepan(AGEN[p.k].g.position, -3.2);
        jalanKe(p, ke, "kerja", () => gelembung(p, (opsi.ucapan || (() => ""))(p.k, "kerja", p.kerjaNyata), 6));
      }
      if (!p.kerjaNyata && p.mode === "kerja") { p.mode = "diam"; p.sampai = now + 800; }
      if (p.mode === "jalan" || p.mode === "panggil-jalan") {
        const d = p.tujuan.clone().sub(p.g.position); d.y = 0; const jarak = d.length();
        if (jarak < 0.15) { p.mode = p.lanjut === "panggil" ? "panggil" : p.lanjut; p.sampai = now + (p.lanjut === "diskusi" ? 7000 : p.lanjut === "kerja" ? 1e12 : p.lanjut === "panggil" ? 1e12 : 3000 + Math.random() * 3000); if (p.sesudah) { const f = p.sesudah; p.sesudah = null; f(); } }
        else { const v = d.normalize().multiplyScalar(Math.min(jarak, p.laju * dt)); p.g.position.add(v); p.g.rotation.y = Math.atan2(d.x, d.z); }
        p.fase += dt * p.laju * 3.2;
        u.kk.rotation.x = Math.sin(p.fase) * 0.6; u.kn.rotation.x = -Math.sin(p.fase) * 0.6;
        u.tk.rotation.x = u.bawa.visible ? -1.2 : -Math.sin(p.fase) * 0.55; u.tn.rotation.x = u.bawa.visible ? -1.2 : Math.sin(p.fase) * 0.55;
        p.g.position.y = lantai + Math.abs(Math.sin(p.fase)) * 0.06;
      } else {
        u.kk.rotation.x *= 0.85; u.kn.rotation.x *= 0.85; p.g.position.y = lantai;
        if (p.mode === "kerja") { // mengetuk & percikan biru
          const q = PASIEN[p.kerjaNyata]; if (q) p.g.rotation.y = Math.atan2(q.g.position.x - p.g.position.x, q.g.position.z - p.g.position.z);
          u.tn.rotation.x = -1.4 + Math.abs(Math.sin(t * 9)) * 0.9; u.tk.rotation.x = -0.9;
          u.percik.visible = Math.sin(t * 18) > 0.2; u.percik.position.set((Math.random() - 0.5) * 0.4, 1.2 + Math.random() * 0.3, 0.75);
        } else if (p.mode === "diskusi" && p.teman) {
          p.g.rotation.y = Math.atan2(p.teman.g.position.x - p.g.position.x, p.teman.g.position.z - p.g.position.z);
          u.tn.rotation.x = -0.4 - Math.sin(t * 2.4 + p.fase) * 0.35; u.tk.rotation.x *= 0.9; u.percik.visible = false;
        } else if (p.mode === "lapor" || p.mode === "panggil") {
          p.g.rotation.y = Math.atan2(OWNER.g.position.x - p.g.position.x, OWNER.g.position.z - p.g.position.z);
          u.tn.rotation.x = p.mode === "panggil" ? -0.3 - Math.sin(t * 3) * 0.2 : -0.6 * Math.max(0, Math.sin(t * 2)); u.percik.visible = false;
        } else if (p.mode === "periksa" || p.mode === "taruh") {
          u.tk.rotation.x = -0.3; u.tn.rotation.x = -0.8 + Math.sin(t * 3) * 0.1; u.percik.visible = false;
        } else { u.tk.rotation.x *= 0.85; u.tn.rotation.x *= 0.85; u.percik.visible = false; }
        u.tubuh.position.y = 1.17 + Math.sin(t * 1.6 + p.fase) * 0.012;
        if (now > p.sampai && p.mode !== "kerja" && p.mode !== "panggil") { if (p.teman && p.teman.teman === p) { p.teman.teman = null; } p.teman = null; p.mode = "diam"; pilihKegiatan(p, now); }
      }
      u.mv.color.setHex(p.kerjaNyata ? BIRU : 0xff7a3d); u.mv.emissive.setHex(p.kerjaNyata ? BIRU : 0xff7a3d);
    }
    function proyeksi(el2, pos, tinggi, tampil = true) {
      v.copy(pos); v.y = tinggi; v.project(cam); const vis = tampil && v.z < 1;
      el2.style.display = vis ? "block" : "none"; el2.style.left = ((v.x + 1) / 2) * W() + "px"; el2.style.top = ((1 - v.y) / 2) * H() + "px";
    }

    function putar(now) {
      const dt = Math.min(0.05, (now - t0) / 1000); t0 = now; const t = now / 1000;
      kontrol.update();
      Object.entries(AGEN).forEach(([k, a]) => {
        const target = a.aktif ? 1 : 0; a.nyala = (a.nyala ?? 0) + (target - (a.nyala ?? 0)) * 0.08;
        const denyut = a.aktif ? 0.55 + 0.45 * Math.sin(t * 5) : 0;
        a.g.userData.badan.forEach((m) => { m.material.color.lerpColors(new THREE.Color(OR), new THREE.Color(BIRU), a.nyala); m.material.emissive = m.material.emissive || new THREE.Color(); m.material.emissive.setHex(BIRU); m.material.emissiveIntensity = denyut * 0.5; });
        a.g.userData.tiang.material.opacity = a.nyala * (0.18 + 0.12 * Math.sin(t * 4));
        if (a.g.userData.cincin) a.g.userData.cincin.rotation.z = t * 0.6;
        if (a.g.userData.jarum) a.g.userData.jarum.rotation.z = -t * 0.8;
        v.copy(a.g.position); v.y = a.tinggi + 1.5; v.project(cam);
        const vis = v.z < 1;
        a.l.style.display = vis ? "block" : "none";
        a.l.style.left = ((v.x + 1) / 2) * W() + "px"; a.l.style.top = ((1 - v.y) / 2) * H() + "px";
        a.l.style.background = a.aktif ? "#1f6fd1ee" : "#0e0c0bdd";
      });
      Object.values(PASIEN).forEach((q) => { if (q.sakit) q.badan.material.emissive.setHex(0xe0384a), (q.badan.material.emissiveIntensity = 0.25 + 0.25 * Math.sin(t * 4)); else q.badan.material.emissiveIntensity = 0; });
      Object.values(PK).forEach((p) => { langkah(p, dt, now, t); proyeksi(p.l, p.g.position, 2.75);
        const ada = now < p.bubbleSampai; if (ada) proyeksi(p.bubble, p.g.position, 3.4); else p.bubble.style.display = "none"; p.l.style.display = ada ? "none" : p.l.style.display;
        p.l.style.background = p.kerjaNyata ? "#1f6fd1ee" : p.mode === "panggil" ? "#ff5a1fee" : "#0e0c0bdd"; });
      proyeksi(OWNER.l, OWNER.g.position, 2.9);
      Object.values(PASIEN).forEach((q) => { if (q.papan && q.papan.dataset.tampil) proyeksi(q.papan, q.g.position, q.tinggi + 1.1); });
      for (let i = bola.length - 1; i >= 0; i--) {
        const b = bola[i], d = b.userData; d.t += dt / 2.2;
        const p = d.a.clone().lerp(d.z, d.t); p.y = 2 + Math.sin(d.t * Math.PI) * 6; b.position.copy(p);
        if (d.t >= 1) { scene.remove(b); bola.splice(i, 1); }
      }
      ren.render(scene, cam); requestAnimationFrame(putar);
    }
    requestAnimationFrame(putar);
    new ResizeObserver(() => { cam.aspect = W() / H(); cam.updateProjectionMatrix(); ren.setSize(W(), H()); }).observe(el);

    return {
      isi({ agen = [], pasien = [] }) {
        pasangAgen(agen);
        agen.forEach((a) => {
          const x = AGEN[a.kunci]; if (!x) return;
          if (a.aktif && !x.aktif && a.kunci !== "lukas") pesan("lukas", a.kunci); // Lukas menugaskan
          if (!a.aktif && x.aktif && a.kunci !== "lukas") pesan(a.kunci, "lukas"); // hasil kembali
          x.aktif = !!a.aktif;
          x.l.innerHTML = `🏢 ${a.peran}`; x.l.style.opacity = ".8";
          if (!PK[a.kunci]) buatPekerja(a.kunci, a.nama);
          const pk = PK[a.kunci]; pk.kerjaNyata = a.aktif ? (a.sasaran || "") || null : null; if (a.aktif && !a.sasaran) pk.kerjaNyata = "__menara";
          pk.l.innerHTML = `${a.aktif ? "🔵" : "🟠"} ${a.nama}`;
        });
        pasangPasien(pasien);
      },
      pesan,
      // owner memanggil: pekerja berjalan menghampiri, lalu onTiba dipanggil
      panggil(k, onTiba) { const p = PK[k]; if (!p) return; p.teman = null;
        const ke = OWNER.g.position.clone().add(new THREE.Vector3(0, 0, -1.7));
        p.tujuan = ke; p.mode = "jalan"; p.lanjut = "panggil"; p.sesudah = () => { gelembung(p, "Ya, saya di sini. Ada yang bisa saya bantu?", 5); onTiba && onTiba(); }; },
      lepas(k) { const p = PK[k]; if (p && p.mode === "panggil") { p.mode = "diam"; p.sampai = performance.now() + 500; } },
      layar(nama) { const q = PASIEN[nama]; if (!q) return null; const r = ren.domElement.getBoundingClientRect(); v.copy(q.g.position); v.y = q.tinggi / 2; v.project(cam); return { x: r.left + ((v.x + 1) / 2) * r.width, y: r.top + ((1 - v.y) / 2) * r.height }; },
      ucap(k, teks) { const p = PK[k]; if (p) gelembung(p, teks, 7); },
    };
  }
  window.Kota = Kota;
})();
