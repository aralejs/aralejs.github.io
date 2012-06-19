define("#popup/0.9.5/dropdown-debug", ["#popup/0.9.5/popup-debug", "#jquery/1.7.2/jquery-debug", "#overlay/0.9.7/overlay-debug", "#position/0.9.2/position-debug", "#iframe-shim/0.9.2/iframe-shim-debug", "#widget/0.9.16/widget-debug", "#base/0.9.16/base-debug", "#class/0.9.2/class-debug", "#events/0.9.1/events-debug", "#base/0.9.16/aspect-debug", "#base/0.9.16/attribute-debug", "#widget/0.9.16/daparser-debug", "#widget/0.9.16/auto-render-debug"], function(require, exports, module) {

    var Popup = require("#popup/0.9.5/popup-debug");


    var Dropdown = Popup.extend({

        setup: function() {
            Dropdown.superclass.setup.call(this);
            this._tweakAlignDefaultValue();
        },

        // 调整 align 属性的默认值
        _tweakAlignDefaultValue: function() {
            var align = this.get('align');

            // 默认坐标在目标元素左下角
            if (align.baseXY.toString() === [0, 0].toString()) {
                align.baseXY = [0, '100%'];
            }

            // 默认基准定位元素为 trigger
            if (align.baseElement._id === 'VIEWPORT') {
                align.baseElement = this.get('trigger');
            }

            this.set('align', align);
        }
    });

    module.exports = Dropdown;

});
