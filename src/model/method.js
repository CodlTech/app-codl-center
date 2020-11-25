"use strict"
/**
 * Method
 * */
const { LiveObject } = require("@kisbox/model")
const { xeach } = require("@kisbox/helpers")

const axios = require("axios")

/* Definition */

class Method extends LiveObject {
  constructor (params) {
    super()

    /* Defaults */
    this.example = {}
    this.formals = {}
    this.node = "http://127.0.0.1:9650"
    this.notes = []
    this.response = undefined
    this.returns = {}

    /* Imports */
    this.$pick(params, [
      "id",
      "endpoint",
      "description",
      "signature",
      "formals",
      "returns",
      "example",
      "node",
      "notes"
    ])

    /* Computations */
    this.setupEndpoint()
  }

  setupEndpoint () {
    if (!this.endpoint) return

    const rgxBcEndpoint = /^\/ext\/bc\/(?<chain>\w+)(?<tail>\/.*)?/
    const matched = this.endpoint.match(rgxBcEndpoint)
    if (!matched) return
    if (matched.groups.chain === "P") return

    this.chain = matched.groups.chain
    this.endpointTail = matched.groups.tail || ""
  }

  run () {
    this.response = axios.post(this.path, {
      jsonrpc: "2.0",
      id: 1,
      method: this.id,
      params: this.actuals
    })
  }

  shareParams (shared) {
    xeach(shared, (value, key) => {
      if (value !== undefined) return
      shared[key] = key in this.formals ? this.actuals[key] : this[key]
    })

    this.actuals.$import(shared, this.arguments)
    shared.$import(this.actuals, Object.keys(shared))

    if ("node" in shared) {
      this.$link(shared, "node")
    }
    if ("chain" in shared && this.chain) {
      this.$link(shared, "chain")
    }
  }
}

/* Computations */
const proto = Method.prototype

proto.$define("endpoint", ["chain", "endpointTail"], (the) => {
  return `/ext/bc/${the.chain || "?"}${the.endpointTail}`
})

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
  return actuals
})

/* Export */
module.exports = Method
