'use strict'


const subtitle = (documentTitle) => {
  if (documentTitle.hasSubtitle()) {
    return `<title type="sub">${documentTitle.getSubtitle()}</title>`
  }
  return ''
}

module.exports = {
  document: ({ node }) => {
    const documentTitle = node.getDocumentTitle({ partition: true });
    return `<?xml version="1.0" encoding="UTF-8"?>
<TEI xmlns="http://www.tei-c.org/ns/1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.tei-c.org/ns/1.0 http://lodel.org/ns/tei.openedition.1.5.2/tei.openedition.1.5.2.xsd">
  <teiHeader>
    <fileDesc>
      <titleStmt>
        <title type="main">${documentTitle.getMain()}</title>
        ${subtitle(documentTitle)}
      </titleStmt>
    </fileDesc>
  </teiHeader>
  ${node.getContent()}
</TEI>`
  }
}
