import test from 'ava'
import Asciidoctor from '@asciidoctor/core'
import teiConverter from './index.js'

const asciidoctor = Asciidoctor()
teiConverter(asciidoctor)

test('asciidoctor', t => {
  const tei = asciidoctor.convert('= Title', { standalone: true, backend: 'tei' })
  t.regex(tei, /<TEI xmlns="http:\/\/www.tei-c.org\/ns\/1.0"/)
})

test('teiHeader > titleStmt with subtitle', t => {
  const tei = asciidoctor.convert('= Title: Subtitle', { standalone: true, backend: 'tei' })
  t.regex(tei, /<title type="main">Title<\/title>/)
  t.regex(tei, /<title type="sub">Subtitle<\/title>/)
})

test('teiHeader > titleStmt without subtitle', t => {
  const tei = asciidoctor.convert('= Title', { standalone: true, backend: 'tei' })
  t.regex(tei, /<title type="main">Title<\/title>/)
  t.notRegex(tei, /<title type="sub">/)
})

test('teiHeader > titleStmt with an author', t => {
  const tei = asciidoctor.convert(`= Title
Doc Writer <doc@example.com>`, { standalone: true, backend: 'tei' })
  t.regex(tei, /<author>[\s\n]+<name>Doc Writer<\/name>[\s\n]+<email>doc@example.com<\/email>/)
})

test('teiHeader > encodingDesc > appInfo', t => {
  const tei = asciidoctor.convert('= Title', { standalone: true, backend: 'tei' })
  t.regex(tei, /<application version="2.0.3" ident="asciidoctor">/)
})
