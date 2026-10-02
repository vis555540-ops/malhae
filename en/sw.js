// SayIt offline cache (works with no internet — important at the bedside).
// Network-first, cache fallback. Only removes its own old caches (sayit-v*), never the Korean app's.
const C="sayit-v1";
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(["./","./index.html","./manifest.json","../joystick.js","../emergency.js","../icon.svg"])).catch(()=>{}));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C&&/^sayit-v\d/.test(k)).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  e.respondWith(fetch(e.request).then(r=>{ if(r.ok&&new URL(e.request.url).origin===location.origin){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));} return r; })
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match("./index.html"))));
});
