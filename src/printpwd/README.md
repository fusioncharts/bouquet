# printpwd

This plugin prints the path from which JSDoc is being run. It is useful for debugging in cases where the `pwd` used by JSDoc is not clearly known.


## Usage

* Copy the `printpwd` directory to your JSDoc's `plugins` directory. So the plugin file will be at `<jsdoc>/plugins/printpwd/printpwd.js`.

* Edit your JSDoc configuration file and add `plugins/printpwd/printpwd` to the `plugins` array:

        "plugins" : ["...", "plugins/jsdoc-plugins/printpwd/printpwd"]

* Ready to go!
