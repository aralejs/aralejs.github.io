// May the Source be with you
// 愿源码与你同在

define(function(require, exports, module) {
    var $ = require('jquery');
    var Widget = require('widget');
    var Overlay = require('overlay');
    var Dropdown = Widget.extend({
        options: {
            trigger: null, // required
            triggerType: 'hover', // click|hover
            element: '', // the overlay target
            width: 'auto',
            height: 'auto',
            timeout: '200', //鼠标移出覆层后自动隐藏的时间。
            x: 0,
            y: 0,
            z: 99 // z-index
        },

        initOverlay: function(options) {
            options = options || this.options;
            var that = this;
            var overlay = new Overlay({
                element: that.element,
                parentNode : that.element.parent()[0] || document.body,
                width : options.width,
                height : options.heigth,
                zIndex: options.z,
                baseObject : {
                    element: this.triggerNode[0],
                    x : options.x,
                    y : options.y
                }
            });
            return overlay;
        },

        parseElement: function() {
            Dropdown.superclass.parseElement.call(this);
            var options = this.options;
            this.triggerNode = $(options.trigger);
            this.overlay = this.initOverlay().render();
        },

        show: function() {
            this.overlay.show();
            this.trigger('shown');
        },

        hide: function() {
            this.overlay.hide();
            this.trigger('hidden');
        },

        toggle: function(e) {
            var trigger = $(e.target);
            var target;
            if (trigger.data('target')) {
                target = $(trigger.data('target'));
            } else if (trigger.attr('href')) {
                target = $(trigger.attr('href'));
            } else {
                if (trigger.parent().find('.ui-dropdown')) {
                    target = trigger.parent().find('.ui-dropdown');
                } else {
                    throw 'No targets for dropdown';
                }
            }
            target.toggle();
        },

        delegateEvents: function() {
            var that = this;
            var options = this.options;
            var timeout;
            var hide = function() {
                timeout = window.setTimeout(function() {
                    that.hide();
                }, options.timeout);
            };
            var clear = function() {
                window.clearTimeout(timeout);
            };

            //data-api
            $('body').on('click.dropdown.data-api', '[data-toggle="dropdown"]', 
                this.toggle);

            this.triggerNode.on(options.triggerType, function(e) {
                e.preventDefault();
                var $this = $(this);
                var status = $this.data('status');
                that.show();
                // 以下代码可以考虑是否让 Overlay 提供 toggle 方法。
                if (options.triggerType === 'click') {
                    if (!status || status === 'hidden') {
                        that.show();
                        $this.data('status', 'shown');
                    } else {
                        that.hide();
                        $this.data('status', 'hidden');
                    }
                }
            }).on('mouseover', clear).on('mouseout', hide);
            this.element.on('mouseover', clear).on('mouseout', hide);
        },

        init: function() {
        }
    });

    module.exports = Dropdown;

});
