"use strict"
/**
 * URL helpers
 * */
const helpers = exports

/* Library */

helpers.extractPagename = function (url) {
  return url.replace(/^[^?#]*\//, "").replace(/[?#].*/, "")
}

helpers.extractQuery = function (url) {
  return url.replace(/^[^?]*/, "").replace(/#.*/, "")
}

helpers.extractHash = function (url) {
  return url.replace(/^[^#]*#*/, "")
}

helpers.extractHashname = function (hash) {
  return helpers.exctractPagename(hash.subsrt(1))
}
