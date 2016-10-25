// =========================================================
// Imports
// =========================================================
var utils = require("./utils/general.js");
var rest = require("restler");

// =========================================================
// Static Variables
// =========================================================
var CONFIG = global.config;

primalAPI = rest.service(
    // service constructor
    function() {
    },
    {
        headers: {
            "Accept": "application/json",
            "Primal-App-Key": CONFIG.primalAPI.PRIMAL_APP_KEY,
            "Primal-App-ID": CONFIG.primalAPI.PRIMAL_APP_ID,
            "Authorization": CONFIG.primalAPI.AUTHORIZATION
        }
    },
    // service methods
    {
        /**
         * Api call to primal recommendations
         *
         * @param {string} message The message to search for recommendations
         * @param {string} site The site to search for
         * @param {function} onSuccess The function to call on success
         * @param {function} onFail The function to call on fail
         */
        recommendations: function(message, site, onSuccess, onFail) {
            var formattedMessage = _formatMessage(message);
            // http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
            var queryStrings = JSON.parse(JSON.stringify(CONFIG.RECOMMENDATIONS.PARAMS));
            queryStrings[formattedMessage.type] = formattedMessage.message;
            if(site)
              queryStrings['site'] = site;

            this.get(CONFIG.RECOMMENDATIONS.URL, {"query": queryStrings}).on("success", function(data, response) {
                var cards = [];
                for (var i = 0; i < data["@graph"].length; i++) {
                    var item = data["@graph"][i];
                    if (item["@type"] === "content") {
                        cards.push(item);
                    }
                }
                onSuccess(cards);
            }).on("fail", function(data, response) {
                onFail(response.rawEncoded);
            });
        },

        /**
         * Api call to primal consumer interests data
         *
         * @param {string} message The message to query for interests data
         * @param {object} params The parameters for the interests data api call
         * @param {function} onSuccess The function to call on success
         * @param {function} onFail The function to call on fail
         */
        interestsData: function(message, params, onSuccess, onFail) {
            var formattedMessage = _formatMessage(message);
            _stripEmptyProperties(params);
            params[formattedMessage.type] = formattedMessage.message;

            this.get(CONFIG.EXTRACTION.URL, {"query": params}).on("success", function(data, response) {
                onSuccess(data);
            }).on("fail", function(data, response) {
                onFail(response.rawEncoded);
            });
        },

        /**
         * Api call to primal extraction
         *
         * @param {string} message The message to query for extraction
         * @param {object} params The parameters for the extraction api call
         * @param {function} onSuccess The function to call on success
         * @param {function} onFail The function to call on fail
         */
        extraction: function(message, params, onSuccess, onFail) {
            var formattedMessage = _formatMessage(message);
            _stripEmptyProperties(params);
            params[formattedMessage.type] = formattedMessage.message;

            this.get(CONFIG.EXTRACTION.URL, {"query": params}).on("success", function(data, response) {
                onSuccess(data);
            }).on("fail", function(data, response) {
                onFail(response.rawEncoded);
            });
        }
    }
);

/**
 * Checks if the given message is a url or query
 *
 * @param {string} message The string to format as url or query
 * @return {object} formattedMessage An object with a formatted message in message
 *                                   message type in type
 */
function _formatMessage(message) {
    // Check if url, else the message is a query
    if (utils.isUrl(message)) {
        return { "message": encodeURI(message), "type": "u" };
    } else {
        return { "message": message.split(' ').join('+'), "type": "q" };
    }
}

/**
 * Strips any properties off of parameters if they are empty
 *
 * @param {object} params The object to remove properties from
 */
function _stripEmptyProperties(params) {
    for (var prop in params) {
        if (params.hasOwnProperty(prop) && params[prop] === '') {
            delete params[prop];
        }
    }
}

exports.primalAPI = new primalAPI();
