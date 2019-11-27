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
  t.regex(tei, /de ce document.<\/p>[\n\s]+<\/front>/)
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

test('text > body > div2', t => {
  const tei = asciidoctor.convert(`= Title
:lang: fr

Il était sur le dos (…)

== Sed lectus

In auctor lobortis lacus. Quisque libero metus, condimentum nec, tempor a,
commodo mollis, magna. Vestibulum ullamcorper mauris at ligula.

=== In consectetuer turpis ut velit

Nulla sit amet _est_. Praesent metus *tellus*.
`, { standalone: true, backend: 'tei' })

  t.regex(tei, /<div type="div2">/)
  t.regex(tei, /<head subtype="level2">In consectetuer turpis ut velit<\/head>/)
  t.regex(tei, /<hi rend="italic">est<\/hi>/)
  t.regex(tei, /<hi rend="bold">tellus<\/hi>/)
})

test('text > body > figure', t => {
  const tei = asciidoctor.convert(`= Title

== Sed lectus

.Fonctionnement d'Opentext
image::relative/path/to/image/img-1.jpg[legend=Schéma réalisé en septembre 2009,license=Surletoit - licence Creative Commons by-nc-sa]`, { standalone: true, backend: 'tei' })

  t.regex(tei, /<p rend="figure-title">Fonctionnement d&#8217;Opentext<\/p>/)
  t.regex(tei, /<graphic url="relative\/path\/to\/image\/img-1.jpg" \/>/)
  t.regex(tei, /<p rend="figure-legend">Schéma réalisé en septembre 2009<\/p>/)
  t.regex(tei, /<p rend="figure-license">Surletoit - licence Creative Commons by-nc-sa<\/p>/)
})

test('text > body > ref', t => {
  const tei = asciidoctor.convert(`= Title

== Sed lectus

In enim justo, rhoncus ut, http://www.lodel.org.

In enim justo, rhoncus ut, http://www.lodel.org[Lodel].

In enim justo, rhoncus ut, http://www.lodel.org[*Lodel*].
`, { standalone: true, backend: 'tei' })

  t.regex(tei, /<ref target="http:\/\/www.lodel.org">http:\/\/www.lodel.org<\/ref>/)
  t.regex(tei, /<ref target="http:\/\/www.lodel.org">Lodel<\/ref>/)
  t.regex(tei, /<ref target="http:\/\/www.lodel.org"><hi rend="bold">Lodel<\/hi><\/ref>/)
})
