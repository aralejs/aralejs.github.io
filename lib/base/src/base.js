define(function(require) {
    var Class = require('class');
    var Events = require('events');
    var Options = require('./options');

    return Class.create({
        Implements: [Events, Options]
    });
});
