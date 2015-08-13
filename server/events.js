
var registerEventHandlers = function (eventHandlers, skillContext) {
    eventHandlers.onLaunch = function (launchRequest, session, response) {
        response.ask("You can ask me for cards!");
    };
};
exports.register = registerEventHandlers;