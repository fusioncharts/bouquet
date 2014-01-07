/**
 * @license Readability Node Wrapper by Shamasis Bhattacharya <http://readability.shamasis.net/>
 * @version 0.1.0
 */
(function() {

    var E = "",
        AMP = "&",
        EQ = "=",
        READABILITY_URL = "www.readability.com",
        READABILITY_PARSER_PATH = "/api/content/v1/parser",
        UNDEF,
        toStr = String,
        request = require('request'),
        util = require('util'),
        querystring = require('querystring'),
        events = require('events'),
        Parser;

    /**
     * **Readability article parsing and bokmarking web API wrapper.**
     *
     * This library eases the pain of performing common tasks while working with the API of readability.com. For more
     * information on reability API visit their website http://www.readability.com/developers/api.
     *
     * As per readability.com website, *"the Parser API is freely available on a limited basis. If you'd like to use
     * the Parser API for commercial use, get in touch with us at licensing@readability.com to learn about our
     * licensing options."*
     *
     * @global
     * @constructor
     * @param {object=} [options] - Configuration for a new instance of the readability.
     * The possible options that you can pass are part of {@link Parser.defaultOptions}.
     *
     * @example
     * // Use Readability to procure the excerpt of an article.
     * var parser = new require("readability").Parser({
     *     parserAPIKey: "myapikeyfromreadability.com"
     * });
     * parser.parse("http://somedomain.com/somearticle/"'", function (data) {
     *     console.log(data.excerpt);
     * });
     */
    Parser = function (options) {
        options = options || {};

        var proxy = this,
            parserAPIKey = toStr(options.parserAPIKey || E);

        /**
         * Get or set the parser API key. You can procure your API key from http://www.readability.com/account/api
         *
         * @param {string=} [key] - Parser API key for subsequent use.
         * Do not provide any key if you want to just retrive the current key.
         *
         * @fires #keychange
         * @returns {string} - Readability parser API key being used.
         *
         * @example
         * // Use Readability to procure the excerpt of an article.
         * var parser = new require("readability").Parser();
         *
         * // Lookout for changes to parser API key and log the change.
         * parser.on("keychange", function (newKey) {
         *     var currentKey = this.key() || "(blank)"; // retrieve presently set key.
         *     console.log("Current Key: " + currentKey + ". New Key: " + (newKey || "(blank)"));
         * });
         * // Set a new parser key.
         * parser.key("myapikeyfromreadability.com");
         */
        this.key = function (newKey) {

            // If no key has been provided then return the current key (act as getter).
            if (!(newKey = toStr(newKey || E))) {
                return parserAPIKey;
            }

            // In case a key has been provided and it is not same as the current key then change the current key and
            // fire the `keychange` event.
            if (parserAPIKey !== newKey) {
                /**
                 * Readability parser API key change event.
                 *
                 * @event Parser#keychange
                 * @param {string} newKey - The new API key to be set for {@link Parser}. To procure the old (current)
                 * key, use `parser.get()` within the event.
                 */
                proxy.emit("keychange", newKey);
                parserAPIKey = newKey;
            }

            return parserAPIKey;
        };
    };

    // Make Readability function inherit from EventEmitter. This inheritance adds a set of event related functions to
    // the Parser class.
    /**
     * Listen to events raised by {@link Parser}.
     *
     * @function Parser#on
     * @param {string} event - The event name that needs to be listened to. This is not case sensitive, but keeping
     * it in lowercase is standard.
     * @param {function} listener - The function that will be invoked when its corresponding event has been raised.
     * @returns {Parser}
     *
     * @example
     * // Use Readability to procure the excerpt of an article.
     * var parser = new require("readability").Parser({
     *     parserAPIKey: "myapikeyfromreadability.com"
     * });
     *
     * // Listen to parse event for being notified when parsing is completed.
     * parser.on("parse", function (result) {
     *     console.log(result.excerpt);
     * });
     *
     * // Request the parser to parse an URL.
     * parser.parse("http://somedomain.com/somearticle/"");
     */
    /**
     * Listen to events raised by {@link Parser} for a **single occasion**. This listener is invoked only the next time
     * the event is fired, after which it is removed.
     *
     * @function Parser#once
     * @param {string} event - The event name that needs to be listened to. This is not case sensitive, but keeping
     * it in lowercase is standard.
     * @param {function} listener - The function that will be invoked when its corresponding event has been raised.
     * @returns {Parser}
     */
    /**
     * Remove events previously attached to a particular event of {@link Parser}.
     *
     * @function Parser#removeEventListener
     * @param {string} event - Event name to which the listener function is attached.
     * @param {function} listener - Listener function that needs to be removed.
     * @returns {Parser}
     */
    /**
     * Remove events previously attached to a particular event of {@link Parser}.
     *
     * @function Parser#removeAllListeners
     * @param {string=} [event] - Event name whose listeners need to be removed. If not provided, then all event
     * listeners of {@link Parser} are removed.
     * @returns {Parser}
     */
    util.inherits(Parser, events.EventEmitter);

    /**
     * Default set of options that are used while communicating with Readability
     * API servers. These are the set of options that can be passed on to a new
     * instance of `Readability` in order to override the defaults.
     *
     * @enum
     * @memberOf Parser
     */
    Parser.defaultOptions = {
        /**
         * Provide the API key required by readability.com servers for using the API. Though this is optional during
         * instantiating a {@link Parser} class, it is a required parameter to be set before actually making
         * any request to the readability servers. If not provided initially, it can be later set using
         * {@link Parser#key} method. You can procure your API key from http://www.readability.com/account/api
         *
         * @type {string}
        */
        parserAPIKey: ""
    };

    /**
     * Returns a fully formed API access URL to Readability server.
     *
     * @static
     * @private
     * @memberOf Parser
     *
     * @param {string} key - The parser API key to be used to pass
     * on to Readability servers.
     * @param {string} articleUrl - Url of the article that is required
     * to be parsed.
     * @returns {string} Readability API Url ready to be requested.
     */
    Parser.getAPIUrl = function (key, articleUrl) {
        return "https://" + READABILITY_URL + READABILITY_PARSER_PATH + "?" + querystring.stringify({
            token: key,
            url: articleUrl
        });
    };

    /**
     * Accepts a URL and parses it for its article mode by sending it to Readability servers.
     *
     * @memberOf Parser
     * @param {string} url - The URL of the article that needs to be parsed.
     * @param {function=} [success] - Callback function that will be executed upon successful parsing.
     * @fires #parse
     *
     * @example
     * // Use Readability to procure the excerpt of an article.
     * var parser = new require("readability").Parser({
     *     parserAPIKey: "myapikeyfromreadability.com"
     * });
     * // Call the parse function with an Url and a callback function to be executed when the parsing is completed.
     * parser.parse("http://somedomain.com/somearticle/", function (data) {
     *     console.log(data.excerpt);
     * });
     */
    Parser.prototype.parse = function (url, success) {
        var proxy = this;
        request(Parser.getAPIUrl(proxy.key(), url), function(error, response, body) {
            var data;
            if (!error && response.statusCode === 200) {
                // Try and convery json string from body to a JS object and on failure
                // compile an error object.
                try {
                    data = JSON.parse(body);
                } catch (err) {
                    data = {
                        error: err
                    };
                }

                /**
                 * Readability article parse event. This event is fired every time
                 * an article has been parsed.
                 *
                 * @event Parser#parse
                 * @param {object} [data] - Article parse result in JSON format.
                 */
                proxy.emit("parse", data);
                try {
                    success.call(proxy, data);
                } catch (err) {}
            }
        });
    };


    module && (module.exports = {
        Parser: Parser
    });

}());
