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
    function label(teks) {
      const d = document.createElement("div");
      d.style.cssText = "position:absolute;transform:translate(-50%,-100%);white-space:nowrap;background:#0e0c0bdd;color:#fff;padding:3px 8px;border-radius:99px;font-size:11px;box-shadow:0 4px 14px #0003;transition:background .3s";
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
        AGEN[a.kunci] = { g, l: label(""), tinggi, aktif: false };
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
      if (!turun || Math.hypot(e.clientX - turun[0], e.clientY - turun[1]) > 6) return;
      const r = ren.domElement.getBoundingClientRect();
      ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ptr, cam);
      const hit = ray.intersectObjects(klikBisa, false)[0];
      if (!hit) return;
      if (hit.object.userData.agen && opsi.onAgen) opsi.onAgen(hit.object.userData.agen);
      else if (hit.object.userData.pasien && opsi.onPasien) opsi.onPasien(hit.object.userData.pasien);
    });
    ren.domElement.style.cursor = "grab";

    const v = new THREE.Vector3(); let t0 = performance.now();
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
          x.l.innerHTML = `${a.aktif ? "🔵" : "🟠"} ${a.nama}`; x.l.title = a.peran;
        });
        pasangPasien(pasien);
      },
      pesan,
    };
  }
  window.Kota = Kota;
})();
