define("#base/0.9.16/base-debug", ["#class/0.9.2/class-debug", "#events/0.9.1/events-debug", "#base/0.9.16/aspect-debug", "#base/0.9.16/attribute-debug"], function(require, exports, module) {

    // Base
    // ---------
    // Base 是一个基础类，提供 Class、Events、Attrs 和 Aspect 支持。


    var Class = require("#class/0.9.2/class-debug");
    var Events = require("#events/0.9.1/events-debug");
    var Aspect = require("#base/0.9.16/aspect-debug");
    var Attribute = require("#base/0.9.16/attribute-debug");


    var Base = Class.create({
        Implements: [Events, Aspect, Attribute],

        initialize: function(config) {
            this.initAttrs(config);
        },

        destroy: function() {
            this.off();

            for (var p in this) {
                if (this.hasOwnProperty(p)) {
                    delete this[p];
                }
            }
        }
    });

    module.exports = Base;

});
