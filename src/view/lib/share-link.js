"use strict"
/**
 * ShareLink
 * */
const { View, html } = require("@kisbox/browser")
const { timeout } = require("@kisbox/helpers")
const { stringToHtml } = require("../../helpers")

/* Assets */

const shareIcon = require("feather-icons/dist/icons/share-2.svg")

/* Definition */

class ShareLink extends View {
  constructor (params) {
    super(`
<div class="ShareLink">
  <span class=%state>Link copied!</span>
  <a %onclick %title>%shareSvg</a>
</div>
`)
    /* Default */
    this.state = null
    this.title = "Share this"

    /* Imports */
    this.$import(params, ["title", "url"])

    /* Components */
    this.shareSvg = stringToHtml(shareIcon)
  }

  async onclick () {
    if (this.state) return

    const url = this.url || location.href

    if (navigator.share) {
      navigator.share({
        title: this.title,
        url
      })
    } else {
      html.copyString(url)
      this.state = "activated"
      await timeout(2000)
      this.state = null
    }
  }
}

/* Export */
module.exports = ShareLink
