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
 * Builds the param object using default values
 *
 * @param {object} params
 * @param {object} defaultParams 
 */
exports.buildparams = function(params, defaultParams) {
    for (var key in defaultParams) {
        if (defaultParams.hasOwnProperty(key)) {
            params[key] = defaultParams[key];
        }
    }
}

/**
 * Sets the api properties
 *
 * @param {object} session The session we want to set conversation data 
 */
exports.setApiProperties = function(session) {
    // Set recommendations parameters
    
    // Set interests data parameters
    session.userData.interestsData = JSON.parse(JSON.stringify(CONFIG.INTERESTS_DATA.PARAMS));
    // Set extraction parameters
    session.userData.extraction = JSON.parse(JSON.stringify(CONFIG.EXTRACTION.PARAMS));
    
    session.userData.apiPropertiesSet = true;
}
