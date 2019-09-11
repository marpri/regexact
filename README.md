# RegExact 0.2.0

[![MIT license](https://img.shields.io/github/license/marpri/regexact)](http://opensource.org/licenses/MIT)

RegExact extends RegExp to return indexes of matched substrings associated with capturing groups.

## Installation
```
npm install regexact
```

## Usage

To use the `RegExact` class in a JavaScript file:

```js
const RegExact = require('regexact').RegExact

const regExact = new RegExact(/Hello (.*(ld))/i)
const matches = regExact.exec('I wish you a big Hello World')

for (let i = 0; i < matches.length; i++) {
  console.log(i + ': ' + matches[i] + ' at ' + matches.indexes[i])
}

// 0: Hello World at 17
// 1: World at 23
// 2: ld at 26
```

To use the `RegExact` class in a TypeScript file:

```ts
import { RegExact } from 'regexact';

const regExact = new RegExact(/Hello (.*(ld))/i);
const matches = regExact.exec('I wish you a big Hello World');

for (let i = 0; i < matches.length; i++) {
  console.log(i + ': ' + matches[i] + ' at ' + matches.indexes[i]);
}

// 0: Hello World at 17
// 1: World at 23
// 2: ld at 26
```

## Overview
Javascript standard build-in RegExp enables matching text with a regex pattern by discovering matched substring and its index. For capturing groups, RegExp only returns their matching substrings and has no support for obtaining indexes of these substrings. RegExact extends the RegExp functionality to return indexes of matched substrings associated with the regular expression capturing groups as well.

## ES2018 Features Support

RegExact returns indexes of matched substrings defined by capturing groups using any correct JavaScript (ES2018) regular expression including nested groups, quantified groups, non-capturing groups, lookaheads, lookbehinds, named capture groups, alternations...

## Description

RegExact acts as a wrapper around RegExp that redefines the constructor and the `exec` method. The redefined `exec()` method returns the same object that the original `exec()` returns, extended with an array named `indexes`. Returned object is therefore an array with original extra properties `index` and `input`, and a new extra property `indexes`. Array `indexes` contains indexes of matches that are stored in the original returned array. As a result `indexes[0]` contains index of the full match, `indexes[1]` contains index of the match associated with the first capturing group, `indexes[2]` contains index of the match associated with the second capturing group and so on.
 
In order to be compatible with all correct JavaScript regular expressions, RegExact has to construct and manipulate a simplified abstract syntax tree of the regular expression. The downside of this approach is an increased execution time penalty. The time of execution of the constructor (which is typicaly called only once) is always increased many times. On the other hand, the time of the execution of the `exec` method (which is typicaly called many times) depends mainly on the complexity of the regular expression and it may not change or may ammount to many times of the original execution time.

## Examples

## Credits

Developed by [Marko Privosnik](http:/github.com/marpri) and released under the [MIT License](https://raw.githubusercontent.com/marpri/regexact/master/LICENSE).
