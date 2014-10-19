var fs = require('fs');
var path = require('path');
var less = require('less');
var staticModule = require('static-module');
var through = require('through2');

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

	function parseLess(lessFile, callback) {
		fs.readFile(lessFile, function (err, text) {
			if (err) {
				callback(err);
				return;
			}
			var parser = new less.Parser({
				paths: opts.paths,
				filename: lessFile
			});
			parser.parse(String(text), callback);
		});
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

		parseLess(lessFile, function (err, tree) {
			if (err) {
				stream.emit('error', err);
				return;
			}
			var evalTree = tree.eval(new less.tree.evalEnv({}, [tree]));
			var variable = evalTree.variable('@' + variableName);
			if (variable == null) {
				stream.emit('error', new Error('variable @' + variableName + ' is undefined'));
				return;
			}

			var evalEnv = new less.tree.evalEnv({}, [evalTree]);
			var value = variable.eval(evalEnv).value.toCSS(evalEnv);
			stream.push(JSON.stringify(value));
			stream.push(null);
			sm.emit('file', lessFile)
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
