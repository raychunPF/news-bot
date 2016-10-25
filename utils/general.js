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
 * Sets the parameter object values using the values that the user set
 *
 * @param {object} userParams The users parameter setting
 * @return {object} params The parameter object that will be used in api calls
 */
exports.buildparams = function(userParams) {
    var params = {};
    for (var key in userParams) {
        if (userParams.hasOwnProperty(key)) {
            params[key] = userParams[key];
        }
    }

    return params;
}

/**
 * Sets the api parameter properties
 *
 * @param {object} session The session where we want to set the user data
 */
exports.setApiProperties = function(session) {
    // Set recommendations parameters
    session.userData.recommendations = JSON.parse(JSON.stringify(CONFIG.INTERESTS_DATA.PARAMS));
    // Set interests data parameters
    session.userData.interestsData = JSON.parse(JSON.stringify(CONFIG.INTERESTS_DATA.PARAMS));
    // Set extraction parameters
    session.userData.extraction = JSON.parse(JSON.stringify(CONFIG.EXTRACTION.PARAMS));
    // Indicate properties have been set
    session.userData.apiPropertiesSet = true;
}
