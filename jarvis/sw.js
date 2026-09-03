// Cangkang disimpan supaya aplikasi tetap terbuka tanpa sinyal.
//
// Dua keputusan yang menentukan berkas ini:
//
// 1. HALAMAN & SKRIP: jaringan dulu, cache cuma jaring pengaman.
//    Versi pertama memakai cache-dulu dengan nama tetap — akibatnya pembaruan
//    tampilan TIDAK PERNAH sampai ke HP yang sudah memasang aplikasinya.
//    Sekarang halaman selalu diambil segar kalau ada sinyal, dan cache hanya
//    dipakai saat jaringan benar-benar gagal.
// 2. data.json: TIDAK PERNAH disentuh cache. Dasbor yang menampilkan angka
//    basi tanpa memberi tahu lebih berbahaya daripada dasbor yang kosong.
const NAMA = 'jarvis-hp-v1';
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
  if (e.request.method !== 'GET') return;
  if (u.pathname.endsWith('data.json')) return;          // selalu dari jaringan

  const halaman = e.request.mode === 'navigate' ||
                  /\.(html|js|webmanifest)$/.test(u.pathname) ||
                  u.pathname.endsWith('/');

  if (halaman) {
    // jaringan dulu — pembaruan harus bisa sampai
    e.respondWith(
      fetch(e.request)
        .then(r => {
          if (r.ok && u.origin === location.origin) {
            const salin = r.clone();
            caches.open(NAMA).then(k => k.put(e.request, salin));
          }
          return r;
        })
        .catch(() => caches.match(e.request, { ignoreSearch: true })
          .then(c => c || caches.match('./index.html')))
    );
    return;
  }

  // gambar & ikon boleh dari cache dulu — isinya tidak berubah
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
