'use strict'

const asciidoctor = require('@asciidoctor/core')()
const FRONT_CONTEXTS = [
  'preamble'
]

const REND_TYPES = new Map([
  ['emphasis', 'italic'],
  ['strong', 'bold'],
  ['sup', 'sup'],
  ['sub', 'sub']
])

const subtitleTag = (documentTitle) => {
  if (documentTitle.hasSubtitle()) {
    return `<title type="sub">${documentTitle.getSubtitle()}</title>`
  }
  return ''
}

const authorTags = (authors) => authors.map(author => `<author>
  <name>${author.getName()}</name>
  <email>${author.getEmail()}</email>
</author>`)

const langTag = (node) => {
  if (node.hasAttribute('lang')) {
    const lang = node.getAttribute('lang')
    return `<langUsage>
  <language ident="${lang}">${lang}</language>
</langUsage>`
  }
  return ''
}

const getFront = (node) => {
  const filteredBlocks = node.findBy({context: 'preamble'})

  if (filteredBlocks.length) {
    return `<front>
  ${filteredBlocks.map(block => block.convert())}
</front>`
  }

  return ''
}

const getBody = (node) => {
  const filteredBlocks = node.getBlocks().filter(block => {
    return !FRONT_CONTEXTS.includes(block.node_name)
  })

  if (filteredBlocks.length) {
    console.log('node_names', filteredBlocks.map(b => b.context))
    return `<body>${filteredBlocks.map(block => block.convert())}</body>`
  }

  return ''
}

module.exports = {
  document: ({ node }) => {
    const documentTitle = node.getDocumentTitle({ partition: true })
    const authors = node.getAuthors()
    return `<?xml version="1.0" encoding="UTF-8"?>
<TEI xmlns="http://www.tei-c.org/ns/1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.tei-c.org/ns/1.0 http://lodel.org/ns/tei.openedition.1.5.2/tei.openedition.1.5.2.xsd">
  <teiHeader>
    <fileDesc>
      <titleStmt>
        <title type="main">${documentTitle.getMain()}</title>
        ${subtitleTag(documentTitle)}
        ${authorTags(authors)}
      </titleStmt>
    </fileDesc>
    <encodingDesc>
      <appInfo>
        <application version="${asciidoctor.getVersion()}" ident="asciidoctor">
          <label>Asciidoctor</label>
        </application>
      </appInfo>
    </encodingDesc>
    <profileDesc>
    ${langTag(node)}
  </teiHeader>
  <text>
    ${getFront(node)}
    ${getBody(node)}
  </text>
</TEI>`
  },

  preamble: ({ node }) => {
    return node.getContent()
  },

  paragraph: ({ node }) => {
    const content = `<p>${node.getContent()}</p>`
    if (node.hasAttribute('lang')) {
      return `<div xml:lang="${node.getAttribute('lang')}">${content}</div>`
    }
    return content
  },

  section: ({ node }) => {
    return `<div type="div${node.getLevel()}">
      <head subtype="level${node.getLevel()}">${node.getTitle()}</head>
      ${node.getContent()}
    </div>`
  },

  inline_quoted: ({ node }) => {
    return `<hi rend="${REND_TYPES.get(node.getType())}">${node.getText()}</hi>`
  }
}
