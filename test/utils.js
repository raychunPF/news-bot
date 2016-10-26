// =========================================================
// Test Setup & Imports
// =========================================================
var testHome = "../test";
require(testHome + "/test-setup");
var generalUtils = require("../utils/general.js");

// =========================================================
// Static Variables
// =========================================================

describe("Primal Utility Methods", function() {
    describe("Testing general utility methods", function() {
        it("should tell if a string beginning in http is an url", function() {
            var url = "http://stackoverflow.com/";

            generalUtils.isUrl(url).should.be.true;
        });
        
        it("should tell if a string beginning in https is an url", function() {
            var url = "https://stackoverflow.com/";

            generalUtils.isUrl(url).should.be.true;
        });
        
        it("should tell if a string beginning in www is an url", function() {
            var url = "www.stackoverflow.com/";

            generalUtils.isUrl(url).should.be.true;
        });

        it("should copy an object", function() {
            var object = {
                "prop1": "one",
                "prop2": "two"
            };

            var copy = generalUtils.copyObject(object);
            object["prop1"] = "wrong";
            object["prop2"] = "wrong";
            
            copy.should.have.property("prop1", "one");
            copy.should.have.property("prop2", "two");
        });

        it("should strip empty properties off an object", function() {
            var object = {
                "prop1": "one",
                "prop2": ""
            };

            generalUtils.stripEmptyProperties(object);
            object.should.have.property("prop1", "one");
            object.should.not.have.property("prop2");
        });
    });
});
