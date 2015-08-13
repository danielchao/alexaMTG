var AlexaSkill = require('./AlexaSkill'),
    jsonfile = require('jsonfile'),
    _ = require('underscore'),
    intentHandlers = require('./intents'),
    eventHandlers = require('./events');

var MTG_FILE = './AllCards.json';

var APP_ID = undefined;  //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

var cards = _.values(jsonfile.readFileSync(MTG_FILE));
var cardsByName = _.indexBy(cards, function (card) {
    return card.name.toLowerCase();
});

var skillContext = {
	cardsByName: cardsByName,
	cards: cards,
};

var Magic = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Magic.prototype = Object.create(AlexaSkill.prototype);
Magic.prototype.constructor = Magic;

eventHandlers.register(Magic.prototype.eventHandlers, skillContext);
intentHandlers.register(Magic.prototype.intentHandlers, skillContext);

exports.handler = function (event, context) {
    new Magic().execute(event, context);
};

module.exports = Magic;
