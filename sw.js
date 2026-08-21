/* Service Worker – macht die App offline lauffähig.
 *
 * Strategie bewusst zweigeteilt:
 *   index.html + Manifest -> network-first. Neue Wörter erscheinen dadurch beim
 *     nächsten Start mit Internet automatisch, ohne dass jemand etwas löschen muss.
 *   Schriften, Icons, PDF -> cache-first. Ändern sich praktisch nie.
 *
 * Beim Deployen VERSION hochzählen, sonst behalten iPads den alten Cache.
 */
const VERSION = "v1.4.2";
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

/* Netz zuerst, aber nicht endlos warten: bei zähem WLAN nach NET_TIMEOUT die
 * gespeicherte Fassung ausliefern. Ohne das steht das Kind bei schlechtem
 * Empfang vor einem leeren Bildschirm. */
const NET_TIMEOUT = 2500;

/* Immer am HTTP-Cache des Browsers vorbei laden.
 * GitHub Pages liefert index.html mit `cache-control: max-age=600`. Ein
 * normales fetch() im Worker bekommt dadurch bis zu 10 Minuten lang die alte
 * Datei – und schreibt sie auch noch über die frisch vorgeladene. Ergebnis:
 * neue Wörter erscheinen verspätet oder gar nicht. no-store umgeht beides. */
function fetchFrisch(url){
  return fetch(url, {cache:"no-store", credentials:"same-origin"});
}

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(CORE.map(u =>
        fetchFrisch(u).then(r => r.ok ? c.put(u, r) : null).catch(() => null)
      )))                                 // ein fehlendes Einzelteil darf die Installation nicht kippen
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Dokument: Netz zuerst, Cache als Sicherheitsnetz.
 *
 * Der Cache-Schreibvorgang hängt an event.waitUntil, und zwar SYNCHRON beim
 * Eintreffen des fetch-Events angemeldet. Sonst darf der Browser den Worker
 * beenden, sobald die Antwort ausgeliefert ist – mitten im Schreiben. Das
 * Ergebnis wäre ein Cache, der dauerhaft eine Version hinterherhinkt und
 * offline die alten Wörter zeigt. */
function dokumentHolen(event){
  let geschrieben = null;

  const netz = fetchFrisch(event.request.url).then(res => {
    if(res.ok){
      const kopie = res.clone();
      geschrieben = caches.open(CACHE).then(c => c.put("index.html", kopie));
    }
    return res;
  });

  event.waitUntil(netz.then(() => geschrieben).catch(() => {}));

  return new Promise(resolve => {
    let erledigt = false;
    const fertig = r => { if(!erledigt && r){ erledigt = true; resolve(r); } };

    const timer = setTimeout(() => { caches.match("index.html").then(fertig); }, NET_TIMEOUT);

    netz.then(res => { clearTimeout(timer); fertig(res); })
        .catch(() => {
          clearTimeout(timer);
          caches.match("index.html")
            .then(hit => hit || caches.match("./"))
            .then(hit => fertig(hit || Response.error()));
        });
  });
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;

  if (req.mode === "navigate" || req.destination === "document") {
    e.respondWith(dokumentHolen(e));
    return;
  }

  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && res.status === 200 && res.type === "basic") {
        const kopie = res.clone();
        e.waitUntil(caches.open(CACHE).then(c => c.put(req, kopie)));
      }
      return res;
    }))
  );
});
