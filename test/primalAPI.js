// =========================================================
// Test Setup & Imports
// =========================================================
var testHome = "../test";
require(testHome + "/test-setup");
var primalAPI = require("../primalAPI.js").primalAPI;
var general = require("./../utils/general.js");

// =========================================================
// Static Variables
// =========================================================
var CONFIG = global.config;

describe("Primal Service API", function() {
    describe("Recommendations api", function() {
        this.slow(1000);
        var url = "http://stackoverflow.com/";
        var query = "buddy is a dog";

        it("should return 5 content items when using url", function(done) {
            primalAPI.recommendations(url, function(content) {
                content.should.have.lengthOf(5);
                done();
            }, function(error) {
                done(error.details);
            });
        });

        it("should return 5 content items when using query", function() {
            primalAPI.recommendations(query, function(content) {
                content.should.have.lengthOf(5);
                done();
            }, function(error) {
                done(error.details);
            });
        });
    });

    describe("Extraction api", function() {
        var params = general.buildparams(JSON.parse(JSON.stringify(CONFIG.EXTRACTION.PARAMS)));
        this.slow(1000);
        var url = "http://stackoverflow.com/";
        var query = "buddy is a dog";

        it("should return *** when using url", function(done) {
            primalAPI.extraction(url, params, function(extractedTopics) {
                // content.should.have.lengthOf(5);
                done();
            }, function(errorMessage) {
                done(errorMessage.details);
            });
        });

        it("should return 5 *** when using query", function() {
            primalAPI.extraction(query, params, function(extractedTopics) {
                // content.should.have.lengthOf(5);
                done();
            }, function(errorMessage) {
                done(errorMessage.details);
            });
        });
    });
});
