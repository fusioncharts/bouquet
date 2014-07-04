/**
 * @fileOverview
 * Print the current `pwd` from which JSDoc is being run
 */

exports.handlers = {
    parseBegin: function (e) {
        console.log("\nJSDoc is being run from: " + process.env.PWD + "\n");
    }
};

