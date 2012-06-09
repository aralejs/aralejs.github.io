define("#base/0.9.15/base-debug", ["class","events","./aspect","./attribute"], function(require, exports, module) {

    // Base
    // ---------
    // Base 是一个基础类，提供 Class、Events、Attrs 和 Aspect 支持。


    var Class = require('class');
    var Events = require('events');
    var Aspect = require('./aspect');
    var Attribute = require('./attribute');


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
