"use strict"
/**
 * Method Form
 * */
const { View } = require("@kisbox/browser")
const { xmap } = require("@kisbox/helpers")

/* Definition */

class MethodForm extends View {
  constructor (method) {
    super(`
<form class="MethodForm flex two-500 three-800" onsubmit="return false">
  ...%inputs
  %nodeInput
  %chainInput
  <button hidden onclick=%checkAndSubmit>
</form>
    `)

    /* Imports */
    this.method = method
    this.$pick(method, ["formals", "actuals"])

    /* Components */
    this.nodeInput = MethodForm.Input.forParam(this.method, "node", "string")
    if (method.chain) {
      this.chainInput = MethodForm.Input.forParam(
        this.method,
        "chain",
        "string"
      )
    }
  }

  checkAndSubmit () {
    const form = this.domNode
    if (!form.checkValidity()) return

    this.submit()
  }

  /* Events */
  submit () {}
}

/* Computations */
const proto = MethodForm.prototype

proto.$define("inputs", ["formals", "actuals"], (the) => {
  return xmap(the.actuals, (_, key) => {
    const formal = the.formals[key]
    return MethodForm.Input.forParam(the.actuals, key, formal)
  })
})

/* Export */
MethodForm.Input = require("./method-form.input")
module.exports = MethodForm
