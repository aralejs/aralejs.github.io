define("#popup/0.9.5/popup-debug", ["#jquery/1.7.2/jquery-debug", "#overlay/0.9.7/overlay-debug", "#position/0.9.2/position-debug", "#iframe-shim/0.9.2/iframe-shim-debug", "#widget/0.9.16/widget-debug", "#base/0.9.16/base-debug", "#class/0.9.2/class-debug", "#events/0.9.1/events-debug", "#base/0.9.16/aspect-debug", "#base/0.9.16/attribute-debug", "#widget/0.9.16/daparser-debug", "#widget/0.9.16/auto-render-debug"], function(require, exports, module) {

    var $ = require("#jquery/1.7.2/jquery-debug");
    var Overlay = require("#overlay/0.9.7/overlay-debug");


    // Popup 是可触发 Overlay 型 UI 组件
    var Popup = Overlay.extend({

        attrs: {
            // 触发元素
            trigger: {
                value: null, // required
                getter: function(val) {
                    return $(val);
                }
            },
            // 触发类型
            triggerType: 'hover', // or click

            // 延迟触发和隐藏时间
            delay: 100
        },

        setup: function() {
            Popup.superclass.setup.call(this);
            this._bindTrigger();
        },

        toggle: function() {
            this[this.get('visible') ? 'hide' : 'show']();
        },

        _bindTrigger: function() {
            var trigger = this.get('trigger');
            var triggerType = this.get('triggerType');
            var delay = this.get('delay');

            var showTimer, hideTimer;
            var that = this;

            if (triggerType === 'click') {
                trigger.on(triggerType, function(ev) {
                    ev.preventDefault();
                    that.toggle();
                });
            }
            else if (triggerType === 'focus') {
                trigger.on('focus blur', function() {
                    that.toggle();
                });
            }
            // 默认是 hover
            else {
                trigger.hover(function() {
                    clearTimeout(hideTimer);

                    if (!that.get('visible')) {
                        showTimer = setTimeout(function() {
                            that.show();
                        }, delay);
                    }
                }, leaveHandler);

                // 鼠标在悬浮层上时不消失
                this.element.hover(function() {
                    clearTimeout(hideTimer);
                }, leaveHandler);
            }

            function leaveHandler() {
                clearTimeout(showTimer);

                if (that.get('visible')) {
                    hideTimer = setTimeout(function() {
                        that.hide();
                    }, delay);
                }
            }
        }
    });

    module.exports = Popup;

});
