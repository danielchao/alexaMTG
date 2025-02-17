var _ = require('underscore');
var s = require('underscore.string');

var registerIntentHandlers = function (intentHandlers, skillContext) {
    var cards = skillContext.cards,
        cardsByName = skillContext.cardsByName;

    intentHandlers.randomCardIntent = function (intent, session, response) {
        var card = randomCard(cards);
        var description = cardString(card);
        response.tellWithCard(description, card.name, description);
    };
    intentHandlers.cardLookupIntent = function (intent, session, response) {
        var query = intent.slots.Name.value.toLowerCase();
        var card, description;
        console.log("Looking up " + query);
        if (cardsByName[query]) {
            card = cardsByName[query];
            description = cardString(card);
            response.tellWithCard(description, card.name, description);
        } else {
            card = _.min(cardsByName, function (card, name) { 
                return s.levenshtein(name, query);
            });
            description = cardString(card);
            response.tellWithCard(description, card.name, description);
        }
    };
    intentHandlers.cardAttributeIntent = function (intent, session, response) {
        var type = s.capitalize(intent.slots.Type.value),
            color = s.capitalize(intent.slots.Color.value);
            cmc = parseInt(intent.slots.Cmc.value);

        console.log('Searching: type -  ' + type, 'color - ' + color,  'cmc - ' + cmc);
        // var validTypes = ['Creature', 'Enchantment', 'Artifact', 'Instant', 'Sorcery', 'Planeswalker', 'Land'];
        // var validColors = ['Green', 'Red', 'Blue', 'Black', 'White'];
        var validCards = _.filter(cards, function (card) {
            var valid = true;
            if (color) {
                if (color === 'Colorless') {
                    if (card.colors) valid = false;
                } else if (!_.contains(card.colors? card.colors: [], color)) {
                    valid = false;
                }
            }
            if (_.isFinite(cmc) && card.cmc !== cmc) {
                valid = false;
            }
            if (type && !_.contains(card.types? card.types: [], type)) {
                valid = false;
            }
            return valid;
        });
        if (!validCards.length) {
            response.tell('Unable to find such a card');
        } else {
            var card = randomCard(validCards);
            response.tellWithCard(card.name, card.name, cardString(card));
        }
    };
};

function randomCard (cards) {
    return cards[_.random(0, cards.length - 1)];
}

function cardString (card) {
    var details = _.flatten([
            card.name, 
            card.type, 
            card.manaCost, 
            card.power? card.power + ' ' + card.toughness: null, 
            card.text
        ]);
    return details.join('. ');
}

exports.register = registerIntentHandlers;