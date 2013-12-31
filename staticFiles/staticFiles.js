/*global env: true */
/**
 * @overview Copy static files to output. Useful for tutorials
 */
'use strict';

var _ = require('underscore'),
	fs = require('jsdoc/fs'),
	pathUtil = require('jsdoc/path'),
	conf = env.conf.staticFiles || {},
	filter = new (require('jsdoc/src/filter')).Filter(conf),
	scanner = new (require('jsdoc/src/scanner')).Scanner(),
	outDir = env.opts.destination,
	SLASH = pathUtil.sep,
	RECURSIVE = conf.recursive || false,
	RECURSIVE_LEVEL = conf.recursiveLevel || (!RECURSIVE ? 1 : 3);

var splitInclude = function (paths) {
	var output = {};
	for (var i=0; i < paths.length; i++) {
		if ((/:/).test(paths[i])) {
			output[i] = {
				dest: paths[i].split(":")[0],
				source: paths[i].split(":")[1]
			}
		} else {
			output[i] = {
				dest: paths[i],
				source: paths[i]
			}
		}
	}
	return output;
}

exports.handlers = {

	// We would copy the source files only after all processing is done
	processingComplete: function (d) {
		var includes,
			filteredList,
			destPath,
			srcPath,
			currentPath,
			toDir;

		if (conf.include) {
			includes = splitInclude(conf.include);
			_.each(includes, function (elem, i, l) {
				destPath = pathUtil.join(outDir, elem.dest) + SLASH;
				filteredList = scanner.scan([elem.source], RECURSIVE_LEVEL, filter);
				for (var i=0; i < filteredList.length; i++) {
					currentPath = filteredList[i];
					srcPath = fs.statSync(elem.source).isDirectory() ? elem.source :
						pathUtil.dirname(elem.source);
					toDir = fs.toDir(currentPath.replace(srcPath, destPath));
					fs.mkPath(toDir);
					fs.copyFileSync(currentPath, toDir);
				}
			});
		}
	}
}