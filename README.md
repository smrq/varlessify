# varlessify

require() LESS variables into your JS using Browserify

[![NPM version](https://badge.fury.io/js/varlessify.png)](http://badge.fury.io/js/varlessify)
[![build status](https://secure.travis-ci.org/smrq/varlessify.png)](http://travis-ci.org/smrq/varlessify)
[![Dependency status](https://david-dm.org/smrq/varlessify.png)](https://david-dm.org/smrq/varlessify) [![devDependency Status](https://david-dm.org/smrq/varlessify/dev-status.png)](https://david-dm.org/smrq/varlessify#info=devDependencies)

# example usage

If you have a `variables.less` file:

``` less
@foo: #fff;
@bar: 1 + 1;
@baz: @bar + @bar;
```

and a `main.js`:

``` js
var varless = require('varless');
var foo = varless.get('foo');
var bar = varless.get('bar');
var baz = varless.get('baz');
console.log(foo, bar, baz);
```

then after `browserify`ing:

``` sh
$ browserify main.js -t [ varlessify --file ./variables.less ] > bundle.js
```

you get...

``` js
var foo = "#ffffff";
var bar = "2";
var baz = "4";
console.log(foo, bar, baz);
```

# how to script

``` js
varless.get(variable)
varless.get(lessFile, variable)
```

You can specify the less file either as a parameter to `varless.get` or as a build option.  If both are specified, the parameter takes precedence.

# how to browserify

On the command line:

``` sh
$ browserify main.js -t varlessify > bundle.js
```

Or, with options:

``` sh
$ browserify main.js -t [ varlessify --file ./variables.less ] > bundle.js
```

With the Browserify API:

``` js
browserify()
    .add('main.js')
    .transform('varlessify', { file: './variables.less' })
    .bundle();
```

# transform options

#### file

A file to parse for variable declarations by default.

#### paths

An array of paths to search for during LESS parsing of @import declarations.

# installation

Just plain ol' [npm](https://npmjs.org/) installation:

``` sh
npm install varlessify
```

# license

MIT
