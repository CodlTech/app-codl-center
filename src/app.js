"use strict"
/**
 * Codl.link
 */
const { xeach, xassoc } = require("@kisbox/helpers")
const { capitalize, stringToHtml } = require("./helpers")

const Application = require("./lib/application")
const Api = require("./model/api")
const ApiTab = require("./view/api-tab")
const FloatingButton = require("./view/lib/floating-button")

/* Assets */

const specs = require("./data/specs")
const arrowUpSvg = require("feather-icons/dist/icons/arrow-up.svg")

/* Definition */

class CodlCenter extends Application {
  constructor (params) {
    super(`
<header>%navigation</header>

<main>%tabView</main>

%scrollUpButton

<footer class="flex two">
  <a target="_blank" rel="noopener" href="https://github.com/ava-labs/avalanche-docs">
    Documentation © 2020 Avalabs
  </a>
  <a target="_blank" rel="noopener" href="https://github.com/codltech/app-codl-center">
    Application © 2020 MisterTicot
  </a>
</footer>
  `)

    /* Constants */
    this.title = "Codl.center"
    this.logo = "icons/transparent.svg"

    /* Imports */
    this.apis = xassoc(specs, (data) => Api.fromData(data))

    /* Tabs */
    xeach(this.apis, (api, id) => {
      const title = capitalize(id)
      const view = new ApiTab(api)
      this.tabs.push({ title, id, view })
    })

    /* Components */
    this.scrollUpButton = new FloatingButton({
      content: stringToHtml(arrowUpSvg),
      action: () => {
        scrollTo(0, 0)
        this.scrollUpButton.domNode.blur()
      }
    })

    /* Initialize */
    this.$import(params, ["tabId"])
    if (!this.tabView) {
      this.tabId = "info"
    }
  }
}

/* Events */
const proto = CodlCenter.prototype

proto.$on("tabId", function () {
  this.hash = null
})

/* Export */
module.exports = CodlCenter
