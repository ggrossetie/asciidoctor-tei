'use strict'

const asciidoctor = require('@asciidoctor/core')()

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
  </teiHeader>
  ${node.getContent()}
</TEI>`
  }
}
