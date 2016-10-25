// Setup global config for methods that use config properties
var konphyg = require("konphyg")(__dirname + "/../config");
global.config = konphyg("app");

// Import test packages
var restler = require("restler");
var should = require("chai").should();

/**
 * mocha.opts is read by mocha everytime npm test is run.
 * Global settings can be set in this file for all your test suites.
 */
