"use strict"
/**
 * Navigation
 * */

const { View, html } = require("@kisbox/browser")
const CrudArray = require("./crud-array")

/* Definition */

class Navigation extends View {
  constructor (params) {
    super(`
<nav class="Navigation">
  <span class="brand">
    %logoImg
    <h1>%title</h1>
  </span>

  <!-- responsive -->
  <input id="bmenub" type="checkbox" class="show">
  <label for="bmenub" class="burger pseudo button">Menu</label>

  <div class="menu">
    %toNavigationLink:...tabs
  </div>
</nav>
    `)

    /* Defaults */
    this.query = ""

    /* Imports */
    this.$import(params, ["title", "logo"])

    /* Components */
    this.tabs = new CrudArray()
    this.tabs.$forEach((tab) => this.listenQuery(tab))

    /* Events */
    this.$on("tabView", () => this.refreshQuery())
  }

  listenQuery (tab) {
    const queryHandler = () => this.refreshQuery(tab.view)
    this.$listen(tab.view, "query", queryHandler)
  }

  refreshQuery (view = this.tabView) {
    if (view !== this.tabView) return

    let query = `?tabId=${this.tabId}`
    if (view.query && view.query.length > 1) {
      query += `&${view.query.substr(1)}`
    }
    this.query = query
  }
}

/* Helpers */
const helpers = Navigation.helpers

helpers.toNavigationLink = function (tab) {
  return html("label", null, [
    html("input", { type: "radio", name: "nav" }),
    html("span", {
      className: "toggle pseudo button",
      textContent: tab.title,
      onclick: () => {
        this.tabId = tab.id
        scrollTo(0, 0)
      }
    })
  ])
}

/* Computations */
const proto = Navigation.prototype

proto.$define("logoImg", ["logo"], function () {
  if (!this.logo) return
  return html("img", { src: this.logo, className: "logo" })
})

proto.$define("tabView", ["tabId", "tabs"], function () {
  const tab = this.tabs.find((t) => t.id === this.tabId)
  if (!tab) return

  if (typeof tab.view === "function") {
    return tab.view()
  } else {
    return tab.view
  }
})

/* Export */
module.exports = Navigation
