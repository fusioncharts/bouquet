<a href="http://www.fusioncharts.com/"><img src="http://fusioncharts.github.io/bouquet/images/bouquet.png" alt="Bouquet logo" align="right" /></a>
[![GitHub version][git-badge]](https://github.com/fusioncharts/bouquet)
[![NPM version][npm-badge]](https://npmjs.org/package/bouquet)
[![Build Status][travis-badge]](https://travis-ci.org/fusioncharts/bouquet)

# Bouquet

A collection of plugins for [JSDoc](http://usejsdoc.org), that can be readily integrated with JSDoc installations to extend the functionalities of JSDoc without editing the core of JSDoc.

## Why Bouquet?

Often we need to extend JSDoc to support different use cases that are not satisfied by JSDoc. For example, someone might need to include additional files in their documentation, or parse additional directives.

JSDoc exposes a plugins architecture that can be used to address those use cases, without hacking on the core JSDoc files. [Bouquet](https://github.com/fusioncharts/bouquet) is an effort to provide a unified collection of such useful plugins for use with JSDoc.

## How to use Bouquet?

Each plugin in Bouquet is contained in a separate directory within the `src` directory. Generic instruction for using a Bouquet plugin is:

 - Clone the Bouquet repository.
 - Copy plugin directory from `src` directory to the `plugins` directory in JSDoc's installation directory.
 - Edit JSDoc's conf file and add path to the plugin in the `plugins` array. For example, if you want to use the _staticFiles_ plugin and have copied `src/staticFiles` to JSDoc's `plugins/staticFiles` directory, then your plugins array would contain:

         "plugins": ["plugins/staticFiles/staticFiles"]

 - Put in plugin specific configuration in JSDoc's conf file. Each plugin's configuration options are provided in a `README.md` within the plugin specific folder.
 - You are all set!

## List of plugins

### [staticFiles](src/staticFiles)

Copies static files in source to generated documentation based on user-specified include paths, inclusion and exclusion patters, with support for recursive copying. [[Know more]](src/staticFiles/README.md)

## Road ahead

 - Plugin to re-order, rename and include custom menu items in JSDoc.
 - Plugin for global search.
 - Plugin to analyze documentation coverage.
 - Plugin to embed JSFiddle by supplying a fiddle URL.
 - Plugin to embed FusionCharts in tutorials and reference chart types from API.

[git-badge]: https://badge.fury.io/gh/fusioncharts%2Fbouquet.png
[npm-badge]: https://badge.fury.io/js/bouquet.png
[travis-badge]: https://travis-ci.org/fusioncharts/bouquet.png?branch=master
