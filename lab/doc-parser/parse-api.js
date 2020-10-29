"use strict"
/**
 * parseMethod
 * */
const { xassoc } = require("@kisbox/helpers")

/* Constants */
const avaDocs = "https://docs.avax.network"
const avaReferences = `${avaDocs}/build/references`
const avaTutorials = `${avaDocs}/build/tutorials/smart-digital-assets`

/* Definition */

function parseApi (id, doc) {
  const sections = splitByHeading("## ", doc)
  const methodsSection = pickMethodsSection(sections)
  if (!methodsSection) return

  const name = pickGroup(sections[0], /# *([^\n]*)/)
  const description = sections[0]
    .replace(/^#[^\n]*\n\n/, "")
    .replace(/\n/g, "\\n")
    .replace(/\.\.\/references\/([^\s]*)\.md/, `${avaReferences}/$1`)

  const methodsDoc = splitByHeading("### ", methodsSection).slice(1)
  const methods = methodsDoc.map(parseMethod)

  return {
    id,
    name,
    description,
    methods
  }
}

function pickMethodsSection (sections) {
  if (sections.length === 1) {
    return sections[0]
  } else {
    return sections.find((s) => s.match(/^(API )?Methods/))
  }
}

function parseMethod (str) {
  const sectionsAndTitles = str.split(/\n\n+/)

  // Sometimes, description is made of several paragraph
  for (let i = 2; i < sectionsAndTitles.length; i++) {
    const prefix = sectionsAndTitles[i].substr(0, 3)
    if (prefix === "###" || prefix === "```") break

    sectionsAndTitles[1] += `\n\n${sectionsAndTitles[i]}`
    sectionsAndTitles[i] = "#" // Gets filtered out just after
  }

  // Sometimes, there's another section before signature (e.g: avm.buildGenesis)
  for (let i = 2; i < sectionsAndTitles.length; i++) {
    if (sectionsAndTitles[i].match("#### Signature")) break
    sectionsAndTitles[i] = "#" // Gets filtered out just after
  }

  const sections = sectionsAndTitles.filter((x) => x[0] !== "#")

  if (sections[3][0] !== "*") {
    if (sections[4][0] === "*") {
      // Sometimes, "Notes" is shifted (TODO: is it still the case?)
      sections.splice(3, 1)
    } else {
      // Sometimes, "Notes" is missing.
      sections.splice(3, 0, "")
    }
  }

  const doc = {
    method: sections[0],
    description: sections[1],
    signature: sections[2],
    notes: sections[3],
    example: sections[4],
    response: sections[5]
  }

  // avm.buildGenesis needs specific logic
  if (doc.method === "avm.buildGenesis") {
    doc.example = sections[7]
    doc.response = sections[8]
  }

  // Sometimes, example is buggy.
  if (!doc.example.match(/^```/)) {
    doc.example = doc.response
  }

  return xassoc(fieldParser, (parser) => {
    try {
      return parser(doc)
    } catch (error) {
      console.error("Error with documentation:", doc)
      console.error(error)
      return `/!/ Error: ${error.message} /!/`
    }
  })
}

/* Method Field Parsers */

const fieldParser = {}

fieldParser.id = function (doc) {
  return doc.method
}

fieldParser.endpoint = function (doc) {
  const example = trimSeparators(doc.example)
  const path = pickGroup(example, /content-type.*(\/ext\/[\w/]*)(```)?$/)
  if (!path) {
    if (doc.method === "health.getLiveness") {
      return "/ext/health"
    }
    throw new Error(`Couldn't parse: ${example}`)
  }
  return path
}

fieldParser.description = function (doc) {
  const escaped = doc.description
    .replace(/\n\n/g, "\\n\\n")
    // Special-handling for a couple of links
    .replace(/\.\.\/tutorials\/(.*)\.md/, `${avaTutorials}/creating-a-$1`)
    .replace("../staking.md", `${avaDocs}/learn/platform-overview/staking`)
  return inlineString(escaped)
}

fieldParser.signature = function (doc) {
  return (
    trimTrailingSeparators(doc.signature)
      // Trim markdown syntax
      .replace(/^```go.*\n/, "")
      .replace(/\n```$/, "")
      // Normalize indentation
      .replace(/\n {4}{\s*([^>]*)\s*},?\s*\) ->/, (_, group1) => {
        const indented = group1.replace(/\n {4}/g, "\n")
        return `{\n    ${indented}}) ->`
      })
      // Uninline params
      .replace(/{ *(\w[^}]* \(optional\)) *}/g, "{\n    $1\n}")
      .replace(/{ *(\w[^}]*) *}/g, (_, group1) => {
        const params = group1.split(/, */)
        const indented = params.join(",\n    ")
        return `{\n    ${indented}\n}`
      })
      // Normalize brackets
      .replace(/\(\s*{/, "({")
      .replace(/->\s*{/, "-> {")
      .replace(/\s*}\s*\)/, "\n})")
      // Normalize punctuation
      .replace(/:(\w|\[)/g, ": $1")
      .replace(/,( \(optional\))?\n( *)}/g, "$1\n$2}")
      // JSONify
      .replace(/\n/g, "\\n")
  )
}

fieldParser.formals = function (doc) {
  const signature = trimSeparators(doc.signature)
  if (signature.match(/\(\)->/)) return

  const args = pickGroup(signature, /\(\{(.*)\},?\)->/)
  const argsSimplified = args
    .replace(/{\(optional\)/g, "?{") // Optional object
    .replace(/:([^,]*),?\(optional\)/g, ":?$1,") // Optional -> use ? prefix
    .replace(/:(\??(\[\])?){[^}]+}/g, ":$1object") // Flatten type specs
    .replace("JSON", "object") // We prefer to call JSON `object`s
    .replace(/,$/, "") // Fix last item traling period

  const json = `{${jsonify(argsSimplified)}}`
  return parseJsonOrThrow(json)
}

fieldParser.returns = function (doc) {
  const signature = trimSeparators(doc.signature)
  const returns = pickGroup(signature, /->({.*})/)

  const returnsSimplified = returns
    .replace(/\[[^\]]+\]/, "[]") // No array length
    .replace(/:(\[\])?{[^}]+}/g, ":$1object") // Flat type specs
    .replace(/,}/, "}") // Fix inconsistency introduced with previous line
  const json = jsonify(returnsSimplified)

  if (doc.method === "platform.getCurrentValidators") return
  if (doc.method === "health.getLiveness") return
  return parseJsonOrThrow(json)
}

fieldParser.example = function (doc) {
  const example = trimNewlines(doc.example)
  const jsonUnclean = pickGroup(example, /"params"\s*:\s*({.*})(,\s*"id": 1)?}/)
  if (!jsonUnclean) return

  const json = jsonUnclean
    .replace(/,\s*"id": 1}/, "")
    // Specifically for platform.addValidator
    .replace(/'\$\(date[^']*\)'/g, `"%date"`)
  if (json) {
    try {
      return parseJsonOrThrow(json)
    } catch (error) {
      throw example.match(/"params":({.*})(}|,"id")/)
    }
  }
}

fieldParser.notes = function (doc) {
  const noteList = doc.notes.split(/\s+\* /)
  if (!noteList[0]) return

  noteList[0] = noteList[0].replace(/^\* /, "")
  const notesInlined = noteList.map(inlineString)
  return notesInlined
}

/* Helpers */

function splitByHeading (heading, string) {
  const regexp = new RegExp(`\n${heading}`)
  return string.split(regexp)
}

function trimSeparators (string) {
  return string.replace(/(\s|\n)/g, "")
}

function trimNewlines (string) {
  return string.replace(/\n/g, "")
}

function trimTrailingSeparators (string) {
  return string.replace(/\s+\n/g, "")
}

function inlineString (string) {
  return string.replace(/\n+\s*/g, " ").replace(/ +$/, "")
}

function pickGroup (string, regexp) {
  const matched = string.match(regexp)
  return matched && matched[1]
}

function jsonify (string) {
  const json = string.replace(/((\?)?(\[\])?[\w]+)/g, "\"$1\"")
  return json
}

function parseJsonOrThrow (json, source = json) {
  try {
    return JSON.parse(json)
  } catch (error) {
    throw new Error(`Couldn't parse JSON from: ${source}`)
  }
}

/* Exports */
module.exports = parseApi
