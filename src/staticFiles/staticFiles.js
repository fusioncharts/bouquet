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
    // `recursive` will be false by default
    recursive = conf.recursive || false,
    // By default recursion will go three levels deep if `recursive` is `true`
    recursiveLevel = conf.recursiveLevel || (!recursive ? 1 : 3);

/**
 * Splits include paths into an array of source and destination paths
 *
 * @example
 * ["images:tutorials/images", "js"]
 * @param {array} paths - Array of items in the format `"destination:source"` or, simply, `"source"`
 * @returns {array} An array containing relative source and destination paths in the format `{source: "", destination: ""}`
 */
var splitInclude = function (paths) {
    var output = [];

    // Ensure that `paths` is an array and perform action on each of the array items
    paths && paths.forEach && paths.forEach(function (path) {
        // Tests that `path` is a string or an object with `match` property which takes a regex.
        // The regex splits `path` based on the presence of a colon within the string.

        // The `match()` method returns an array in which the first item is the string being matched,
        // the second item is the destination and the third item is the source.
        // If user provides a string without colons, then the entire path becomes the source, and
        // the destination becomes the same as source. i.e. the same folder structure is created 
        // in the destination.
        (path = path && path.match && path.match(/^([^\:]*?)\:?([^\:]+)$/)) && output.push({
            source: path[2],
            // If no colons were given, destination remains an empty string. So we make destination
            //same as source
            destination: path[1] || path[2]
        });
    });

    return output;
};

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
                destPath = pathUtil.join(outDir, elem.destination) + pathUtil.sep;
                // Scan the source path and filter inclusions and exclusions
                filteredList = scanner.scan([elem.source], recursiveLevel, filter);
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
};
