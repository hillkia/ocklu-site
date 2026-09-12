// Versi WAJIB dinaikkan tiap halaman berubah. 12/9/2026 halaman baru sudah
// terbit tapi HP tetap membuka yang lama (masih minta PIN) karena nama simpanan
// tidak berubah, jadi pekerja lama menyajikan halaman lama selamanya.
const NAMA = 'ocklu90-v4';

// Halaman diambil dari jaringan DULU, simpanan cuma dipakai kalau sinyal mati.
// Dengan begini halaman basi tidak bisa mengunci diri lagi seperti kejadian di
// atas. data.json tidak pernah disimpan — angka basi lebih berbahaya daripada
// halaman kosong, dan halaman menandai sendiri kalau datanya kedaluwarsa.
const KERANGKA = ['./', './index.html', './manifest.webmanifest',
                  './ikon-192.png', './ikon-512.png', './ikon-180.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(NAMA).then(c => c.addAll(KERANGKA)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(
    k.filter(x => x !== NAMA).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.pathname.endsWith('data.json')) return;              // selalu yang baru
  if (e.request.mode === 'navigate' || u.pathname.endsWith('index.html') ||
      u.pathname.endsWith('/90/') || u.pathname.endsWith('/90')) {
    e.respondWith(
      fetch(e.request).then(r => {
        const salin = r.clone();
        caches.open(NAMA).then(c => c.put(e.request, salin)).catch(() => {});
        return r;
      }).catch(() => caches.match(e.request).then(r => r || caches.match('./')))
    );
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
