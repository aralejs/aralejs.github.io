define(function(require, exports, module) {

    var $ = require('$'),
        Overlay = require('overlay'),
        isIE6 = $.browser && $.browser.msie && $.browser.version == 6.0;

    var Mask = {
        opacity: 0.2,
        backgroundColor: '#000',
        zIndex: 9,

        set: function(options) {
            $.extend(this, options);
            return this;
        },

        show: function() {
            if(!this.overlay) {
                this.overlay = new Overlay({
                    template: '<div id="J_mask"></div>',
                    width: (isIE6 ? $(document.body).outerWidth(true) : '100%'),
                    height: (isIE6 ? $(document.body).outerHeight(true) : '100%'),
                    zIndex: this.zIndex,
                    baseObject: {
                        element: isIE6 ? document.body : undefined, // undefined 表示相对于当前可视范围定位
                        x: 0,
                        y: 0
                    }
                });
                this.overlay.setStyles({
                    'position': (isIE6 ? 'absolute' : 'fixed')
                }).render();
            }
            this.overlay.setStyles({
                'background-color': this.backgroundColor,
                'opacity': this.opacity
            })
            this.overlay.show();
            return this;
        },

        hide: function() {
            this.overlay && this.overlay.hide();
            return this;
        }
    };

    module.exports = Mask;

});

