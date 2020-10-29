"use strict"
/**
 * MethodsTocLink
 * */
const { View } = require("@kisbox/browser")

/* Definition */

class MethodsTocLink extends View {
  constructor (method) {
    super(`
<li>
  <a %href>%id</a>
</li>
    `)

    /* Import */
    this.$import(method, ["id"])
  }
}

/* Computations */
const proto = MethodsTocLink.prototype

proto.$define("href", ["id"], function () {
  return `#${this.id}`
})

/* Export */
module.exports = MethodsTocLink
