import test from 'ava'
import Asciidoctor from '@asciidoctor/core'
import teiConverter from './index.js'

const asciidoctor = Asciidoctor()
teiConverter(asciidoctor)

test('foo', t => {
  t.pass()
})

test('bar', async t => {
  const bar = Promise.resolve('bar')
  t.is(await bar, 'bar')
})

test('asciidoctor', t => {
  const tei = asciidoctor.convert('= Title', { standalone: true, backend: 'tei' })
  t.is(tei, 'aaa')
})
