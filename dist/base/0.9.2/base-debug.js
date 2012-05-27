define("#base/0.9.2/base-debug", ["class","events","./attrs","./options"], function(require) {

    var Class = require('class');
    var Events = require('events');
    var Attrs = require('./attrs');
    var Options = require('./options');


    return Class.create({
        Implements: [Events, Attrs, Options],

        initialize: function(config) {
            this._initAttrs(config);
            this._initOptions(config);
        },

        destroy: function() {
            for (var p in this) {
                if (this.hasOwnProperty(p)) {
                    delete this[p];
                }
            }
        }
    });

});
