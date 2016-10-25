// =========================================================
// Test Setup & Imports
// =========================================================
var testHome = "../test";
require(testHome + "/test-setup");
var primalAPI = require("../primalAPI.js").primalAPI;

// =========================================================
// Static Variables
// =========================================================
var CONFIG = global.config;

describe("Primal Service API", function() {
    var url = "http://stackoverflow.com/";
    var query = "buddy is a dog";
    this.slow(1000);

    describe("Recommendations api", function() {
        it("should return 5 content items when using url", function(done) {
            primalAPI.recommendations(url, function(content) {
                content.should.have.lengthOf(5);
                done();
            }, function(error) {
                done(error.details);
            });
        });

        it("should return 5 content items when using query", function(done) {
            primalAPI.recommendations(query, function(content) {
                content.should.have.lengthOf(5);
                done();
            }, function(error) {
                done(error.details);
            });
        });
    });

    describe("Extraction api", function() {
        var params = JSON.parse(JSON.stringify(CONFIG.EXTRACTION.PARAMS));

        it("should return *** when using url", function(done) {
            primalAPI.extraction(url, params, function(extractedTopics) {
                done();
            }, function(errorMessage) {
                done(errorMessage.details);
            });
        });

        it("should return *** when using query", function(done) {
            primalAPI.extraction(query, params, function(extractedTopics) {
                done();
            }, function(errorMessage) {
                done(errorMessage.details);
            });
        });
    });

    describe("Interests Data api", function() {
        var params = JSON.parse(JSON.stringify(CONFIG.INTERESTS_DATA.PARAMS));

        it("should return *** when using url", function(done) {
            primalAPI.interestsData(url, params, function(interests) {
                done();
            }, function(errorMessage) {
                done(errorMessage.details);
            });
        });

        it("should return *** when using query", function(done) {
            primalAPI.interestsData(query, params, function(interests) {
                done();
            }, function(errorMessage) {
                done(errorMessage.details);
            });
        });
    });
});
