const prefix='bccg-r61:' + self.registration.scope + ':';
const CACHE=prefix+'rc2';
const assets=['index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
const urls=assets.map(f=>new URL(f,self.registration.scope).href);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(urls))));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith(prefix)&&name!==CACHE)await caches.delete(name);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const u=new URL(event.request.url),scope=new URL(self.registration.scope);if(u.origin!==scope.origin)return;u.search='';u.hash='';const key=u.href===scope.href?urls[0]:u.href;if(!urls.includes(key))return;event.respondWith((async()=>{const c=await caches.open(CACHE);return (await c.match(key))||fetch(event.request);})());});
