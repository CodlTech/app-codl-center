"use strict"
/**
 * ApiTabMethodsSection
 * */
const { View } = require("@kisbox/browser")
const MethodCard = require("./method-card")

/* Definition */

class MethodsSection extends View {
  constructor (params) {
    super(`
<section class="MethodSection" %hidden>
  <h2>%title</h2>
  ...%methodCards
</section>
    `)

    /* Imports */
    this.$import(params, ["title", "methods"])
  }
}

/* Computations */
const proto = MethodsSection.prototype

proto.$define("hidden", ["methods"], function () {
  return !this.methods.length
})

proto.$define("methodCards", ["methods"], function () {
  return this.methods.map((x) => new MethodCard(x))
})

/* Export */
module.exports = MethodsSection
