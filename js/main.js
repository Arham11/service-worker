// to check if service workers are supported
// register service worker from main.js as this is the common file for all pages
// Tells the browser where your service worker is located, and to start installing it in the background.

if (!("serviceWorker" in navigator)) {
  console.log("Service worker not supported");
} else {
  navigator.serviceWorker
    .register("../sw_cached_site.js")
    .then((req) => console.log("Service Worker: Registered (Pages) ---", req))
    .catch((err) => console.log("error in registration ---", err));
}
