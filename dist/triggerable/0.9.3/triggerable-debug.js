define("#triggerable/0.9.3/triggerable-debug", ["jquery","overlay"], function(require, exports, module) {

    var $ = require('jquery');
    var Overlay = require('overlay');


    // Triggerable 是可触发 Overlay 型 UI 组件
    var Triggerable = Overlay.extend({

        attrs: {
            // 触发元素
            trigger: {
                value: null, // required
                getter: function(val) {
                    return $(val);
                }
            },
            // 触发类型
            triggerType: {
                value: 'mouseenter', // or click|hover|mouseover
                getter: function(val) {
                    return val.replace(/^(?:hover|mouseover)$/i, 'mouseenter');
                }
            },
            // 延迟触发和隐藏时间
            delay: 100
        },

        setup: function() {
            Triggerable.superclass.setup.call(this);
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

                function leaveHandler() {
                    clearTimeout(showTimer);

                    if (that.get('visible')) {
                        hideTimer = setTimeout(function() {
                            that.hide();
                        }, delay);
                    }
                }
            }
        }
    });

    module.exports = Triggerable;

});
