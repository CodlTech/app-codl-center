"use strict"
/**
 * String Helper
 */
const helpers = exports

/* Library */

helpers.capitalize = function (string) {
  return string.substr(0, 1).toUpperCase() + string.slice(1)
}
