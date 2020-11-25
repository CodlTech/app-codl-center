"use strict"
/**
 * MethodFormInput
 **/
const { View } = require("@kisbox/browser")
const { dispatch } = require("@kisbox/helpers")
const { capitalize } = require("../helpers")

/* Constants */

// const stxIsArray = "(?<isArray>\\[\\])"
const stxType = "(?<type>(\\[\\])?\\w+)"
const stxIsOptional = "(?<isOptional>\\?)"
const stxFormal = `^${stxIsOptional}?${stxType}$`

/* Definition */

class MethodFormInput extends View {
  static forParam (params, key, formal) {
    const label = capitalize(key)
    const specs = this.formalToSpecs(formal)
    const input = new this({ label, ...specs })
    input.$pull("value", params, key, specs.pull)
    input.$push("value", params, key, specs.push)
    return input
  }

  static formalToSpecs (formal) {
    const matches = formal.match(stxFormal)
    const base = matches.groups
    const specs = dispatch(MethodFormInput.types, base.type)
    Object.assign(base, specs)
    return base
  }

  constructor (params) {
    if (params.type === "textarea") {
      super(`
<label class="full first">
  <span>%label:</span>
  <span hidden=%required>Optional</span>
  <textarea %placeholder value=%value rows=5></textarea>
</label>
        `)
    } else {
      super(`
<label>
  <span>%label:</span>
  <span hidden=%required>Optional</span>
  <input %type %placeholder value=%value %step %required>
</label>
      `)
    }

    /* Imports */
    this.$pick(params, ["label", "type", "placeholder", "step", "isOptional"])

    /* Computations */
    this.required = !this.isOptional
  }
}

/* Configuration */
MethodFormInput.$inputDelay = 40
/* Types */

MethodFormInput.types = {
  float: {
    type: "number",
    placeholder: "Number",
    push: (x) => +x
  },
  int: {
    type: "number",
    placeholder: "Integer",
    step: 0,
    push: (x) => isNaN(x) ? null : +x
  },
  object: {
    type: "textarea",
    placeholder: "JSON of an object",
    pull: (x) => x && stringifyObject(x),
    push: (x) => x && JSON.parse(x)
  },
  string: {
    type: "text",
    placeholder: "String"
  },
  "[]string": {
    type: "text",
    placeholder: "Comma-separated strings",
    pull: (x) => x && x.join(", "),
    push: (x) => x ? x.split(/, */) : null
  },
  "[]object": {
    type: "textarea",
    placeholder: "JSON of an array of objects",
    pull: (x) => x && stringifyObjectArray(x),
    push: (x) => x && JSON.parse(x)
  }
}

/* Helpers */

function stringifyObjectArray (array) {
  const base = stringifyObject(array)
  const pretty = base
    .replace(/^\[\n\s\s{/, "[{")
    .replace(/},\n\s\s{/, "}, {")
    .replace(/\s\s}\n]/, "}]")
  return pretty
}

function stringifyObject (object) {
  return JSON.stringify(object, null, 2)
}

/* Export */
module.exports = MethodFormInput
