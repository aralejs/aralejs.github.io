// May the Source be with you
// 愿源码与你同在

define(function(require, exports, module) {
    var $ = require('jquery');
    var Overlay = require('overlay');
    var Position = require('position');

    var Dropdown = Overlay.extend({
        attrs: {
            trigger: {
                value: null, // required
                getter: function(val) {
                    return $(val);
                }
            }, 
            triggerType: {
                value: 'hover' // click|hover
            }, 
            delay: 0.1, // 延迟触发时间, 单位:秒
            timeout: 0.1, // 鼠标移出浮层后自动隐藏的时间。
            offset: [0, 0], // [x,y]
            visible: false
            // 其余参数请参考 Overlay 文档
        },

        _setupAttr: function() {
            var triggerNode = this.get('trigger');
            var offset = this.get('offset');
            if (!offset) {
                offset = [0, triggerNode.height()];
            }
            this.set('position', {
                // element 的定位点，默认为左上角
                selfXY: [0, 0],
                // 基准定位元素，默认为当前可视区域
                baseElement: triggerNode.selector,
                // 基准定位元素的定位点，默认为左上角
                baseXY: offset
            });
        },

        _bindTrigger: function() {
            var that = this;
            var enterTimeout;
            var leaveTimeout;
            var leaveHandler = function() {
                window.clearTimeout(enterTimeout);
                leaveTimeout = window.setTimeout(function() {
                    that.hide();
                }, that.get('timeout') * 1000);
            };
            var enterHandler = function() {
                window.clearTimeout(leaveTimeout);
            };
            var triggerNode = this.get('trigger');
            var triggerType = this.get('triggerType');

            triggerNode.on(triggerType, function(e) {
                e.preventDefault();
                window.clearTimeout(leaveTimeout);
                enterTimeout = window.setTimeout(function() {
                    that.show();
                }, that.get('delay') * 1000);
                if (triggerType === 'click') {
                    window.clearTimeout(enterTimeout);
                    that.set('visible', !that.get('visible'));
                }
            });

            triggerNode.add(this.element).hover(enterHandler, leaveHandler);
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
            this._setupAttr();
            this._bindTrigger();
        }

    });

    module.exports = Dropdown;

});
