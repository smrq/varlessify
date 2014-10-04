var assert = require('chai').assert;
var browserify = require('browserify');
var varlessify = require('../');
var vm = require('vm');

describe('varlessify', function () {
	it('should pull top-level less variables from a less file specified in the script', function (done) {
		var definition = require('./basic/definition.json');
		browserify()
			.add('./test/basic/script.js')
			.transform(varlessify)
			.bundle(function (err, src) {
				if (err) { assert.ok(false, err); }
				vm.runInNewContext(src, { console: { log: log(definition.expected) }});
				done();
			});
	});

	it('should pull top-level less variables from a less file specified in the config options', function (done) {
		var definition = require('./config/definition.json');
		browserify()
			.add('./test/config/script.js')
			.transform(varlessify, { file: './test/config/variables.less' })
			.bundle(function (err, src) {
				if (err) { assert.ok(false, err); }
				vm.runInNewContext(src, { console: { log: log(definition.expected) }});
				done();
			});
	});

	it('should error if no less file is specified', function (done) {
		browserify()
			.add('./test/config/script.js')
			.transform(varlessify)
			.bundle(function (err, src) {
				assert.ok(err);
				done();
			});
	});
});

function log(expected) {
	return function () {
		assert.deepEqual(expected, Array.prototype.slice.call(arguments, 0));
	}
}
