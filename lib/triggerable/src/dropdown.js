define(function(require, exports, module) {

    var Triggerable = require('./triggerable');


    var Dropdown = Triggerable.extend({

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
