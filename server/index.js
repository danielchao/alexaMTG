var Magic = require('./magic');

exports.handler = function (event, context) {
    new Magic().execute(event, context);
};
