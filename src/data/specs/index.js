"use strict"
/**
 * All Avalanche API Methods
 * */
module.exports = {
  admin: require("./admin"),
  auth: require("./auth"),
  avm: require("./avm"),
  health: require("./health"),
  info: require("./info"),
  ipc: require("./ipc"),
  keystore: require("./keystore"),
  platform: require("./platform")
}