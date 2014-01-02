# staticFiles

`staticFiles` is a plugin for copying static assets while compiling documentation with JSDoc. Based on user specified settings, it can copy files and directories with inclusion and exclusion patterns, with an option for recursively copying directories.

## Configuration

The plugin takes in configuration from the `staticFiles` object in JSDoc's configuration. Here is how the configurations look like:

    {
      staticFiles : {
        "include": ["images:tutorials/images/",],
        "exclude": ["tutorials/images/2.jpg"],
        "includePattern": ".+\\.(png|jpg|css)$",
        "excludePattern": "(^|\\/|\\\\)_",
        "recursive": true,
        "recursiveLevel": 2,
      }
    }

Notice that the `staticFiles` configuration is _not_ part of the `templates` configuration. It has to be outside the `templates` configuration, as part of the root.

Let us look at the different configuration options:

 * __include__: It is the primary configuration option for specifying the folders to copy. It is an array where the source paths are specified as strings.

    A special format can be used to specify different source and destination paths, where the path is written as "destination:source", separated by a colon. e.g. if the source is `tutorials/images`, but the output destination needs to be `images`, then the string has to be written as `"images:tutorials/images"`.
    
    Since this option is a array, multiple separate include paths can be specified, delimited by a comma.

 * __exclude__: An array of files in the included source folders that should be excluded.

    e.g. `["tutorials/images/2.jpg"]` will exclude only that file.

 * __includePattern__: Within the included folders, only files that match this regex pattern will be included.

 * __excludePattern__: Within the included folders, the files matching this pattern will be always excluded. This will take precedence over `includePattern`.

 * __recursive__: If true, the source folders will be recursively copied. Defaults to `false`.

 * __recurseLevel__: If `recursive` is `true`, this provides the depth of levels that the recursion should go. This is `3` by default.
 

## How to use

 * Copy the `staticFiles` directory to your JSDoc's `plugins` directory. So the plugin file will be at `<jsdoc>/plugins/staticFiles/staticFiles.js`.

 * Edit your JSDoc configuration file and add `plugins/staticFiles/staticFiles` to the `plugins` array:

        "plugins" : ["...", "plugins/jsdoc-plugins/staticFiles/staticFiles"]

 * Create plugin specific configuration:

        staticFiles: {
          "include": ["images:tutorials/images/",],
          "exclude": ["tutorials/images/2.jpg"],
          "includePattern": ".+\\.(png|jpg|css)$",
          "excludePattern": "(^|\\/|\\\\)_",
          "recursive": true,
          "recursiveLevel": 2,
        }

 * Put your images in `tutorials/images` relative to the folder from which you execute jsdoc.

 * Ready to go!