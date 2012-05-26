define(function(require) {
    var Class = require('class');
    var Events = require('events');
    var Attribute = require('attribute');
    var Options = require('./options');

    return Class.create({
        Implements: [Events, Attribute, Options],

        destroy: function() {
            for (var p in this) {
                if (this.hasOwnProperty(p)) {
                    delete this[p];
                }
            }
        }
    });
});
