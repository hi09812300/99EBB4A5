'use strict';
var d = new Date();
d = d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate();

let cacheVersion = 1;
let cacheName = 'app';
let cacheLabel = cacheName + '::' + cacheVersion + '::' + d;
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

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});