"use strict"
/**
 * $cache
 */
const { $memoizer } = require("@kisbox/helpers")

/* Definition */

const $scope = $memoizer("/cache/")

function $cache (root, key, thunk) {
  const scope = $scope(root)
  const realKey = wantString(key)
  if (!scope[realKey]) scope[realKey] = thunk()
  return scope[realKey]
}

/* Helpers */

function wantString (params) {
  if (typeof params === "string") {
    return params
  } else {
    return JSON.stringify(params)
  }
}

/* Export */
module.exports = $cache
