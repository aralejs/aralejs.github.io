define(function(require, exports, module) {

    var $ = require('jquery');
    var Overlay = require('overlay');


    // Triggerable
    // -------
    // Triggerable 组件是可触发 Overlay。

    var Dropdown = Overlay.extend({

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
            // 延迟触发时间
            delay: 100,
            // 鼠标移出浮层后自动隐藏的时间
            timeout: 100
        },

        setup: function() {
            Dropdown.superclass.setup.call(this);
            this._preAlign();
            this._bindTrigger();
        },

        toggle: function() {
            var visible = this.get('visible');
            this[visible ? 'hide' : 'show']();
        },

        // 调整 align 属性的默认值
        _tweakAlignDefaultValue: function() {
            var align = this.get('align');

            // 重设默认坐标在目标元素左下角
            if (align.baseXY.toString() === [0, 0].toString()) {
                align.baseXY = [0, '100%'];
            }

            // 重设置基准定位元素为 trigger
            if (align.baseElement._id === 'VIEWPORT') {
                align.baseElement = this.get('trigger');
            }

            this.set('align', align);
        },

        // 绑定触发相关事件
        _bindTrigger: function() {
            var trigger = this.get('trigger');
            var triggerType = this.get('triggerType');
            var enterTimer, leaveTimer;
            var that = this;

            trigger.on(triggerType, function(e) {
                e.preventDefault();
                clearTimeout(leaveTimer);

                if (triggerType === 'click') {
                    that.toggle();
                } else {
                    enterTimer = setTimeout(function() {
                        that.show();
                    }, that.get('delay'));
                }
            });

            // 处理鼠标与浮层的联动
            trigger.add(this.element).hover(enterHandler, leaveHandler);

            function leaveHandler() {
                clearTimeout(enterTimer);

                leaveTimer = setTimeout(function() {
                    that.hide();
                }, that.get('timeout'));
            }

            function enterHandler() {
                clearTimeout(leaveTimer);
            }
        }
    });

    module.exports = Dropdown;

});
