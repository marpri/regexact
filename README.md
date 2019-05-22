# RegExact 0.1.0


[![MIT license](https://img.shields.io/npm/l/@rollingbytes/regexex.svg)](http://opensource.org/licenses/MIT)

RegExact is a RegExp extension that discovers indexes of substrings defined by capturing groups.

Javascript standard build-in RegExp enables matching text with a regex pattern by discovering matched substring and its index. For capturing groups, RegExp enables only discovery of their matching substrings and has no support for obtaining indexes of these substrings. RegExact extends the RegExp functionallity by discovering indexes of substrings defined by regular expression capturing groups as well.

RegExact discovers indexes of matched substrings defined by capturing groups using any correct JavaScript regular expression.

RegExact acts as a wrapper around RegExp that redefines its exec method so that it returns modified result object. The result object includes additional property named `indexes` which in addition to the index of the complete match includes also indexes of matched substrings defined by capturing groups in regular expression.

## Using this module in other modules

To use the `RegExact` class in a JavaScript file:

```js
const RegExact = require('regexact').RegExact

const regExact = new RegExact(/Hello (World)/i)
const regExactMatches = regExact.exec('I wish you a big Hello World')

for (let i = 0; i < regExactMatches.length; i++) {
  console.log(regExactMatches[i] + ' at ' + regExactMatches.indexes[i])
}

// Hello World at 17
// World at 23
```

To use the `RegExact` class in a TypeScript file:

```ts
import { RegExact } from 'regExact';

const regExact = new RegExact(/Hello (World)/i);
const regExactMatches = regExact.exec('I wish you a big Hello World');

for (let i = 0; i < regExactMatches.length; i++) {
  console.log(regExactMatches[i] + ' at ' + regExactMatches.indexes[i]);
}

// Hello World at 17
// World at 23
```

## Credits

RegExact is developed by [Marko Privosnik](http:/github.com/marpri).

RegExact is released under the [MIT License](https://mit-license.org/).
