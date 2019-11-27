'use strict'

module.exports = {
  document: ({ node }) => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<TEI xmlns="http://www.tei-c.org/ns/1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.tei-c.org/ns/1.0 http://lodel.org/ns/tei.openedition.1.5.2/tei.openedition.1.5.2.xsd">
${node.getContent()}
</TEI>`
  }
}
