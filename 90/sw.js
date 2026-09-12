// Simpan kerangka halaman supaya tetap terbuka waktu sinyal hilang.
// data.json SENGAJA tidak disimpan — angka basi lebih berbahaya daripada
// halaman kosong, dan halaman sudah menandai sendiri kalau datanya kedaluwarsa.
const NAMA = 'ocklu90-v1';
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
  if (u.pathname.endsWith('data.json')) return;           // selalu ambil yang baru
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
