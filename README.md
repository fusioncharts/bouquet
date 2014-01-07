# Bouquet

A collection of plugins for [JSDoc](http://usejsdoc.org), that can be readily integrated with JSDoc installations for various types of extended features.

## Why Bouquet?

Often we need to extend JSDoc to support various use cases. But those plugins are not properly packaged and presented to the world. Bouquet is an effort to provide a unified collection of various useful plugins which a user can use with JSDoc.

## How to use Bouquet?

To use Bouquet, you have to use the plugins that ship with Bouquet. Each plugin is contained in a separate directory with the `src` directory. Generic instruction for using a Bouquet plugin is:

 - Clone the Bouquet repository.
 - Copy plugin directory from `src` directory to JSDoc's `plugins` directory.
 - Edit JSDoc's conf file and add path to the plugin in the `plugins` array. For example, if you want to use the _staticFiles_ plugin and have copied `src/staticFiles` to JSDoc's `plugins/staticFiles` directory, then your plugins array would contain:

         "plugins": ["plugins/staticFiles/staticFiles"],

 - Put in plugin specific configuration in JSDoc's conf file.
 - You are all set!

For further information see each plugin's documentation.

## List of plugins

### [staticFiles](src/staticFiles)

Copies static files in source to generated documentation based on user-specified include paths, inclusion and exclusion patters, with support for recursive copying. [[Know more]](src/staticFiles/README.md)

## Road ahead

 - Plugin for global search.
 - Plugin to analyze documentation coverage.
 - Plugin to embed JSFiddle by supplying a fiddle URL.
 - Plugin to embed FusionCharts in tutorials and reference chart types from API.