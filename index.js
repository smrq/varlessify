var fs = require('fs');
var path = require('path');
var less = require('less');
var staticModule = require('static-module');
var through = require('through2');

var savedValue;
less.functions.functionRegistry.add('__varlessifySaveValue', function (value) {
	savedValue = value;
	return value;
});

module.exports = function (file, opts) {
	if (/\.json$/.test(file)) return through();
	var parseCache = {};
	var vars = {
		__filename: file,
		__dirname: path.dirname(file)
	};
	var sm = staticModule({
		varless: { get: varless }
	}, {vars: vars});
	return sm;

	function readVariableFromFile(lessFile, variableName, cb) {
		fs.readFile(lessFile, function (err, text) {
			if (err) return cb(err);

			var source = '#varlessify { value: __varlessifySaveValue(@' + variableName + '); }\n' + String(text);
			less.render(source, {
				filename: lessFile,
				paths: opts.paths
			}, function (err, result) {
				cb(err, savedValue);
			});
		})
	}

	function varless(lessFile, variableName) {
		if (variableName == null) {
			variableName = lessFile;
			lessFile = opts.file;
		}

		var stream = through(write, end);

		if (!lessFile) {
			stream.emit('error', new Error('no LESS file specified'));
			return;
		}

		readVariableFromFile(lessFile, variableName, function (err, value) {
			if (err) {
				stream.emit('error', err);
				return;
			}

			stream.push(JSON.stringify(value.toCSS()));
			stream.push(null);
			sm.emit('file', lessFile);
		});

		return stream;

		function write(buf, enc, next) {
			this.push(buf);
			next();
		}

		function end(next) {
			this.push(null);
			next();
		}
	}
}

module.exports.getSaved = function () { return savedValue; }
