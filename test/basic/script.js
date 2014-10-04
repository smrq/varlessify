var varless = require('varless');

var foo = varless.get(__dirname + '/variables.less', 'foo');
var bar = varless.get(__dirname + '/variables.less', 'bar');
var baz = varless.get(__dirname + '/variables.less', 'baz');

console.log(foo, bar, baz);
