// May the Source be with you
// 愿源码与你同在

define("#dropdown/0.9.1/dropdown-debug", ["jquery","overlay"], function(require, exports, module) {
    var $ = require('jquery');
    var Overlay = require('overlay');

    var Dropdown = Overlay.extend({
        attrs: {
            // 触发事件元素
            trigger: {
                value: null, // required
                getter: function(val) {
                    return $(val);
                }
            },
            // 触发事件类型
            triggerType: {
                value: 'mouseenter', // 支持：click|hover|mouseover|mouseenter
                getter: function(val) {
                    // 将 hover/mouseenter 转换为 mouseenter 事件
                    var events = /^(?:hover|mouseover)$/i;
                    return val.replace(events, 'mouseenter');
                }
            },
            // 延迟触发时间
            delay: 100,
            // 鼠标移出浮层后自动隐藏的时间
            timeout: 100,
            // 相对于 trigger 元素的坐标
            offset: {
                value: [], // [x,y]
                getter: function(val) {
                    // 默认坐标在目标元素左下角
                    if (val.length === 0) {
                        val = [0, this.get('trigger').height()];
                    }
                    return val;
                },
                setter: function(val) {
                    var align = this.get('align');
                    var trigger = this.get('trigger')[0];
                    // 替换基准定位元素为 trigger
                    if ($(align.baseElement).is(trigger) !== true ) {
                        align.baseElement = trigger;
                    }
                    align.baseXY = this.get('offset');
                    this.set('align', align, {silent: true});
                }
            },
            // 浮层是否可见
            visible: false
            // 其余参数请参考 Overlay 文档
        },

        _bindTrigger: function() {
            var that = this;
            var trigger = this.get('trigger');
            var triggerType = this.get('triggerType');
            var enterTimeout;
            var leaveTimeout;
            var leaveHandler = function() {
                window.clearTimeout(enterTimeout);
                leaveTimeout = window.setTimeout(function() {
                    that.set('visible', false);
                }, that.get('timeout'));
            };
            var enterHandler = function() {
                window.clearTimeout(leaveTimeout);
            };

            trigger.on(triggerType, function(e) {
                e.preventDefault();
                window.clearTimeout(leaveTimeout);
                if (triggerType === 'click') {
                    that.set('visible', !that.get('visible'));
                } else {
                    enterTimeout = window.setTimeout(function() {
                        that.set('visible', true);
                    }, that.get('delay'));
                }
            });

            // 处理鼠标与浮层的联动
            trigger.add(this.element).hover(enterHandler, leaveHandler);
        },

        _onChangeVisible: function(val) {
            if (val) {
                this.show();
            } else {
                this.hide();
            }
        },

        setup: function() {
            Dropdown.superclass.setup.call(this);
            this._bindTrigger();
        }

    });

    module.exports = Dropdown;

});
