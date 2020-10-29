"use strict"
/**
 * Application initialization
 */
const CodlCenter = require("./app")

/* Initialization */

// Service worker
const worker = navigator.serviceWorker
if (worker) {
  worker.register("worker.js")
  worker.addEventListener("controllerchange", () => location.reload())
}

// App Loading
const app = CodlCenter.forLocation(location)
app.$mount()

// eslint-disable-next-line no-console
console.log("Application:", app)

// Address syncing
app.$on("route", () => history.replaceState(null, null, `/${app.route}`))
app.$trigger("route")
