"use strict"
/**
 * FloatingButton
 * */
const { View } = require("@kisbox/browser")

/* Definition */

class FloatingButton extends View {
  constructor (params) {
    super(`
<button class="FloatingButton button" %onclick>
  <span>%content</span>
</button>
    `)

    /* Imports */
    this.$import(params, ["content", "action"])
  }

  onclick () {
    if (!this.action) return
    this.action()
  }
}

/* Exports */
module.exports = FloatingButton
