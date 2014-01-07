var fs = require("fs"),
    CONFFILE = "./test/staticFiles.conf",
    SRCDIR = "test/fixtures/staticFiles",
    OUTDIR = "tmp/out-staticFiles",
    config;

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

    it ("must valid JSON", function () {
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

});