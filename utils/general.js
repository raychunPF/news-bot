// =========================================================
// Static Variables
// =========================================================
var CONFIG = global.config;

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
 * Makes a copy of an object
 *
 * @param {object} object The object to copy
 * @return {object} copy The copied object with the same properties
 */
exports.copyObject = function(object) {
    var copy = {};
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            copy[key] = object[key];
        }
    }

    return copy;
}

/**
 * Strips any properties off an object if they are empty
 *
 * @param {object} object The object to remove properties from
 */
exports.stripEmptyProperties = function(object) {
    for (var prop in object) {
        if (object.hasOwnProperty(prop) && object[prop] === '') {
            delete object[prop];
        }
    }
}

/**
 * Sets the api parameter properties in the user data
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
