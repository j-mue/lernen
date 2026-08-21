/* Service Worker – macht die App offline lauffähig.
 *
 * Strategie bewusst zweigeteilt:
 *   index.html + Manifest -> network-first. Neue Wörter erscheinen dadurch beim
 *     nächsten Start mit Internet automatisch, ohne dass jemand etwas löschen muss.
 *   Schriften, Icons, PDF -> cache-first. Ändern sich praktisch nie.
 *
 * Beim Deployen VERSION hochzählen, sonst behalten iPads den alten Cache.
 */
const VERSION = "v1.0.0";
const CACHE   = "woerter-trainer-" + VERSION;

const CORE = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icon-192.png",
  "icon-512.png",
  "apple-touch-icon.png",
  "fonts/Baloo2.woff2",
  "fonts/Nunito.woff2",
  "brueche-uebungsblatt.pdf"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(CORE))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())   // ein fehlendes Einzelteil darf die Installation nicht kippen
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;

  const isDoc = req.mode === "navigate" || req.destination === "document";

  if (isDoc) {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put("index.html", copy));
          return res;
        })
        .catch(() => caches.match("index.html").then(r => r || caches.match("./")))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && res.status === 200 && res.type === "basic") {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }))
  );
});
