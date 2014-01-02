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

/**
 * Splits include paths into an array of source and destination paths
 *
 * @example
 * ["images:tutorials/images", "js"]
 * @param {array} paths - Array of items in the format `"destination:source"` or, simply, `"source"`
 * @returns {array} An array containing relative source and destination paths in the format `{dest: "", source: ""}`
 */
var splitInclude = function (paths) {
    var output = [];
    paths.forEach( function(path) {
        // Test if path contains a colon
        if ((/:/).test(path)) {
            // If it contains a colon, split it into two parts based on the colon
            var split = path.split(":");
            // Add an object with the first part of the split path as destination
            // and the second as source
            output.push({ dest: split[0], source: split[1] });
        } else {
            // If path does not contain a colon, destination and source will be same
            output.push({ dest: path, source: path });
        }
    });
    return output;
}

exports.handlers = {

    /**
     * Process static files only after rest of the processing is complete
     */
    processingComplete: function () {
        var includes,
            filteredList,
            destPath,
            srcPath,
            toDir;

        // Proceed if `include` paths are provided, else silently exit
        if (conf.include) {
            // Split the `conf.include`
            includes = splitInclude(conf.include);
            // Iterate over each `include` paths and perform operation
            includes.forEach( function(elem) {
                // Prepare path to destination
                destPath = pathUtil.join(outDir, elem.dest) + SLASH;
                // Scan the source path and filter inclusions and exclusions
                filteredList = scanner.scan([elem.source], RECURSIVE_LEVEL, filter);
                // Iterate over each of the filtered paths available and copy them to destination
                filteredList.forEach( function(currentPath) {
                    // Generate source path
                    srcPath = fs.statSync(elem.source).isDirectory() ? elem.source :
                        pathUtil.dirname(elem.source);
                    // Prepare directory path for destination
                    toDir = fs.toDir(currentPath.replace(srcPath, destPath));
                    // Create destination directory
                    fs.mkPath(toDir);
                    // Finally, copy the file synchronously to destination
                    fs.copyFileSync(currentPath, toDir);
                });
            });
        }
    }
}
