var CACHE='wtc-painel-v2';
var ASSETS=['./','./login.html','./index.html','./icon-192.png','./icon-512.png'];

self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS);}));
  self.skipWaiting();
});

self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(function(ks){
      return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch',function(e){
  var u=e.request.url;
  // sempre da rede (nunca do cache): credenciais, dados compartilhados e API do GitHub
  if(u.indexOf('usuarios.json')!==-1 || u.indexOf('dados.json')!==-1 || u.indexOf('api.github.com')!==-1){
    e.respondWith(fetch(e.request));
    return;
  }
  e.respondWith(
    fetch(e.request).then(function(r){
      var copy=r.clone();
      caches.open(CACHE).then(function(c){c.put(e.request,copy);});
      return r;
    }).catch(function(){return caches.match(e.request);})
  );
});
