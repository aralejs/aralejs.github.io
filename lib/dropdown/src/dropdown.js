// May the Source be with you
// 愿源码与你同在

define(function(require, exports, module) {
    var $ = require('jquery');
    var Position = require('position');
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
            timeout: 100
        },

        _bindTrigger: function() {
            var that = this;
            var trigger = this.get('trigger');
            var triggerType = this.get('triggerType');
            var enterTimeout;
            var leaveTimeout;
            var leaveHandler = function() {
                clearTimeout(enterTimeout);
                leaveTimeout = setTimeout(function() {
                    that.set('visible', false);
                }, that.get('timeout'));
            };
            var enterHandler = function() {
                clearTimeout(leaveTimeout);
            };

            trigger.on(triggerType, function(e) {
                e.preventDefault();
                clearTimeout(leaveTimeout);
                if (triggerType === 'click') {
                    that.set('visible', !that.get('visible'));
                } else {
                    enterTimeout = setTimeout(function() {
                        that.set('visible', true);
                    }, that.get('delay'));
                }
            });

            // 处理鼠标与浮层的联动
            trigger.add(this.element).hover(enterHandler, leaveHandler);
        },

        _preAlign: function() {
            var align = this.get('align');
            if (align.baseXY.toString() === [0,0].toString()) {
                // 重设默认坐标在目标元素左下角
                align.baseXY = [0, '100%'];
            }
            if (align.baseElement._id === 'VIEWPORT') {
                // 重设置基准定位元素为 trigger
                align.baseElement = this.get('trigger')[0];
            }
            this.set('align', align);
        },

        setup: function() {
            Dropdown.superclass.setup.call(this);
            this._preAlign();
            this._bindTrigger();
        }

    });

    module.exports = Dropdown;

});
