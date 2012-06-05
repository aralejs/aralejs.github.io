define("#overlay/0.9.5/mask-debug", ["$","./overlay"], function(require, exports, module) {

    var $ = require('$'),
        Overlay = require('./overlay'),
        isIE6 = ($.browser || 0).msie && $.browser.version == 6.0,
        body = $(document.body);


    // Mask
    // ----------
    // 遮罩层组件

    var Mask = Overlay.extend({

        attrs: {
            width: isIE6 ? body.outerWidth(true) : '100%',
            height: isIE6 ? body.outerHeight(true) : '100%',

            style: {
                opacity: .2,
                backgroundColor: '#000',
                position: isIE6 ? 'absolute' : 'fixed'
            },

            align: {
                // undefined 表示相对于当前可视范围定位
                baseElement: isIE6 ? body : undefined
            }
        },

        _onRenderBackgroundColor: function(val) {
            this.element.css('backgroundColor', val);
        },

        _onRenderOpacity: function(val) {
            this.element.css('opacity', val);
        }
    });

    // 单例
    module.exports = new Mask();

});
