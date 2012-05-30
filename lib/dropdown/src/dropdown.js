// May the Source be with you
// 愿源码与你同在

define(function(require, exports, module) {
    var $ = require('jquery');
    var Overlay = require('overlay');
    var Position = require('position');

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
                value: 'mouseenter', // 支持：click|hover|mouseover|mouseleave
                getter: function(val) {
                    // 将 hover|mouseenter 转换为 mouseenter 事件
                    return val.replace(/hover|mouseover/i,'mouseenter');
                }
            },
            // 延迟触发时间, 单位:秒
            delay: {
                value: 0.1,
                getter: function(val){
                    return val * 1000;
                }
            },
            // 鼠标移出浮层后自动隐藏的时间, 单位:秒
            timeout: {
                value: 0.1,
                getter: function(val){
                    return val * 1000;
                }
            },
            // 相对于 trigger 元素的坐标
            offset: [], // [x,y]
            // 是否可见
            visible: false
            // 其余参数请参考 Overlay 文档
        },

        _setupAttr: function() {
            var trigger = this.get('trigger');
            var offset = this.get('offset');
            if (!offset.length) {
                // 默认值为浮层在当前元素下面。
                this.set('offset', [0, trigger.height()]);
            }
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

        _onChangeOffset: function(val) {
            var trigger = this.get('trigger');
            this.set('position', {
                // element 的定位点，默认为左上角
                selfXY: [0, 0],
                // 基准定位元素，默认为当前可视区域
                baseElement: trigger.selector,
                // 基准定位元素的定位点，默认为左上角
                baseXY: val
            });
        },

        setup: function() {
            Dropdown.superclass.setup.call(this);
            this._setupAttr();
            this._bindTrigger();
        }

    });

    module.exports = Dropdown;

});
