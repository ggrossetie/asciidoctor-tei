import test from 'ava'
import Asciidoctor from '@asciidoctor/core'
import teiConverter from './index.js'

const asciidoctor = Asciidoctor()
teiConverter(asciidoctor)

const convert = (adoc, options = { standalone: true, backend: 'tei' }) => {
  const xml = asciidoctor.convert(adoc, options)
  return new DOMParser().parseFromString(xml, 'text/xml')
}

test('asciidoctor', t => {
  const tei = convert('= Title')

  t.is(
    tei.querySelector('TEI').getAttribute('xmlns'),
    'http://www.tei-c.org/ns/1.0'
  )
})

test('teiHeader > titleStmt with subtitle', t => {
  const tei = convert('= Title: Subtitle')

  t.is(tei.querySelector('title[type="main"]').textContent, 'Title')
  t.is(tei.querySelector('title[type="sub"]').textContent, 'Subtitle')
})

test('teiHeader > titleStmt without subtitle', t => {
  const tei = convert('= Title')

  t.is(tei.querySelector('title[type="main"]').textContent, 'Title')
  t.is(tei.querySelector('title[type="sub"]'), null)
})

test('teiHeader > titleStmt with an author', t => {
  const tei = convert(`= Title
Doc Writer <doc@example.com>`)

  t.is(tei.querySelector('author name').textContent, 'Doc Writer')
  t.is(tei.querySelector('author email').textContent, 'doc@example.com')
})

test('teiHeader > encodingDesc > appInfo', t => {
  const tei = convert('= Title')

  t.is(tei.querySelector('application').getAttribute('version'), '2.1.0')
  t.is(tei.querySelector('application').getAttribute('ident'), 'asciidoctor')
})

test('teiHeader > encodingDesc > langUsage without a lang attribute', t => {
  const tei = convert('= Title')

  t.is(tei.querySelector('langUsage'), null)
})

test('teiHeader > encodingDesc > langUsage with a lang attribute', t => {
  const tei = convert(`= Title
:lang: fr`)

  t.is(tei.querySelector('langUsage > language').textContent, 'fr')
  t.is(tei.querySelector('langUsage > language').getAttribute('ident'), 'fr')
})

test('text > front', t => {
  const tei = convert(`= Title
:lang: fr

Il était sur le dos, un dos aussi dur qu’une carapace, et, en relevant un peu
la tête, il vit, bombé, brun, cloisonné par des arceaux plus rigides, son abdomen
sur le haut duquel la couverture, prête à glisser tout à fait, ne tenait plus
qu’à peine. Ses nombreuses pattes, lamentablement grêles par comparaison avec
la corpulence qu’il avait par ailleurs, grouillaient désespérément sous ses yeux.

[lang=en]
"Oh, God", he thought…

Je remercie le site Blind Text Generator qui a fourni tout le faux-texte de ce document.

== Sed lectus
`)

  t.regex(tei.querySelector('front > p').textContent, /^Il était sur le dos/)
  t.regex(tei.querySelector('front > div[xml:lang="en"] > p').textContent, /^"Oh, God"/)
  t.regex(tei.querySelector('front > p:last-of-type').textContent, /de ce document.$/)
})

test('text > body', t => {
  const tei = convert(`= Title
:lang: fr

Il était sur le dos (…)

== Sed lectus

In auctor lobortis lacus. Quisque libero metus, condimentum nec, tempor a,
commodo mollis, magna. Vestibulum ullamcorper mauris at ligula.
`)

  t.is(tei.querySelector('div[type="div1"] head[subtype="level1"]').textContent, 'Sed lectus')
})

test('text > body > div2', t => {
  const tei = convert(`= Title
:lang: fr

Il était sur le dos (…)

== Sed lectus

In auctor lobortis lacus. Quisque libero metus, condimentum nec, tempor a,
commodo mollis, magna. Vestibulum ullamcorper mauris at ligula.

=== In consectetuer turpis ut velit

Nulla sit amet _est_. Praesent metus *tellus*.
`)

  t.is(tei.querySelector('div[type="div2"] head[subtype="level2"]').textContent, 'In consectetuer turpis ut velit')
  t.is(tei.querySelector('div[type="div2"] hi[rend="italic"]').textContent, 'est')
  t.is(tei.querySelector('div[type="div2"] hi[rend="bold"]').textContent, 'tellus')
})

test('text > body > figure', t => {
  const tei = convert(`= Title

== Sed lectus

.Fonctionnement d'Opentext
image::relative/path/to/image/img-1.jpg[legend=Schéma réalisé en septembre 2009,license=Surletoit - licence Creative Commons by-nc-sa]`, { standalone: true, backend: 'tei' })

  t.is(tei.querySelector('p[rend="figure-title"]').textContent, 'Fonctionnement d’Opentext')
  t.is(tei.querySelector('graphic').getAttribute('url'), 'relative/path/to/image/img-1.jpg')
  t.is(tei.querySelector('p[rend="figure-legend"]').textContent, 'Schéma réalisé en septembre 2009')
  t.is(tei.querySelector('p[rend="figure-license"]').textContent, 'Surletoit - licence Creative Commons by-nc-sa')
})

test('text > body > ref', t => {
  const tei = convert(`= Title

== Sed lectus

In enim justo, rhoncus ut, http://www.lodel.org.

In enim justo, rhoncus ut, http://www.lodel.org[Lodel].

In enim justo, rhoncus ut, http://www.lodel.org[*Lodel*].
`)

  const refs = tei.querySelectorAll('ref[target]')

  t.is(refs[0].getAttribute('target'), 'http://www.lodel.org')
  t.is(refs[0].textContent, 'http://www.lodel.org')

  t.is(refs[1].textContent, 'Lodel')

  t.is(refs[2].textContent, 'Lodel')
  t.is(tei.querySelector('ref > hi').getAttribute('rend'), 'bold')
})
