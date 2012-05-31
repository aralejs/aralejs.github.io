define(function(require, exports, module) {

    var $ = require('$'),
        Overlay = require('./overlay'),
        isIE6 = ($.browser || 0).msie && $.browser.version == 6.0;

    var Mask = Overlay.extend({
        attrs: {
            opacity: 0.2,
            backgroundColor: '#000',
            template: '<div id="J_mask"></div>',
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

        render: function() {
            Mask.superclass.render.call(this);
            this.element.hide();
            return this;
        },

        show: function() {
            if(!this._rendered) {
                this.render();
                this._rendered = true;
            }
            Mask.superclass.show.call(this);
        },

        _onChangeBackgroundColor: function(val) {
            this.element.css('backgroundColor', val);
        },

        _onChangeOpacity: function(val) {
            this.element.css('opacity', val);
        }

    });

    var maskInstance;

    module.exports = (function() {
        if (!maskInstance) {
            maskInstance = new Mask({
                width: (isIE6 ? $(document.body).outerWidth(true) : '100%'),
                height: (isIE6 ? $(document.body).outerHeight(true) : '100%')
            });
        }
        return maskInstance;
    })();

});

