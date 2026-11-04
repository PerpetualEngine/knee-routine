var CACHE = "knee-routine-v9";
var FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./exdata.js", "./routine.js", "./knee3d.js", "./vendor/three.min.js", "./vendor/OrbitControls.js"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return c.addAll(FILES).then(function () {
      return fetch("audio/manifest.json").then(function (r) { return r.json(); }).then(function (a) {
        return Promise.all(a.map(function (k) { return c.add("audio/" + k + ".mp3").catch(function () {}); }));
      }).catch(function () {});
    });
  }));
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(function (r) {
        var copy = r.clone();
        caches.open(CACHE).then(function (c) { return c.put(e.request, copy); }).catch(function () {});
        return r;
      })
      .catch(function () { return caches.match(e.request).then(function (m) { return m || caches.match("./index.html"); }); })
  );
});
