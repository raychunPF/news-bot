// =========================================================
// Imports
// =========================================================
var konphyg = require('konphyg')(__dirname + '/config');
global.config = konphyg('app');
var restify = require('restify');
var builder = require('botbuilder');
var primalAPI = require('./primalAPI.js').primalAPI
var scraper = require('./utils/imageScraper.js');
var general = require("./utils/general.js");
var jsonld = require('jsonld');

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
        }, function(errorMessage) {
            console.log(errorMessage);
        });
    }
]);

bot.dialog('/respondWithContent', [
    function(session, results) {
        scraper.addPreviewImages(results, function(content) {
            var prettyCards = [];
            for (var i = 0; i < content.length; i++) {
                var item = content[i];
                prettyCards.push(
                    new builder.HeroCard(session)
                        .title(item["title"])
                        .subtitle(item["publisher"])
                        .text(item["description"])
                        .images([ builder.CardImage.create(session, item["image"]) ])
                        .tap(builder.CardAction.openUrl(session, decodeURI(item["url"]), item["publisher"]))
                );
            }
            var msg = new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.list)
                .attachments(prettyCards);

            session.endDialog(msg);
        }, function(errorMessage) {
            console.log(errorMessage);
        });
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

bot.dialog('chooseParameters', [

]);
