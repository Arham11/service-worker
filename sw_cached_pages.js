// this files caches pages at individual level

// this keeps different version what we want
const cacheVersion = "v1";
// the files that needs to be cached
const cacheAssets = [
  "index.html",
  "about.html",
  "/css/style.css",
  "/js/main.js",
];

// 1. Install Event (after registering Event is triggered)

// When a browser runs a service worker for the first time, an install event is fired within it.
// The install event is the perfect place to save things to the cache.
// The following code will run when the install event is fired.
// It will wait until all of the the pages
// (main page "/" "index.html", "about.html", "/css/style.css", "/js/main.js",) gets added to the cache.
self.addEventListener("install", (e) => {
  console.log("Service worker Installing", e);
  // Wait until all promises are resolved. The service worker won't be installed until then.
  e.waitUntil(
    caches
      .open(cacheVersion)
      .then((cache) => {
        console.log("Service worker: caching files");
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// 2. Activate Event (after registering Event and install event is triggered)

// The activate event will fire when the install event is complete and the service worker
// is activating at this point but it's not controlling any pages.

// The active event is the perfect event to clear up old cache because at this point the
// service worker was already installed so the new cache should have been created and there is no need
// for the old cache.

self.addEventListener("activate", (e) => {
  // Clear up old cache or do other things during the activate event.
  // Becuase this process may take some time, make sure to use event.WaitUntil()
  // this will prevent new event going to the servcie worker until this process is completed.

  e.waitUntil(
    // Get all keys from the cache
    caches.keys().then((cachNames) => {
      return Promise.all(
        // using map delete all old cache via cachName
        cachNames.map((cacheName) => {
          if (cacheName !== cacheVersion) {
            console.log("Service worker clearing all old cache");
            caches
              .delete(cacheName)
              .then(() => console.log(`${cacheName} successfully deleted`))
              .catch(() => console.log(`error in deleting cache - ${err}`));
          }
        })
      );
    })
  );
  console.log("Service worker Activated", e);
});

// This service worker code will intercept all fetch requests.
// It will then respond with the cached response if one is found, if not it will fetch the data using the fetch API.
self.addEventListener("fetch", function (event) {
  event.respondWith(
    // Serach all chache for a request URL that matches the one served up from the fetch.
    caches.match(event.request).then(function (response) {
      // If a response exists return that, otherwise return fetch(event.request).
      // Since fetch returns a promise, it's ok to return that because it's a promise within a promise. The || operator is the OR operator.
      // If the first statemnt is true it stops running, if it's not it goes to check the next statement.
      return response || fetch(event.request);
    })
  );
});
