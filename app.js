// =========================================================
// Imports
// =========================================================
var konphyg = require('konphyg')(__dirname + '/config');
global.config = konphyg('app');
var restify = require('restify');
var builder = require('botbuilder');
var PrimalAPI = require('./primalAPI.js').primalAPI
var scraper = require('./utils/imageScraper.js');
var general = require("./utils/general.js");

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
    function(session) {
        if( /^primalbot/i.test(session.message.text)) { session.beginDialog('/action'); }
        // else session.send("Sorry, I didn't understand the command!");
    }
);

bot.dialog("/action", [
    function (session) {
        var query = session.message.text.substr(session.message.text.indexOf(' ')+1);
        session.send("Hey I heard you ask for stuff about: %s", query);
        session.sendTyping();
        PrimalAPI.recommendations(query, null, function(content) {
            session.beginDialog("/respondWithContent", content);
        }, function(message) { console.log(message);} );
    }
]);

bot.dialog('/respondWithContent', [
    function(session, results) {
        console.log(results);
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
        }, function() {console.log("err"); });
    }
]);

bot.dialog("/params", [
    function(session, args) {
        session.dialogData.index = args ? args.index : 0;
        session.dialogData.form = args ? args.form : {};
        
        builder.Prompts.text
    }
]);
