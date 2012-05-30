define("#base/0.9.9/base-debug", ["class","events","./aspect","./attribute"], function(require, exports, module) {

    var Class = require('class');
    var Events = require('events');
    var Aspect = require('./aspect');
    var Attribute = require('./attribute');


    var Base = Class.create({
        Implements: [Events, Aspect, Attribute],

        initialize: function(config) {
            this._parseEventsFromConfig(config);
            this.initAttrs(config);
        },

        // Convert `on/before/afterXxx` config to event handler.
        _parseEventsFromConfig: function(config) {
            for (var key in config) {
                var value = config[key], m;

                if (typeof value === 'function' &&
                        (m = key.match(EVENT_PATTERN))) {
                    this[m[1]](getEventName(m[2]), value);
                    delete config[key];
                }
            }
        },

        destroy: function() {
            for (var p in this) {
                if (this.hasOwnProperty(p)) {
                    delete this[p];
                }
            }
        }
    });

    module.exports = Base;


    // Helpers
    // -------

    var EVENT_PATTERN = /^(on|before|after)([A-Z].*)$/;
    var EVENT_NAME_PATTERN = /^(Change)?([A-Z])(.*)/;

    // Converts `Show` to `show` and `ChangeTitle` to `change:title`
    function getEventName(name) {
        var m = name.match(EVENT_NAME_PATTERN);
        var ret = m[1] ? 'change:' : '';
        ret += m[2].toLowerCase() + m[3];
        return ret;
    }

});
