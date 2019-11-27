import test from 'ava'
import Asciidoctor from '@asciidoctor/core'
import teiConverter from './index.js'

const asciidoctor = Asciidoctor()
teiConverter(asciidoctor)

test('asciidoctor', t => {
  const tei = asciidoctor.convert('= Title', { standalone: true, backend: 'tei' })
  t.regex(tei, /<TEI xmlns="http:\/\/www.tei-c.org\/ns\/1.0"/)
})
