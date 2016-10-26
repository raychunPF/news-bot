// =========================================================
// Imports
// =========================================================
var jsonld = require('jsonld');
var konphyg = require('konphyg')(__dirname + '/config');
global.config = konphyg('app');
var restify = require('restify');
var builder = require('botbuilder');
var primalAPI = require('./primalAPI.js').primalAPI

var scraper = require('./utils/imageScraper.js');
var general = require("./utils/general.js");
var cardBuilder = require('./utils/cardbuilder.js');

// =========================================================
// Static Variables
// =========================================================
var CONFIG = global.config;

// =========================================================
// Bot Setup
// =========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// For Bot Framework Service
var connector = new builder.ChatConnector({
    appId: config.MICROSOFT_APP_ID,
    appPassword: config.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector);

server.post('/api/messages', connector.listen());

//=========================================================
// Bots Global Actions
//=========================================================

bot.beginDialogAction('start query', '/action', { matches: /^primalbot/i });

//=========================================================
// Bots Dialogs
//=========================================================
bot.dialog('/',
    function (session) {
        // Make sure api properties (eg parameters) are set before calling any of the apis
        if (!session.userData.apiPropertiesSet) {
            general.setApiProperties(session);
        }

        if (/^extract/i.test(session.message.text)) {
            session.beginDialog('/extract');
        } else if (/^primalbot/i.test(session.message.text)) {
            session.beginDialog('/action');
        } else if (/^params/i.test(session.message.text)) {
            session.beginDialog('/updateParameters');
        } else if (/^reset/i.test(session.message.text)) {
            session.beginDialog("/reset");
        } else {
            session.send("Sorry, I didn't understand the command!");
        }
    }
);

bot.dialog("/action", [
    function (session) {
        var query = session.message.text.substr(session.message.text.indexOf(' ')+1);
        session.send("Hey I heard you ask for stuff about: %s", query);
        session.sendTyping();
        primalAPI.recommendations(query, null, function(content) {
            session.beginDialog("/respondWithContent", content);
        }, function(errorMessage) { console.log(errorMessage); });
    }
]);

bot.dialog('/respondWithContent', [
    function(session, results) {
        scraper.addPreviewImages(results, function(content) { 
              var msg = cardBuilder.buildList(session, content); 
              session.endDialog(msg);
          }, function(errorMessage) { console.log(errorMessage); });
    }
]);

bot.dialog('/extract', [
    function (session) {
        builder.Prompts.text(session, 'Give me text or a url of the page you want me to extract topics from');
    },
    function (session, results) {
        session.sendTyping();
        var params = general.copyObject(session.userData.extraction);

        primalAPI.extraction(results.response, params, function(extractedTopics) {
            jsonld.expand(extractedTopics, function(errE, expanded) {
                if (errE) {
                    session.endDialog("Error expanding");
                } else {
                    jsonld.compact(expanded, extractedTopics['@context'], function(errC, compacted) {
                        if (errC) {
                            session.endDialog("Error compacting");
                        } else {
                            console.log(JSON.stringify(compacted, null, 2));
                            session.endDialog("Successfully extracted");
                        }
                    });
                }
            });
        }, function(errorMessage) {
            console.log(errorMessage);
            session.endDialog("Unsuccessfully extracted");
        })
    }
]);

var api = {
    "recommendations": { value: "recommendations", params: "RECOMMENDATIONS" },
    "interests data": { value: "interestsData", params: "INTERESTS_DATA" },
    "extraction": { value: "recommendations", params: "EXTRACTION" }
}

bot.dialog("/updateParameters", [
    function (session) {
        builder.Prompts.choice(session, "Which api parameters do you want to change?", api);
    },
    function (session, results) {
        if (results.response) {
            session.dialogData["api"] = api[results.response.entity].value;
            var apiParams = api[results.response.entity].params;
            apiParams = JSON.parse(JSON.stringify(CONFIG[apiParams].PARAMS));
            builder.Prompts.choice(session, "Which parameter do you want to change", apiParams);
        } else { session.endDialog("Error: No api choice found"); }
    },
    function(session, results) {
        if (results.response) {
            session.dialogData["param"] = results.response.entity;
            builder.Prompts.text(session, "Enter a value for " + results.response.entity + ":");
        } else { session.endDialog("Error: No parameter choice found"); }
    },
    function (session, results) {
        if (results.response) {
            var paramValue;
            // Account for url inputs
            if (/<([^>|\|]+)/g.test(results.response)) {
                paramValue = results.response.match(/[^<>|\s]+/g)[0];
            } else {
                paramValue = results.response;
            }
            var apiName = session.dialogData["api"];
            var paramName = session.dialogData["param"]
            session.userData[apiName][paramName] = paramValue;
            session.endDialog("All done! %s for %s has been updated to %s", paramName, apiName, paramValue);
        } else {
            session.endDialog("Error: No Value found");
        }
    }
]);

bot.dialog("/reset", [
    function (session) {
        for (var key in session.userData) {
            delete session.userData[key];
        }
        session.endConversation("Reset - userData and privateConversationData cleared");
    }
]);
