"use strict"
/**
 * MethodCard
 * */
const { View } = require("@kisbox/browser")
const { markdownToHtml } = require("../helpers")

const MethodForm = require("./method-form")
const MethodSnippets = require("./method-snippets")
const ShareLink = require("./lib/share-link")

/* Definition */

class MethodCard extends View {
  constructor (method) {
    super(`
<section class="MethodCard card">
  <a name=%id></a><a name=%avadocsId></a>

  <header onclick=%logMe>
    <h3>%id</h3>
    %shareLink
  </header>

  <p>%prettyDescription</p>
  %snippets

  <footer>
    %form
    <ul hidden=%noNotes>
      ...%notesLi
    </ul>
  </footer>

</section>
    `)

    /* Imports */
    this.method = method
    this.$pick(method, ["id", "description", "notes", "arguments"])

    /* Components */
    this.shareLink = new ShareLink({
      title: `Share this method card`,
      url: this.cardUrl
    })
    this.form = new MethodForm(method)
    this.snippets = new MethodSnippets(method)

    /* Event */
    this.$listen(this.form, "submit", () => this.snippets.run())
  }

  logMe () {
    // eslint-disable-next-line no-console
    console.log(this)
  }
}

MethodCard.baseUrl = location.href.split(/[?#]/)[0]

/* Computations */
const proto = MethodCard.prototype

proto.$define("noFormals", ["arguments"], (the) => {
  return the.arguments.length === 0
})

proto.$define("noNotes", ["arguments"], (the) => {
  return the.notes.length === 0
})

proto.$define("avadocsId", ["id"], (the) => {
  return the.id.replace(".", "-").toLowerCase()
})

proto.$define("apiId", ["id"], (the) => {
  return the.id.split(".")[0]
})

proto.$define("cardUrl", ["id", "apiId"], (the) => {
  return `${MethodCard.baseUrl}?tabId=${the.apiId}#${the.id}`
})

proto.$define("prettyDescription", ["description", "apiId"], (the) => {
  const markdown = rewriteMethodLinks(the.description, the.apiId)
  return markdownToHtml("div", markdown)
})

proto.$define("notesLi", ["notes"], (the) => {
  return the.notes.map((note) => {
    return markdownToHtml("li", note)
  })
})

/* Helpers */

function rewriteMethodLinks (string, apiId) {
  const avaDocs = "https://docs.avax.network"
  const avaApis = `${avaDocs}/build/avalanchego-apis`
  const avaDeprecated = `${avaApis}/deprecated-api-calls`

  // ](deprecated-api-calls.md#
  const stxDeprecatedLink = /]\(deprecated-api-calls.md#/g
  // ]($api-pagename#$methodId)
  const stxMethodLink = /]\(([^/)-]+)[^/)]*#([^)]+)\)/g
  // `$apiId.$methodId`
  const stxMethodId = new RegExp(`\`(${apiId}\\.\\w+)\``, "g")
  return string
    .replace(stxDeprecatedLink, `](${avaDeprecated}#`)
    .replace(stxMethodLink, "](?tabId=$1#$2)")
    .replace(stxMethodId, "[`$1`](#$1)")
}

/* Export */
module.exports = MethodCard
