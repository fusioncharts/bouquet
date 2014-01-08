/* global describe, it, expect */
var fs = require("fs"),
    path = require("path"),
    CONFFILE = "./test/staticFiles.conf",
    SRCDIR = "test/fixtures/staticFiles",
    OUTDIR = "tmp/out-staticFiles",
    config;

/**
 * Function to generate sha1 from file content
 *
 * @param {string} filepath - Path to file
 */
var getfilesha1 = function (filepath) {
    var shasum = require("crypto").createHash("sha1"),
        file = fs.ReadStream(filepath),
        d;

    file.on("data", function(d) {
        shasum.update(d);
    });

    file.on("end", function() {
        d = shasum.digest("hex");
    });

    return d;
};

/**
 * The test below is left here for historical reasons
 */
describe ("blank", function () {
    it ("must be blank", function () {
        expect("blank").toBe("blank");
    });
});

/**
 * Test staticFiles conf
 */
describe ("staticFilesConf", function () {

    it ("must exist", function () {
        expect(fs.existsSync(CONFFILE)).toBeTruthy();
    });

    it ("must be valid JSON", function () {
        expect(config = JSON.parse(fs.readFileSync(CONFFILE).toString())).toBeTruthy();
    });

    it ("must have staticFiles and staticFiles.include", function () {
        expect(config.staticFiles && config.staticFiles.include).toBeTruthy();
    });

});

/**
 * Test input
 */
describe ("input", function () {

    it ("must exist", function () {
        expect(fs.existsSync(SRCDIR)).toBeTruthy();
    });

    it ("must be a directory", function () {
        expect(fs.statSync(SRCDIR).isDirectory()).toBeTruthy();
    });

});

/**
 * Test output
 */
describe ("output", function () {

    it ("must exist", function () {
        expect(fs.existsSync(OUTDIR)).toBeTruthy();
    });

    it ("must be a directory", function () {
        expect(fs.statSync(OUTDIR).isDirectory()).toBeTruthy();
    });

    describe ("include", function () {

        var includeDir = ["images", "test/fixtures/staticFiles/css"],
            includeFiles = ["images/1.jpg", "test/fixtures/staticFiles/css/1.css"];

        it ("must have created directories", function () {
            includeDir.forEach (function (elem) {
                expect(fs.statSync(path.join(OUTDIR, elem)).isDirectory()).toBeTruthy();
            });
        });

        it ("must have been copied", function () {
            includeFiles.forEach (function (elem) {
                expect(fs.existsSync(path.join(OUTDIR, elem))).toBeTruthy();
            });
        });

        it ("must have exact data", function () {
            includeFiles.forEach (function (elem) {
                expect(getfilesha1(path.join(OUTDIR, elem)))
                    .toEqual(getfilesha1(path.join(SRCDIR, elem)));
            });
        });

    });

    describe ("exclude", function () {

        var excludeFiles = ["images/2.jpg", "images/3.svg"];

        it ("must not have been copied", function () {
            excludeFiles.forEach (function (elem) {
                expect(fs.existsSync(path.join(OUTDIR, elem))).toBeFalsy();
            });
        });
    });

    describe ("recursive", function () {

        var recursiveInclude = ["images/level1/1.jpg", "images/level1/level2/1.jpg"],
            recursiveExclude = ["images/level1/level2/level3/1.jpg"];

        it ("must have been recursively copied", function () {
            recursiveInclude.forEach (function (elem) {
                expect(fs.existsSync(path.join(OUTDIR, elem))).toBeTruthy();
            });
        });

        it ("must have been beyond recursion level and not copied", function () {
            recursiveExclude.forEach (function (elem) {
                expect(fs.existsSync(path.join(OUTDIR, elem))).toBeFalsy();
            });
        });
    });

});
