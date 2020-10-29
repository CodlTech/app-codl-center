"use strict"
/**
 * HTML helpers
 * */
const helpers = exports

const marked = require("marked")
const { html } = require("@kisbox/browser")

/* Library */

helpers.stringToHtml = function (string) {
  const tmp = html("div", { innerHTML: string })
  return tmp.childNodes[0]
}

helpers.markdownToHtml = function (root, markdown) {
  const encoded = markdown.replace(/[<>]/, (c) => {
    const charCode = c.charCodeAt(0)
    return `&#${charCode};`
  })

  const innerHTML = marked(encoded, { renderer: markdownRenderer })
  return html(root, { innerHTML })
}

const markdownRenderer = new marked.Renderer()
markdownRenderer.link = function (href, title, text) {
  if (href.match(/^http(s):\/\//)) {
    return `<a target="_blank" rel="noopener" href="${href}" title="${title}">${text}</a>`
  } else {
    return `<a href="${href}" title="${title}">${text}</a>`
  }
}
