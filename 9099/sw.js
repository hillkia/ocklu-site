// Cangkang disimpan supaya aplikasi tetap terbuka tanpa sinyal.
// data.json SENGAJA tidak pernah di-cache: dasbor yang menampilkan angka
// basi tanpa memberi tahu lebih berbahaya daripada dasbor yang kosong.
const NAMA = 'ocklu9099-v1';
const CANGKANG = ['./', './index.html', './manifest.webmanifest',
                  './ikon-192.png', './ikon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(NAMA).then(c => c.addAll(CANGKANG)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(k => Promise.all(k.filter(x => x !== NAMA).map(x => caches.delete(x))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.pathname.endsWith('data.json')) return;            // selalu dari jaringan
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true })
      .then(c => c || fetch(e.request).then(r => {
        if (r.ok && u.origin === location.origin) {
          const salin = r.clone();
          caches.open(NAMA).then(k => k.put(e.request, salin));
        }
        return r;
      }))
  );
});
