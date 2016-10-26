// =========================================================
// Imports
// =========================================================
var konphyg = require('konphyg')(__dirname + '/config');
global.config = konphyg('app');
var restify = require('restify');
var builder = require('botbuilder');
var PrimalAPI = require('./primalAPI.js').primalAPI
var scraper = require('./utils/imageScraper.js');
var cardBuilder = require('./utils/cardbuilder.js');

// =========================================================
// Static Variables
// =========================================================
var CONFIG = global.config;

// =========================================================
// Bot Setup
// =========================================================

var model = process.env.model || 'https://api.projectoxford.ai/luis/v1/application?id=5214e0f4-b970-470d-bd38-c62b733955d2&subscription-key=aac6498cedc243bd96452f5114d9110a';
var recognizer = new builder.LuisRecognizer(model);

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

var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
var bot = new builder.UniversalBot(connector);
bot.dialog('/', dialog);

server.post('/api/messages', connector.listen());

//=========================================================
// Bots Global Actions
//=========================================================

//=========================================================
// Bots Dialogs
//=========================================================
// Add intent handlers
dialog.matches('ValidQuery', [
    function (session, args, next) {
        // Resolve and store any entities passed from LUIS.
        var title = builder.EntityRecognizer.findEntity(args.entities, 'Subject');
        // var time = builder.EntityRecognizer.resolveTime(args.entities);
        session.send("Hey I heard you ask for stuff about: %s", title.entity);
        session.sendTyping();
        PrimalAPI.recommendations(title.entity, null, function(content) {
            session.beginDialog("/respondWithContent", content);
        }, function(errorMessage) { console.log(errorMessage);} );
    }
]);

dialog.onDefault(builder.DialogAction.send("InvalidQuery"));

bot.dialog('/respondWithContent', [
    function(session, results) {
        scraper.addPreviewImages(results, function(content) { 
              var msg = cardBuilder.buildList(session, content); 
              session.endDialog(msg);
          }, function(errorMessage) { console.log(errorMessage); });
    }
]);