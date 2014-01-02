/*global env: true */
/**
 * @overview Copy static files to output. Useful for tutorials
 */
'use strict';

var fs = require('jsdoc/fs'),
    pathUtil = require('jsdoc/path'),
    conf = env.conf.staticFiles || {},
    filter = new (require('jsdoc/src/filter')).Filter(conf),
    scanner = new (require('jsdoc/src/scanner')).Scanner(),
    outDir = env.opts.destination,
    SLASH = pathUtil.sep,
    RECURSIVE = conf.recursive || false,
    RECURSIVE_LEVEL = conf.recursiveLevel || (!RECURSIVE ? 1 : 3);

var splitInclude = function (paths) {
    var output = [];
    paths.forEach( function(path) {
        if ((/:/).test(path)) {
            var split = path.split(":");
            output.push({ dest: split[0], source: split[1] });
        } else {
            output.push({ dest: path, source: path });
        }
    });
    return output;
}

exports.handlers = {

    // We would copy the source files only after all processing is done
    processingComplete: function (d) {
        var includes,
            filteredList,
            destPath,
            srcPath,
            toDir;

        if (conf.include) {
            includes = splitInclude(conf.include);
            includes.forEach( function(elem) {
                destPath = pathUtil.join(outDir, elem.dest) + SLASH;
                filteredList = scanner.scan([elem.source], RECURSIVE_LEVEL, filter);
                filteredList.forEach( function(currentPath) {
                    srcPath = fs.statSync(elem.source).isDirectory() ? elem.source :
                        pathUtil.dirname(elem.source);
                    toDir = fs.toDir(currentPath.replace(srcPath, destPath));
                    fs.mkPath(toDir);
                    fs.copyFileSync(currentPath, toDir);
                });
            });
        }
    }
}
