"use strict"
/**
 * MethodSnippets
 * */
const { View } = require("@kisbox/browser")
const { stringToHtml } = require("../helpers")

/* Assets */

const playSvg = require("feather-icons/dist/icons/play.svg")

/* Definition */

class MethodSnippets extends View {
  constructor (method) {
    const idPrefix = counter("method-snippet-tab-")
    super(`
<div class="MethodSnippets">
  <a name=""></a>

  <form>
    <label class="pseudo button toggle" for="${idPrefix}-1">Signature</label>
    <label class="pseudo button toggle" for="${idPrefix}-2">Curl</label>
    <label class="pseudo button toggle" for="${idPrefix}-3">Axios (JS)</label>
    <label class="button toggle" for="${idPrefix}-4">%{playIcon} Run</label>
  </form>

  <div class="tabs four">

    <input id="${idPrefix}-1" type="radio" $group="tabId" value="signature">
    <input id="${idPrefix}-2" type="radio" $group="tabId" value="curl"
      checked>
    <input id="${idPrefix}-3" type="radio" $group="tabId" value="axios">
    <input id="${idPrefix}-4" type="radio" $group="tabId" value="response"
      onclick=%run>

    <div class="row stacked" ondblclick=%selectValue onclick=%maybeSelectCode>
      <pre>%signature</pre>
      <pre>%curlCode</pre>
      <pre>%axiosCode</pre>
      <pre>%prettyResponse</pre>
    </div>

  </div>
</div>
    `)

    this.idPrefix = idPrefix

    /* Asset */
    this.playIcon = stringToHtml(playSvg)

    /* Defaults */
    this.node = "127.0.0.1:9650"

    /* Imports */
    this.method = method
    this.$pick(method, ["id", "signature", "actuals"])
    this.$import(method, ["path", "response"])

    /* Events */
    this.actuals.$on("$change", () => {
      this.$trigger("actuals")
    })
  }

  run () {
    this.method.run()
    this.selectTab(4)
    this.scrollIntoView()
  }

  selectTab (number) {
    const radioId = `#${this.idPrefix}-${number}`
    this.$ref(radioId).checked = true
  }

  scrollIntoView () {
    const anchor = this.$ref("a[name]")
    const position = anchor.getBoundingClientRect()
    if (position.top >= 0) return

    anchor.scrollIntoView()
  }

  scrollUpCode () {
    const tabs = this.$ref(".tabs")
    tabs.scrollTo(0, 0)
  }

  /**
   * Select the whole quoted section (ex.: X-chain address)
   */
  selectValue () {
    const selection = getSelection()
    if (!selection.rangeCount) return

    const range = selection.getRangeAt(0)
    const { startContainer, startOffset, endOffset } = range

    const quotes = startContainer.textContent.matchAll(/"[^"]+"/g)
    for (const match of quotes) {
      const quote = match[0]
      const startAt = match.index
      const endAt = startAt + quote.length
      if (startAt < startOffset && endAt > endOffset) {
        range.setStart(startContainer, startAt + 1)
        range.setEnd(startContainer, endAt - 1)
        return
      } else if (startAt > endOffset) {
        return
      }
    }
  }

  maybeSelectCode (event) {
    if (event.detail !== 3) return

    const selection = getSelection()
    if (!selection.rangeCount) return

    const range = selection.getRangeAt(0)
    const container = range.startContainer
    range.setStart(container, 0)
    range.setEnd(container, container.length)
  }
}

/* Computations */

const proto = MethodSnippets.prototype

proto.$define("curlActuals", ["actuals"], (the) => {
  const base = JSON.stringify(the.actuals, null, 2)
  const indented = base.replace(/^/gm, "  ").substr(2)
  return indented
})

proto.$define("curlPath", ["path"], (the) => {
  return the.path.replace("http://", "")
})

proto.$define("curlCode", ["id", "curlActuals", "curlPath"], (the) => {
  return `\
curl -X POST --data '{
  "jsonrpc": "2.0",
  "id"     : 1,
  "method" : "${the.id}",
  "params" : ${the.curlActuals}
}' -H 'content-type:application/json;' ${the.curlPath}
`
})

proto.$define("axiosActuals", ["curlActuals"], (the) => {
  const unquoted = the.curlActuals.replace(/"(\w*)":/g, "$1:")
  return unquoted
})

proto.$define("axiosCode", ["path", "id", "axiosActuals"], (the) => {
  return `\
const path = "${the.path}"
const response = await axios.post(path, {
  jsonrpc: "2.0",
  id: 1,
  method: "${the.id}",
  params: ${the.axiosActuals}
})
`
})

proto.$customDefine("prettyResponse", ["response"], (the) => {
  if (the.response instanceof Promise) {
    return "Pending..."
  }

  const message = the.response.message || the.response.data
  return JSON.stringify(message, null, 2)
})

/* Events */

proto.$on("tabId", function () {
  this.scrollUpCode()
})

proto.$on(["curlCode", "axiosCode"], function () {
  const isCodeVisible = this.tabId === "curl" || this.tabId === "axios"
  if (isCodeVisible) return

  this.selectTab(2)
})

/* Helpers */

function counter (prefix) {
  counter.count++
  return `${prefix}${counter.count}`
}

counter.count = 0

/* Export */
module.exports = MethodSnippets
