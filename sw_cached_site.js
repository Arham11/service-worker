// this files caches pages at individual level

// this keeps different version what we want
const cacheVersion = "v1";

// Install Event (after registering Event is triggered)
// When a browser runs a service worker for the first time, an install event is fired within it.
// The install event is the perfect place to save things to the cache.
// The following code will run when the install event is fired.
// It will wait until all of the the pages
// (main page "/" "index.html", "about.html", "/css/style.css", "/js/main.js",) get added to the cache.
self.addEventListener("install", (e) => {
  console.log("Service worker Installed", e);
});

// Activate Event (after registering Event and install event is triggered)
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

// Call Fetch Event
self.addEventListener("fetch", (e) => {
  console.log("Service Worker: Fetching");
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // Make copy/clone of response
        const resClone = res.clone();
        // Open cahce
        caches.open(cacheVersion).then((cache) => {
          // Add response to cache
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch((err) => caches.match(e.request).then((res) => res))
  );
});
