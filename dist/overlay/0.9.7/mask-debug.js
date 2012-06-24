define("#overlay/0.9.7/mask-debug", ["#jquery/1.7.2/jquery-debug", "#overlay/0.9.7/overlay-debug", "#position/0.9.2/position-debug", "#iframe-shim/0.9.2/iframe-shim-debug", "#widget/0.9.16/widget-debug", "#base/0.9.16/base-debug", "#class/0.9.2/class-debug", "#events/0.9.1/events-debug", "#base/0.9.16/aspect-debug", "#base/0.9.16/attribute-debug", "#widget/0.9.16/daparser-debug", "#widget/0.9.16/auto-render-debug"], function(require, exports, module) {

    var $ = require("#jquery/1.7.2/jquery-debug"),
        Overlay = require("#overlay/0.9.7/overlay-debug"),
        isIE6 = ($.browser || 0).msie && $.browser.version == 6.0,
        body = $(document.body),
        doc = $(document);


    // Mask
    // ----------
    // 全屏遮罩层组件

    var Mask = Overlay.extend({

        attrs: {
            width: isIE6 ? doc.outerWidth(true) : '100%',
            height: isIE6 ? doc.outerHeight(true) : '100%',

            className: 'ui-mask',
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

        show: function() {
            if (isIE6) {
                this.set('width', doc.outerWidth(true));
                this.set('height', doc.outerHeight(true));
            }
            return Mask.superclass.show.call(this);
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
