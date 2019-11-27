'use strict'

const transforms = require('./transforms.js')

function TEIConverter (Asciidoctor) {
  class TEIConverter {
    constructor (backend, opts) {
      this.basebackend = 'xml'
      this.outfilesuffix = '.xml'
      this.filetype = 'xml'
      this.htmlsyntax = 'xml'
    }

    $convert (node, transform = null, opts = {}) {
      const operation = transforms[transform || node.node_name]

      if (!operation) {
        throw new Error(`${operation} operation does not exist. (${transform}, ${node.node_name}, ${node.context})`)
      }

      return operation({ node })
    }
  }

  Asciidoctor.ConverterFactory.register(new TEIConverter('tei'), ['tei'])
}

module.exports = TEIConverter
module.exports.register = function TEIConverterFactory () {
  const asciidoctor = require('@asciidoctor/core')()
  return TEIConverter(asciidoctor)
}
