define("#base/0.9.3/base-debug", ["class","events","./attrs","./options","./aspect"], function(require) {

    var Class = require('class');
    var Events = require('events');
    var Attrs = require('./attrs');
    var Options = require('./options');
    var Aspect = require('./aspect');


    return Class.create({
        Implements: [Events, Attrs, Options, Aspect],

        initialize: function(config) {
            this.initAttrs(config);
            this.initOptions(config);
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
