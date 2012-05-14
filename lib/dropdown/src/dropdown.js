// May the Source be with you
// 愿源码与你同在

define(function(require, exports, module) {
    var $ = require('jquery');
    var Base = require('base');
    var Overlay = require('overlay');
    var Dropdown = Base.extend({
        options: {
            trigger: '', // required
            target: '.ui-dropdown',
            triggerType: 'hover', // click, hover
            position: 'left', // center, right
            container: 'ui-content',
            animateType: 'toggle', // height, width, opacity
            x: 0,
            y: 0,
            z: 99 // z-index
        },

        initOverlay: function() {
            var opt = this.options;
            var $trigger = $(opt.trigger);
            var $target = $(opt.target);
            var overlay = new Overlay({
                srcNode: $trigger[0],
                content : $(opt.target).html(),
                parentNode : $trigger.parent(),
                height : 100,
                x : opt.x,
                y : opt.y,
                zIndex : opt.z
            });
            return overlay;
        },

        initialize: function(options) {
            if (!options || !options.trigger) {
                throw 'options/trigger missing';
            }
            this.setOptions(options);
            var opt = this.options;
            $(opt.trigger).on(opt.triggerType, function() {
                var $source = $(this);
                var $target = that.initOverlay();
                $target.toggle(that.options.animateType);
            });
        }
    });

    module.exports = Dropdown;

});
