"use strict"

const ServiceWorker = require("@kisbox/service-worker")
const pkg = require("../package.json")

new ServiceWorker(pkg.name, pkg.version, "verbose")
  .fromCache([
    // Application
    "index.css",
    "index.html",
    "index.js",

    // Vendor configuration
    "browserconfig.xml",
    "manifest.json",

    // Icons
    "favicon.ico",
    "icons/16x16.png",
    "icons/32x32.png",
    "icons/192x192.png",
    "icons/512x512.png",
    "icons/apple-touch.png",
    "icons/mstile.png",
    "icons/safari.svg",
    "icons/transparent.svg"
  ])
  .precache()
  .register()
