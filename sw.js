const CACHE_NAME = 'tv-repair-v1';
const ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  // Add your main app HTML, CSS, JS, and database files here
];

// Install and pre-cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Activate and clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
});

// Network-first, then cache, then offline.html fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
      .then(response => response || caches.match('/offline.html'))
  );
});