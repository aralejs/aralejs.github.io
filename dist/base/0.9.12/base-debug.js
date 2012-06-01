define("#base/0.9.12/base-debug", ["class","events","./aspect","./attribute"], function(require, exports, module) {

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

            // 对于 Base 来说，`change:attr` 事件的含义应该是在实例化后，当属性有变化
            // 时触发，初始化过程中不应该触发。
            delete this.__changedAttrs;

            // 标识实例已准备好
            this.__ready = true;
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

});
