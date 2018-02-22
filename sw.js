// cache these items
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('blog-tracker').then(function(cache) {
      return cache.addAll([
        '/',
        'index.html',
        'writer.html',
        'css/normalize-7.0.0.css',
        'css/style.css',
        'js/project-manager.js',
        'js/jquery-3.2.1.js',
        'js/pouchdb-6.3.4.js',
        'js/credentials.js',
        'manifest.json',
        'images/logo-450x450.png'
      ]);
    })
    .catch((e) => {
      // failing first time?
    })
  );
 });

// use cache first, then network
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});