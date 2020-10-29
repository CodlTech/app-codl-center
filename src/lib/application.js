"use strict"
/**
 * Generic Application View
 **/
const { View } = require("@kisbox/browser")
const { extractQuery, extractHash } = require("../helpers")

const Parameters = require("./parameters")
const Navigation = require("./navigation")

/* Definition */

class Application extends View {
  static forLocation (location) {
    const url = String(location)
    const query = extractQuery(url)
    const params = Parameters.fromQuery(query)
    const app = new this(params)
    app.hash = extractHash(url)
    return app
  }

  constructor (template) {
    super(`
<div class="Application">
  ${template}
</div>
`)

    /* Default */
    this.title = null
    this.logo = null

    /* Navigation */
    this.navigation = new Navigation(this)
    this.navigation.$link(this, ["tabView", "tabId"])

    this.$import(this.navigation, ["query"])
    this.tabs = this.navigation.tabs
  }
}

/* Defaults */
const proto = Application.prototype
proto.hash = ""
proto.query = ""

/* Computations */

proto.$define("route", ["query", "hash"], function () {
  return this.hash ? `${this.query}#${this.hash}` : `${this.query}`
})

/* Export */
module.exports = Application
