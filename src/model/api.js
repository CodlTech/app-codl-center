"use strict"
/**
 * Api
 * */
const { LiveObject } = require("@kisbox/model")
const { wrap } = require("@kisbox/helpers")

const Method = require("./method")

/* Definition */
class Api extends LiveObject {
  static fromData (data) {
    const params = wrap(data, {
      methods: data.methods.map((x) => new Method(x))
    })
    sortMethods(params.methods)

    return new Api(params)
  }

  constructor (params) {
    super()

    /* Imports */
    this.$pick(params, ["id", "name", "description", "methods"])
  }
}

/* Computations */
const proto = Api.prototype

proto.$define("methodsPublic", ["methods"], function () {
  return this.methods.filter((x) => !x.isPrivate)
})

proto.$define("methodsPrivate", ["methods"], function () {
  return this.methods.filter((x) => x.isPrivate)
})

/* Helpers */

function sortMethods (methods) {
  methods.sort((a, b) => {
    if (a.isPrivate === b.isPrivate) {
      return a.id.localeCompare(b.id)
    } else {
      return a.isPrivate ? 1 : -1
    }
  })
}

/* Export */
module.exports = Api
