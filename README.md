# `asciidoctor-tei`

> Convert [AsciiDoc documents][asciidoc] into XML/TEI files,
> at least a subset used by [OpenEdition publishing][openedition],
> as documented by the [XML/TEI OpenEdition Schema][schema-repo].

`asciidoctor-tei` is a companion module for [asciidoctor.js][]
in order to be used with [Node.js][] or within a Web browser.

**Note**: the module is in active development, things might look
incomplete or broken.

## Usage

### Command line

```bash
$ asciidoctor --require asciidoctor-tei -b tei ./docs/sample.adoc
```

### JavaScript API

```js
const asciidoctor = require('@asciidoctor/core')()
const teiConverter = require('asciidoctor-tei')
teiConverter(asciidoctor)

const xmlString = asciidoctor.convert(
`= My Academic Paper: From text to text
John Doe <john.doe@example.com>

[preamble]
...

= Chapter 1
...`)
```

## Install

```bash
$ npm install asciidoctor asciidoctor-tei
```

[asciidoc]: https://asciidoctor.org/
[openedition]: https://www.openedition.org/
[asciidoctor.js]: https://npmjs.com/asciidoctor
[Node.js]: https://nodejs.org/
[schema-repo]: https://github.com/OpenEdition/tei.openedition
