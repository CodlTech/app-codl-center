"use strict"
/**
 * MethodsToc (Table of Content)
 * */
const { View } = require("@kisbox/browser")

/* Definition */

class MethodsToc extends View {
  constructor (params) {
    super(`
<div class="MethodsToc" %hidden>
  <strong>%title</strong>
  <ul class>
    ...%methodLinks
  </ul>
</div>
    `)

    /* Import */
    this.$import(params, ["title", "methods"])
  }
}

/* Computations */
const proto = MethodsToc.prototype

proto.$define("hidden", ["methods"], function () {
  return !this.methods.length
})

proto.$define("methodLinks", ["methods"], function () {
  return this.methods.map((method) => {
    return new MethodsToc.Link(method)
  })
})

/* Export */
module.exports = MethodsToc
MethodsToc.Link = require("./methods-toc.link")
