define("#iframe-shim/0.9.0/iframe-shim-debug", ["jquery","position"], function(require, exports, module) {

    var $ = require('jquery');
    var Position = require('position');


    // target 为需要被遮盖的目标元素，可以传 `DOM Element` 或 `Selector`
    function Shim(target) {
        // 如果选择器选了多个 DOM，则只取第一个
        this.target = $(target).eq(0);

        this.iframe = createShim();
        this.iframe.appendTo(document.body);
    }


    // 根据目标元素计算 iframe 的显隐、宽高、定位
    Shim.prototype.sync = function() {
        var target = this.target;
        var iframe = this.iframe;

        var height = target.outerHeight();
        var width = target.outerWidth();
        var zIndex = Number(target.css('zIndex'));

        // 如果目标元素隐藏，iframe 也隐藏
        // jquery 判断宽高同时为0才算隐藏，这里判断宽高其中一个为0就隐藏
        // http://api.jquery.com/hidden-selector/
        if (!height || !width || target.is(':hidden')) {
            iframe.hide();
        } else {
            iframe.css({
                'height': height,
                'width': width,
                'zIndex': isNaN(zIndex) ? 0 : (zIndex - 1)
            });

            Position.pin(iframe[0], target[0]);
            iframe.show();
        }

        return this;
    };


    // 销毁 iframe 等
    Shim.prototype.destroy = function() {
        this.iframe.remove();
        delete this.iframe;
        delete this.target;
    };


    if ($.browser.msie && $.browser.version == 6.0) {
        module.exports = Shim;
    } else {
        // 除了 IE6 都返回空的构造函数
        function Noop() {}
        Noop.prototype.sync = Noop;
        Noop.prototype.destroy = Noop;

        module.exports = Noop;
    }


    // Helpers

    function createShim() {
        return $('<iframe>', {
            frameborder: 0,
            css: {
                display: 'none',
                border: 'none',
                opacity: 0,
                position: 'absolute'
            }
        });
    }

});

