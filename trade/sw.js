/* OCKLU-TRADE service worker — app shell offline + data network-first */
const CACHE = "ocklu-trade-v1";
const SHELL = [
  "./","./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // data verdict → network-first (selalu coba yang terbaru, jatuh ke cache bila offline)
  if (url.pathname.endsWith("/data/latest.js") || url.pathname.endsWith("latest.json")) {
    e.respondWith(
      fetch(e.request).then((r) => {
        const copy = r.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return r;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  // app shell → cache-first
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
