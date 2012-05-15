// May the Source be with you
// 愿源码与你同在

define(function(require, exports, module) {
    var $ = require('jquery');
    var Base = require('base');
    var Overlay = require('overlay');
    var MyOverlay = Overlay.extend({
        getElem: function() {
            return this.srcNode;
        },
        toggle: function() {
            $(this.srcNode).toggle();
        }
    });
    var Dropdown = Base.extend({
        options: {
            trigger: '', // required
            triggerType: 'hover', // click, hover
            target: '.ui-dropdown',
            position: 'left', // center, right
            container: 'ui-content',
            animateType: '', // height, width, opacity
            width: 'auto',
            height: 'auto',
            speed: '200',
            x: 0,
            y: 0,
            z: 999 // z-index
        },

        initOverlay: function() {
            var opt = this.options;
            var $trigger = $(opt.trigger);
            var $target = $(opt.target);
            var overlay = new MyOverlay({
                //srcNode: $trigger[0],
                template: '<div class="ui-dropdown"></div>',
                content : $target.html(),
                parentNode : $trigger.parent()[0],
                width : opt.width,
                height : opt.heigth,
                zIndex: opt.z,
                baseObject : {
                    element: $trigger[0],
                    x : 0,
                    y : $trigger.height(),
                }
            });
            return overlay;
        },

        initialize: function(options) {
            if (!options || !options.trigger) {
                throw 'options/trigger missing';
            }
            this.setOptions(options);
            var that = this;
            var opt = this.options;
            var $target;
            $(opt.trigger).on(opt.triggerType, function() {
                if (!$target) {
                    $target = that.initOverlay();
                }
                $target.render().show();
            });
            $(opt.trigger).parent().on('hover', $.noop, function() {
                if ($target) {
                    $target.hide();
                }
            });
        }
    });

    module.exports = Dropdown;

});
