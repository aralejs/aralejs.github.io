// May the Source be with you
// 愿源码与你同在

define(function(require, exports, module) {
    var $ = require('jquery');
    var Widget = require('widget');
    var Overlay = require('overlay');
    var Dropdown = Widget.extend({
        options: {
            trigger: null, // required
            triggerType: 'hover', // click, hover
            element: '', // the overlay target
            position: 'left', // supported: left center, right
            container: 'ui-content',
            animateType: 'toggle', // height, width, opacity
            width: 'auto',
            height: 'auto',
            speed: '200',
            x: 0,
            y: 0,
            z: 99 // z-index
        },

        parseElement: function() {
            Dropdown.superclass.parseElement.call(this);
            var options = this.options;
            options.trigger = $(options.trigger);
        },

        parseDataAttrs: function() {
        },

        initOverlay: function() {
            var options = this.options;
            var $trigger = options.trigger;
            var $element = this.element;
            var overlay = new Overlay({
                element: $element,
                parentNode : $element.parent()[0],
                width : options.width,
                height : options.heigth,
                zIndex: options.z,
                baseObject : {
                    element: $trigger[0],
                    x : options.x,
                    y : options.y,
                }
            });
            return overlay;
        },

        toggle: function() {
        },

        delegateEvents: function() {
            var options = this.options;
            var $element;
            var that = this;

            //data-api
            $('body').on('click.dropdown.data-api', '[data-toggle="dropdown"]', this.toggle)

            options.trigger.on(options.triggerType, function() {
                if (!$element) {
                    $element = that.initOverlay();
                }
                $element.render().show();
            });
            options.trigger.parent().on('hover', $.noop, function() {
                if ($element) {
                    $element.hide();
                }
            });
        },

        init: function() {
        }
    });

    module.exports = Dropdown;

});
