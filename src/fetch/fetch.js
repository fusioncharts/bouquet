/* global env: true */

var fs = require("jsdoc/fs"),
    tutorialPath = env.conf.opts.tutorials || env.opts.tutorials,
    FILE_REGEX = /^(.*)\.(x(?:ht)?ml|html?|md|markdown)$/i,
    DIRECTIVE_REGEX = /\{@(fetch)\s([^\}]+)?\}/g,
    URL_REGEX = /^https?(?=\:\/\/)/;

/**
 * Replace a string with other strings at multiple positions
 *
 * @param {string} haystack - The string on which to perform replacements
 * @param {object} replacements - An object with information for replacing on `haystack`.
 * Each item in `replacements` will be a key-value pair in the following format:
 *     "<start-position>,<end-position>": "<replacement-string>"
 * The key contains the start position and end position separated by a comma. This portion
 * of the `haystack` is replaced with the value of that key which has to be a string.
 * @returns {string} Replaced `haystack`
 */
var replaceString = function (haystack, replacements) {
    var key,
        split,
        start,
        end,
        i;

    // Check if `haystack` is a string and convert it into an array of characters
    if (typeof haystack === "string") {
        haystack = haystack.split("");
    }
    // if it is not a string, throw an error
    else {
        throw new TypeError("haystack should be a string.");
    }

    // Iterate on the `replacements` object
    for (key in replacements) {
        if (replacements.hasOwnProperty(key)) {
            // Split the current key into start and end and sanitize
            split = key.split(",");
            start = parseInt(split[0]);
            end = parseInt(split[1]);

            // Ensure start and end are not more than haystack's length
            if (start > haystack.length || end > haystack.length) {
                throw new RangeError("start and end should not be greater than haystack's length");
            }

            // Replace the start position with the entire replacement string
            haystack[start] = replacements[key];
            // Pad the rest of the portion till end with an empty string. They will be removed
            // when doing a join, but will retain array index.
            for (i = start + 1; i < end; i++) {
                haystack[i] = "";
            }
        }
    }

    // Convert back the haystack to a string and return it
    return haystack.join("");
};


exports.handlers = {

    parseBegin: function () {
        var changed = false,
            files,
            replacements,
            matchedFile,
            fileData,
            match,
            resultData;

        // Parse tutorials only if tutorial path is provided to JSDoc
        if (tutorialPath) {
            // Get all files from the tutorial path
            files = fs.ls(tutorialPath);

            // For all the files found, filter them to select only files that match FILE_REGEX
            files.forEach(function(file) {
                // See if the file is a valid tutorial file
                matchedFile = file.match(FILE_REGEX);

                // Proceed nly if the file is a valid tutorial file
                if (matchedFile) {
                    // Read the file data and convert it into an array of characters
                    fileData = fs.readFileSync(matchedFile.input, "utf8") || "";
                    replacements = {};
                    // Make changed state to false
                    changed = false;

                    // Find successive matches of {@fetch } tags in the tutorial content
                    while ((match = DIRECTIVE_REGEX.exec(fileData)) !== null) {
                        // Clean resultData
                        resultData = "";

                        // Test if value provided is URL. If value is URL, perform a XHR
                        // and fetch the data
                        if (URL_REGEX.test(match[2])) {
                            // TODO: Fetch data from URL
                            // resultData = request(match[2]);
                        }
                        // if value provided is not URL, it is a local resource
                        // use fs.readFileSync() to get the data
                        else {
                            resultData = fs.readFileSync(match[2], "utf8");
                        }
                        // Ensure resultData is string
                        if (typeof resultData !== "string") {
                            throw new TypeError("Expected result data from source to be string");
                        }
                        // Now that we have some resultData, let add it to the replacements string
                        replacements[parseInt(match.index) + "," +
                            parseInt(match.index + match[0].length)] = resultData;
                        // Make changed state as true
                        changed = true;
                    }

                    if (fileData && changed) {
                        // Write data back to the tutorial file
                        fileData = replaceString(fileData, replacements);
                        fs.writeFileSync(matchedFile.input, fileData, "utf8");
                    }
                    fileData = null; // just being panicky!
                }
            });
        }
    }
};