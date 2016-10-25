// =========================================================
// Static Variables
// =========================================================
var CONFIG = global.config;

// =========================================================
// General utility methods
// =========================================================
/**
 * Checks if the string is a url
 *
 * @param {string} url The string to check if it is a url
 * @return {boolean} isUrl Indicates if the string is a url
 */
exports.isUrl = function(url) {
    var urlPattern = /^((http|https|ftp):\/\/)/;
    var isUrl = urlPattern.test(url);
    
    return isUrl;
}

/**
 * Builds an array of questions with prompts for the user about parameters
 *
 * @param {string} apiName The api name we build prompts for
 * @return {array} prompts An array full of prompt objects with properties field and prompt
 */
exports.createPrompts = function(apiName) {
    console.log("ATTEMPTING TO CREATE PROMPTS");
    var prompts = [];
    var parameters = CONFIG[apiName].PARAMS;
    console.log(parameters);
    for (var key in parameters) {
        if (parameters.hasOwnProperty(key)) {
            var prompt = { field: key, prompt: ""}
            prompts.push(prompt);
        }
    }
    
    return prompts;
}
