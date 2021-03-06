# tmplat-mustache

A fork of [mustache.js](https://github.com/janl/mustache.js) for the [tmplat](https://tmplat.com) browser extension.

[![Build Status](https://img.shields.io/travis/tmplat-extension/tmplat-mustache/develop.svg?style=flat-square)](https://travis-ci.org/tmplat-extension/tmplat-mustache)
[![Dev Dependency Status](https://img.shields.io/david/dev/tmplat-extension/tmplat-mustache.svg?style=flat-square)](https://david-dm.org/tmplat-extension/tmplat-mustache?type=dev)
[![License](https://img.shields.io/npm/l/tmplat-mustache.svg?style=flat-square)](https://github.com/tmplat-extension/tmplat-mustache/blob/master/LICENSE.md)
[![Release](https://img.shields.io/npm/v/tmplat-mustache.svg?style=flat-square)](https://www.npmjs.com/package/tmplat-mustache)

* [Install](#install)
* [Usage](#usage)
* [Bugs](#bugs)
* [License](#license)

## Install

Install using `npm`:

``` bash
$ npm install --save tmplat-chrome
```

## Usage

[tmplat-mustache](https://github.com/tmplat-extension/tmplat-mustache) is very similar to
[mustache.js](https://github.com/janl/mustache.js) with the following differences:

* Uses `{unescaped}` instead of `{{{unescaped}}}`
* Comments, partials, sections (incl. inverted), and custom delimiters now use single curly braces
* `{&name}` is used to escape instead of unescape
* Ignores case when looking up view properties
* Arrays are rendered as a comma-separated list based on their contents
* Objects are rendered as a comma-separated list based on their property values

It is also tested against its own interpretation of the [official spec](https://github.com/mustache/spec).

These changes make it perfect for usage within the [tmplat](https://tmplat.com) browser extension.

The command line tool is identical except for the command name: `tmplat-mustache`.

## Bugs

If you have any problems with this fork or would like to see changes currently in development you can do so
[here](https://github.comtmplat-extension/tmplat-mustache/issues). Upstream features and issues are maintained
separately [here](https://github.com/janl/mustache.js/issues).

## License

See [LICENSE.md](https://github.com/tmplat-extension/tmplat-mustache/blob/master/LICENSE.md) for more information on our
MIT license.
