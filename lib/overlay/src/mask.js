define(function(require, exports, module) {

    var $ = require('$'),
        Overlay = require('./overlay'),
        isIE6 = ($.browser || 0).msie && $.browser.version == 6.0;


    // Mask
    // ----------
    // 遮罩层组件

    var Mask = Overlay.extend({

        attrs: {
            template: '<div id="J_mask"></div>',
            width: (isIE6 ? $(document.body).outerWidth(true) : '100%'),
            height: (isIE6 ? $(document.body).outerHeight(true) : '100%'),
            opacity: 0.2,
            backgroundColor: '#000',
            visible: 'false',
            align: {
                // undefined 表示相对于当前可视范围定位
                baseElement: isIE6 ? document.body : undefined,
                baseXY: [0, 0]
            }
        },

        setup: function() {
            this.element.css({
                'position': (isIE6 ? 'absolute' : 'fixed')
            });
        },

        _onRenderBackgroundColor: function(val) {
            this.element.css('backgroundColor', val);
        },

        _onRenderOpacity: function(val) {
            this.element.css('opacity', val);
        }

    });


    var maskInstance;

    module.exports = (function() {
        if (!maskInstance) {
            maskInstance = new Mask({});
        }
        return maskInstance;
    })();

});

