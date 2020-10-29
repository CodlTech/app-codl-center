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
  password: "creme fraiche"
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
    this.node = "127.0.0.1:9650"
    this.response = undefined
    this.shared = Method.shared

    /* Imports */
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
    this.response = axios.post(this.pathLong, {
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
  }
})

/* Computations */
const proto = Method.prototype

proto.$define("pathShort", ["node", "endpoint"], (the) => {
  return `${the.node}${the.endpoint}`
})

proto.$define("pathLong", ["pathShort"], (the) => {
  if (the.pathShort.match(/^http(s):/)) {
    return the.pathShort
  } else {
    return `http://${the.pathShort}`
  }
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

  xeach(the.arguments, (key) => {
    if (!(key in the.shared)) return
    actuals.$import(the.shared, key)
  })

  return actuals
})

/* Export */
module.exports = Method
