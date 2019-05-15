'use strict';

let cacheVersion = 1.1;
let cacheName = 'app';
let cacheLabel = cacheName + '::' + cacheVersion;
let cacheFiles = [
  './manifest.json',
  './style.css',
  './calculator128.png',
  './index.html',
  './manifest.png',
  './cal.min.js'
];

self.addEventListener('install', function(event) {
  console.log('[ServiceWorker-App] Install');
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheLabel.indexOf(key) === -1) {
          caches.open(cacheLabel).then(function(cache) {
            console.log('[ServiceWorker-App] Caching files');
            return cache.addAll(cacheFiles);
          }).then(function() {
            return self.skipWaiting();
          })
        }
      }));
    })
  );
});
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheLabel.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
    console.log('Handling fetch event for', event.request.url);
    event.respondWith(
      fetch(event.request).catch(error => {
        console.log('Fetch failed; returning offline page instead.', error);
        return caches.match("index.html");
      })
    );
  }else{
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  }
});
