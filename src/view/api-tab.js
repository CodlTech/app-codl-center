"use strict"
/**
 * ApiTab
 * */
const { View } = require("@kisbox/browser")
const { markdownToHtml } = require("../helpers")

const MethodsToc = require("./methods-toc")
const MethodsSection = require("./methods-section")

/* Definition */

class ApiTab extends View {
  constructor (api) {
    super(`
<section class="Tab">

  <header>
    %publicToc
    %privateToc
    <strong>Description</strong>
    %prettyDescription
  </header>

  %publicSection
  %privateSection

</section>
    `)

    /* Imports */
    this.api = api
    this.$import(api, ["description", "methodsPublic", "methodsPrivate"])
  }
}

/* Computations */
const proto = ApiTab.prototype

proto.$define("publicToc", ["methodsPublic"], function () {
  return new MethodsToc({
    title: "Public API",
    methods: this.methodsPublic
  })
})

proto.$define("privateToc", ["methodsPrivate"], function () {
  return new MethodsToc({
    title: "Private API",
    methods: this.methodsPrivate
  })
})

proto.$define("prettyDescription", ["description"], function () {
  return markdownToHtml("div", this.description)
})

proto.$define("publicSection", ["methodsPublic"], function () {
  return new MethodsSection({
    title: "Public API",
    methods: this.methodsPublic
  })
})

proto.$define("privateSection", ["methodsPrivate"], function () {
  return new MethodsSection({
    title: "Private API",
    methods: this.methodsPrivate
  })
})

/* Export */
module.exports = ApiTab
