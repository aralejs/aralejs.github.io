define("#switchable/0.9.4/slide-debug", ["./switchable"], function(require, exports, module) {
    var Switchable = require('./switchable');

    // 卡盘轮播组件
    module.exports = Switchable.extend({
        attrs: {
            autoplay: true,
            circular: true
        }
    });
});
