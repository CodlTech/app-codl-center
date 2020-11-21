"use strict"
/**
 * Method
 * */
const { LiveObject } = require("@kisbox/model")
const { type } = require("@kisbox/utils")
const { xeach } = require("@kisbox/helpers")

const axios = require("axios")

/* Configuration */

const SHARED = {
  username: "bob",
  password: "creme fraiche",
  node: "http://127.0.0.1:9650"
}

/* Definition */

class Method extends LiveObject {
  constructor (params) {
    super()

    /* Defaults */
    this.formals = {}
    this.returns = {}
    this.example = {}
    this.notes = []
    this.response = undefined
    this.shared = Method.shared

    /* Imports */
    this.$import(this.shared, ["node"])
    this.$pick(params, [
      "id",
      "endpoint",
      "description",
      "signature",
      "formals",
      "returns",
      "example",
      "notes",
      "shared"
    ])
  }

  run () {
    this.response = axios.post(this.path, {
      jsonrpc: "2.0",
      id: 1,
      method: this.id,
      params: this.actuals
    })
  }
}

/* Class-wide Shared State */

Method.shared = new LiveObject()
Object.assign(Method.shared, SHARED)
Method.shared.$trap(Object.keys(SHARED))

/* Events */
Method.prototype.$on({
  response () {
    if (type(this.response) !== "object") return
    if (this.response.data.error) return

    this.shared.$pick(this.actuals, ["username", "password"])
    this.shared.$pick(this, ["node"])
  }
})

/* Computations */
const proto = Method.prototype

proto.$define("path", ["node", "endpoint"], (the) => {
  if (!the.node) return the.endpoint.substr(1)

  const defaultProtocol = the.node.match(/^http(s)?:\/\//) ? "" : "https://"
  return `${defaultProtocol}${the.node}${the.endpoint}`
})

proto.$define("arguments", ["formals"], (the) => {
  return Object.keys(the.formals)
})

proto.$define("isPrivate", ["arguments"], (the) => {
  return (
    the.arguments.includes("password") || the.arguments.includes("oldPassword")
  )
})

proto.$define("actuals", ["example", "arguments"], (the) => {
  const actuals = new LiveObject()
  actuals.$trap(the.arguments)
  actuals.$pick(the.example, the.arguments)
  actuals.$import(the.shared, the.arguments)
  return actuals
})

/* Export */
module.exports = Method
