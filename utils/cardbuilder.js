var builder = require('botbuilder');

exports.buildList = function(session, content) {
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
    
    return msg;
}

exports.buildCarousel = function(session, content) {
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
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(prettyCards);
    
    return msg;
}