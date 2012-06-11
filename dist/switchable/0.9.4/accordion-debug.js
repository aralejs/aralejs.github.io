define("#switchable/0.9.4/accordion-debug", ["./switchable"], function(require, exports, module) {

    var Switchable = require('./switchable');

    // 手风琴组件
    var Accordion = Switchable.extend({

        attrs: {
            triggerType: 'click',

            // 是否运行展开多个
            multiple: false
        },

        // 重复触发时的有效判断
        _triggerIsValid: function() {
            // multiple 模式下，再次触发意味着切换展开/收缩状态
            console.log(true)
            return true;
        }
    });

    module.exports = Accordion;

});
