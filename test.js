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

test('teiHeader > encodingDesc > langUsage without a lang attribute', t => {
  const tei = asciidoctor.convert('= Title', { standalone: true, backend: 'tei' })
  t.notRegex(tei, /<langUsage>/)
})

test('teiHeader > encodingDesc > langUsage with a lang attribute', t => {
  const tei = asciidoctor.convert(`= Title
:lang: fr`, { standalone: true, backend: 'tei' })
  t.regex(tei, /<language ident="fr">fr<\/language>/)
})

test('text > front', t => {
  const tei = asciidoctor.convert(`= Title
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
`, { standalone: true, backend: 'tei' })

  t.regex(tei, /<front>[\s\n]+<p>Il était sur le dos/)
  t.regex(tei, /<div xml:lang="en"><p>"Oh, God", he thought…<\/p><\/div>/)
  t.regex(tei, /de ce document.<\/d>[\n\s]+<\/front>/)
})

test('text > body', t => {
  const tei = asciidoctor.convert(`= Title
:lang: fr

Il était sur le dos (…)

== Sed lectus

In auctor lobortis lacus. Quisque libero metus, condimentum nec, tempor a,
commodo mollis, magna. Vestibulum ullamcorper mauris at ligula.
`, { standalone: true, backend: 'tei' })

  t.regex(tei, /<div type="div1">/)
  t.regex(tei, /<head subtype="level1">Sed lectus<\/head>/)
})
