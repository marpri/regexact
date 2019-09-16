# RegExact 0.2.2

[![MIT license](https://img.shields.io/github/license/marpri/regexact)](http://opensource.org/licenses/MIT)

RegExact extends RegExp to return indexes of matched substrings related to capturing groups.

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

if (matches) {
  for (let i = 0; i < matches.length; i++) {
    console.log(i + ': ' + matches[i] + ' at ' + matches.indexes[i])
  }
} else {
  console.log('No matches.')
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

if (matches) {
  for (let i = 0; i < matches.length; i++) {
    console.log(i + ': ' + matches[i] + ' at ' + matches.indexes[i]);
  }
} else {
  console.log('No matches.')
}

// 0: Hello World at 17
// 1: World at 23
// 2: ld at 26
```
`RegExact` acts as a wrapper around the built-in `RegExp` that redefines its constructor and its `exec` method. The redefined `exec()` method extends the original returned object with an array named `indexes`. The redefined returned object is therefore an array (plus original extra properties `index` and `input`) with a new extra property `indexes` which contains indexes of matches that are stored in the original returned array in the same order.

The following table shows the results for the  upper code:

| Variable | Value | Description |
| -------- | ----- | ----------- |
| `matches[0]` | "Hello World" | The string of the full match. |
| `matches[1]` | "World" | The substring of the match related to the first capturing group. |
| `matches[2]` | "ld" | The substring of the match related to the second capturing group. |
| `matches.indexes[0]` | 17 | The index of the full match. This is a duplicate of `index` |
| `matches.indexes[1]` | 23 | The index of the match related to the first capturing group |
| `matches.indexes[1]` | 26 | The index of the match related to the second capturing group |
| `index` | 17 | The index of the full match.  This is a duplicate of `indexes[0]` |
| `input` | "I wish you a big Hello World" | The string that was matched against.	|

## Motivation

Javascript standard build-in class `RegExp` enables matching text with a regex pattern by discovering matched substring and its index. For capturing groups, `RegExp` only returns their matching substrings and has no support for obtaining indexes of these substrings. `RegExact` extends the `RegExp` functionality to return indexes of matched substrings related to the regular expression capturing groups as well.

## RegExp Features Support

`RegExact` returns indexes of matched substrings defined by capturing groups using any correct JavaScript (ES2018) regular expression including nested groups, quantified groups, non-capturing groups, lookaheads, lookbehinds, named capturing groups, alternations...

## Execution time

To support and be compatible with all correct JavaScript regular expressions, `RegExact` is build on the top of the build-in JavaScript `RegExp` class. It is implemented as a wrapper around the RegExp and it has first to construct and latter to manipulate its own (simplified) abstract syntax tree of the regular expression. The downside of this approach is an execution time penalty. 

The execution time for the constructor (which is typically called only once) is always increased somewhere around 10 times. The increase of the execution time for the `exec` method (which is typically called many times) depends mainly on the complexity of the regular expression. In the case of a simple regular expression, there may not be any time penalty. In the case of a regular expression with many (nested) groups, the increase may amount to 20 times or more of the original execution time.

Some execution time optimizations are already implemented, but there is still room for further optimizations that are planned for future releases.  

## Limitations

`RegExact` support for named capturing groups does not yet enable getting their indexes via their names. To get the indexes of named capturing groups, it is necessary to access them as if groups were ordinary numbered capturing groups.

## Examples

`RegExact` object constructed from regex literal with capturing groups that are greedy quantified with * :

```js
const RegExact = require('regexact').RegExact

const regExact = new RegExact(/([a-z])*([a-z])/)
const matches = regExact.exec('abcde12345')

if (matches) {
  for (let i = 0; i < matches.length; i++) {
    console.log(i + ': ' + matches[i] + ' at ' + matches.indexes[i])
  }
} else {
  console.log('No matches.')
}

// 0: abcde at 0
// 1: d at 3
// 2: e at 4
```

`RegExact` object constructed from `RegExp` object with capturing groups that are lazy quantified with *? :

```js
const RegExact = require('regexact').RegExact

const regExact = new RegExact(new RegExp(/([a-z])*?([a-z])/))
const matches = regExact.exec('abcde12345')

if (matches) {
  for (let i = 0; i < matches.length; i++) {
    console.log(i + ': ' + matches[i] + ' at ' + matches.indexes[i])
  }
} else {
  console.log('No matches.')
}

// 0: a at 0
// 1: undefined at undefined
// 2: a at 0
```

`RegExact` object constructed from `RegExp` object using a pattern string and a flags string with alternation :

```js
const RegExact = require('regexact').RegExact

const regExact = new RegExact(new RegExp('ab(c)|cd(e)', 'i'))
const matches = regExact.exec('cde')

if (matches) {
  for (let i = 0; i < matches.length; i++) {
    console.log(i + ': ' + matches[i] + ' at ' + matches.indexes[i])
  }
} else {
  console.log('No matches.')
}

// 0: cde at 0
// 1: undefined at undefined
// 2: e at 2
```

`RegExact` object with nested capturing and non-capturing groups and quantifiers :

```js
const RegExact = require('regexact').RegExact

const regExact = new RegExact(/(?:(<.+>)[0-9]+){2}/)
const matches = regExact.exec('What is this:<name>0<Mark>31415')

if (matches) {
  for (let i = 0; i < matches.length; i++) {
    console.log(i + ': ' + matches[i] + ' at ' + matches.indexes[i])
  }
} else {
  console.log('No matches.')
}

// 0: <name>0<Mark>31415 at 13
// 1: <Mark> at 25
```

`RegExact` objects with a multidigit backreference and with an octal escape that are interpreted accordingly to the expression context:

```js
const RegExact = require('regexact').RegExact

const text = ('123446789ab\t')
const matches1 = new RegExact(/(.)(.)()()()()()()()()(.)\11/).exec(text) // \11 is a group ref
const matches2 = new RegExact(/(.)(.)\11/).exec(text) // \11 is the escape of a tab

if (matches1) {
  for (let i = 0; i < matches1.length; i++) {
    console.log(i + ': ' + matches1[i] + ' at ' + matches1.indexes[i])
  }
} else {
  console.log('No matches.')
}
console.log()
if (matches2) {
  for (let i = 0; i < matches2.length; i++) {
    console.log(i + ': ' + matches2[i] + ' at ' + matches2.indexes[i])
  }
} else {
  console.log('No matches.')
}

// 0: 2344 at 1
// 1: 2 at 1
// 2: 3 at 2
// 3: at 3
// 4: at 3
// 5: at 3
// 6: at 3
// 7: at 3
// 8: at 3
// 9: at 3
// 10: at 3
// 11: 4 at 3

// 0: ab    at 9
// 1: a at 9
// 2: b at 10
```

`RegExact` object with a negative lookbehind :

```js
const RegExact = require('regexact').RegExact

const regExact = new RegExact(/(?<!\$|usd|\d|\.)(\d+)\.?(\d{1,2})?/i)
const matches = regExact.exec('$1.23 eur108.00 USD0123 eur1999')

if (matches) {
  for (let i = 0; i < matches.length; i++) {
    console.log(i + ': ' + matches[i] + ' at ' + matches.indexes[i])
  }
} else {
  console.log('No matches.')
}

// 0: 108.00 at 9
// 1: 108 at 9
// 2: 00 at 13
```

## Credits

Developed by [Marko Privosnik](http:/github.com/marpri) and released under the [MIT License](https://raw.githubusercontent.com/marpri/regexact/master/LICENSE).
