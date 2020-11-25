"use strict"
/**
 * Api
 * */
const { LiveObject } = require("@kisbox/model")
const { wrap } = require("@kisbox/helpers")
const $cache = require("../lib/cache")

const Method = require("./method")

/* Definition */

class Api extends LiveObject {
  static fromData (data) {
    const params = wrap(data, {
      methods: data.methods.map((x) => new Method(x))
    })
    params.methods.forEach((method) => {
      method.shareParams(Api.getGlobalParams())
      method.shareParams(Api.getApiParams(params.id))
    })
    sortMethods(params.methods)

    return new Api(params)
  }

  static getGlobalParams () {
    return $cache(this, "globalParams", () => {
      return toLiveObject(Api.globalParams)
    })
  }

  static getApiParams (api) {
    return $cache(this, `apiParams:${api}`, () => {
      return toLiveObject(Api.apiParams)
    })
  }

  constructor (params) {
    super()

    /* Imports */
    this.$pick(params, ["id", "name", "description", "methods"])
  }
}

/* Class-wide values */

Api.globalParams = {
  assetID: "AVAX",
  encoding: "cb58",

  username: "bob",
  password: "creme fraiche",
  node: "http://127.0.0.1:9650"
}

Api.apiParams = {
  address: undefined,
  blockchainID: "11111111111111111111111111111111LpoYY",
  changeAddr: null,
  from: null,
  nodeID: undefined,
  sourceChain: undefined,
  subnetID: null,

  chain: undefined
}

/* Computations */
const proto = Api.prototype

proto.$define("methodsPublic", ["methods"], function () {
  return this.methods.filter((x) => !x.isPrivate)
})

proto.$define("methodsPrivate", ["methods"], function () {
  return this.methods.filter((x) => x.isPrivate)
})

/* Helpers: specialized */

function sortMethods (methods) {
  methods.sort((a, b) => {
    if (a.isPrivate === b.isPrivate) {
      return a.id.localeCompare(b.id)
    } else {
      return a.isPrivate ? 1 : -1
    }
  })
}

/* Helpers: generic */

function toLiveObject (params) {
  const live = new LiveObject()
  Object.assign(live, params)
  return live
}

/* Export */
module.exports = Api
