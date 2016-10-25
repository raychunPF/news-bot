// =========================================================
// Test Setup & Imports
// =========================================================
var testHome = "../test";
require(testHome + "/test-setup");
var general = require("../utils/general.js");

// =========================================================
// Static Variables
// =========================================================

describe("Primal Utility Methods", function() {
    describe("Testing general utility methods", function() {
        it("should indicate if url", function() {
            var url = "http://stackoverflow.com/";

            general.isUrl(url).should.be.true;
        });

        it("should copy an object", function() {
            var object = {
                "prop1": "one",
                "prop2": "two"
            };

            var copy = general.copyObject(object);
            copy.should.have.property("prop1", "one");
            copy.should.have.property("prop2", "two");
        });

        it("should set initial parameters", function() {

        });
    });
});
