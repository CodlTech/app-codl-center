"use strict"
/**
 * All Avalanche API Methods
 * */
module.exports = {
  admin: require("./admin"),
  auth: require("./auth"),
  contract: require("./contract"),
  exchange: require("./exchange"),
  health: require("./health"),
  info: require("./info"),
  ipc: require("./ipc"),
  keystore: require("./keystore"),
  platform: require("./platform")
}
