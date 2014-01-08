# Contributing to Bouquet

Have some JSDoc plugin that you would like to share? Or found some issues that you can help fixing? Here is how you can contribute to Bouquet.

This document highlights the basic guidelines for contributing to Bouquet.

## Using the issue tracker

The [issue tracker](https://github.com/fusioncharts/bouquet/issues) is the place for managing bugs, feature requests and pull requests. Please follow these rules when using the issue tracker:

 - Please __do not__ open issues regarding JSDoc here. They are better suited for the [JSDoc issue tracker](https://github.com/jsdoc3/jsdoc/issues).
 - Please __do not__ use abusive language in the issue tracker.

## Feature Requests

We welcome feature requests. But before you request one, please ensure that it has not been implemented already and that it aligns with the scope and goals of the project. If you think the feature is a must-have for Bouquet, please justify.

## Pull requests

We welcome neat and clean patches to our project through pull requests. Before sending a pull request, please ensure:

 - Somebody else has not done the same work already.
 - The pull request does not result in merge conflicts.
 - You have given immaculate attention to detail.
 - You have not made spelling, grammatical or formatting errors if you have edited any text.
 - Your changes pass all tests.

## Code guidelines

### Folder structure

 - All sources are in `src`.
    - Plugins are in `src/<pluginname>/<pluginname>.js`.
 - All tests are in `test`.

### Creating a new plugin

 - Create a sub directory in `src` with the plugin name. e.g., if you have selected `xyz` as your plugin name, create `src/xyz`.
 - Create a JavaScript file of the same name within that directory. e.g., `src/xyz/xyz.js`.
 - Write test cases for the plugin in `test` using the instructions mentioned in __Writing tests__.

### How plugins are tested

JSDoc plugins cannot be tested in an isolated environment. They are tested by invoking JSDoc with the plugins in place, and testing the output.

The test script at `test/run` downloads a copy of JSDoc, copies all the plugins in `src` directory to JSDoc's `plugins` folders. Then it looks for JSDoc configuration files in `test` and invokes JSDoc for each plugin configuration found. This ensures that we can run JSDoc multiple times for each plugin and test different types of output.

Tests are run using `jasmine-node`, so you have access to all the testing tools for that tool.

Note: The plugin files cannot be directly "require"-d in the spec files as most of the time the plugins will have some JSDoc specific modules loaded, which Node cannot resolve.

### Writing tests

 - For each plugin, create at least one JSDoc configuration file in the `test` directory. The filename should be in the format `test/<confname>.conf`.
 - Create a spec file in the same directory with the format `test/<confname>-spec.js`.
 - Create your fixtures in `test/fixtures/<pluginname>/`.
 - In your `test/<confname.conf>`, add `test/fixtures/<pluginname/` as the `include` directory.
 - JSDoc's output is stored in `tmp/out-<confname>`.

__Have fun!__
