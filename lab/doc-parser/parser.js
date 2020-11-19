#!/usr/bin/env node
"use strict"
/**
 * Avalanche API documentation parser
 */
const sh = require("shelljs")
const program = require("commander")

const pkg = require("../../package.json")
const parseApi = require("./parse-api")

/* Command-line */
program.version(pkg.version)

/* Parse Method */
// Broken since API files are not named after API id.
//
// program
//   .command("method method")
//   .description("Parse METHOD specifications")
//   .alias("m")
//   .action(({ args }) => {
//     const method = args[0]
//     if (!method) usageError("Missing argument")

//     const apiId = method.split(".")[0]
//     if (!apiId) usageError("Invalid method id (no API namespace)")

//     const doc = getApiDocumentation(apiId)
//     const apiData = parseApi(apiId, doc)
//     const methodSpecs = apiData.find((x) => x.id === method)
//     if (!methodSpecs) usageError(`Can't find method ${method}`)

//     // eslint-disable-next-line no-console
//     console.log(methodSpecs)
//   })

/* Parse API */
program
  .command("api api")
  .description("Parse API specifications")
  .alias("a")
  .action(({ args }) => {
    const filename = args[0]
    if (!apiId) usageError("Missing argument")

    const doc = getApiDocumentation(filename)
    const apiId = filename.replace(/-.*/, "")
    const specs = parseApi(apiId, doc)

    // eslint-disable-next-line no-console
    console.log(specs)
  })

/* Parse documentation */
program
  .command("documentation")
  .description("Parse Avalanche specifications")
  .alias("d")
  .action(() => {
    console.error("Parse documentation / not implemented yet")
  })

/* Command-line */

program
  .arguments("FILE...")
  .description("Parse Avalanche API documentation into JSON objects.")
  .action(({ args }) => {
    args.forEach((file) => {
      if (!sh.test("-e", file)) {
        throw new Error(`This file doesn't exist: ${file}`)
      }
    })

    const multiple = args.length > 1
    args.forEach((file) => {
      const filename = file.replace(/(.*\/)?([^/]+.md)/, "$2")
      const apiId = filename.replace(/-.*/, "")
      const doc = sh.cat(file)
      const apiData = parseApi(apiId, doc)
      if (!apiData || !apiData.methods.length) {
        if (!multiple) console.error(`No methods in ${file}`)
        return
      }

      const json = JSON.stringify(apiData, null, 2)
      // eslint-disable-next-line no-console
      if (multiple) console.log(`// ${file}`)
      // eslint-disable-next-line no-console
      console.log(json)
      // eslint-disable-next-line no-console
      if (multiple) console.log()
    })
  })

/* Helpers: could be local API class */

function getApiDocumentation (id) {
  const file = getApiFile(id)
  const doc = sh.cat(file)
  return doc
}

function getApiFile (id) {
  const apiDoc = getApisDocumentationDirectory()
  const apiFile = `${apiDoc}/${id}.md`
  if (!sh.test("-e", apiFile)) {
    throw new Error(`Can't find api documentation for ${id}. (${apiFile})`)
  }

  return apiFile
}

function getApisDocumentationDirectory () {
  if (!sh.test("-d", "avalanche-docs")) {
    throw new Error("Can't find 'avalanche-docs' in current directory.")
  }

  const dir = "avalanche-docs/build/avalanchego-apis"
  if (!sh.test("-d", dir)) {
    throw new Error("Can't find api documentation in 'avalanche-docs'.")
  }

  return dir
}

/* Helpers */

function usageError () {
  program.outputHelp()
  // eslint-disable-next-line no-console
  console.log("\nError:", ...arguments)
  process.exit(1)
}

/* Run Program */

// Unknow command
program.on("command:*", function () {
  usageError("Invalid command: %s\n", program.args.join(" "))
  // program.help()
  // process.exit(1)
})

// Run CLI
try {
  program.parse(process.argv)
} catch (error) {
  console.error(error)
  process.exit(1)
}

// No arguments
if (program.rawArgs.length === 2) {
  program.help()
}
