define("#iframe-shim/0.9.3/iframe-shim-debug", ["#jquery/1.7.2/jquery-debug", "#position/0.9.2/position-debug"], function(require, exports, module) {

    var $ = require("#jquery/1.7.2/jquery-debug");
    var Position = require("#position/0.9.2/position-debug");


    // target 是需要添加垫片的目标元素，可以传 `DOM Element` 或 `Selector`
    function Shim(target) {
        // 如果选择器选了多个 DOM，则只取第一个
        this.target = $(target).eq(0);
    }


    // 根据目标元素计算 iframe 的显隐、宽高、定位
    Shim.prototype.sync = function() {
        var target = this.target;
        var iframe = this.iframe;

        var height = target.outerHeight();
        var width = target.outerWidth();

        // 如果目标元素隐藏，则 iframe 也隐藏
        // jquery 判断宽高同时为 0 才算隐藏，这里判断宽高其中一个为 0 就隐藏
        // http://api.jquery.com/hidden-selector/
        if (!height || !width || target.is(':hidden')) {
            iframe && iframe.hide();
        } else {
            // 第一次显示时才创建：as lazy as possible
            iframe || (iframe = this.iframe = createIframe());

            iframe.css({
                'height': height,
                'width': width,
                'zIndex': parseInt(target.css('zIndex')) - 1 || 0
            });

            Position.pin(iframe[0], target[0]);
            iframe.show();
        }

        return this;
    };


    // 销毁 iframe 等
    Shim.prototype.destroy = function() {
        if (this.iframe) {
            this.iframe.remove();
            delete this.iframe;
        }
        delete this.target;
    };


    if ($.browser.msie && $.browser.version == 6.0) {
        module.exports = Shim;
    } else {
        // 除了 IE6 都返回空函数
        function Noop() {
        }

        Noop.prototype.sync = Noop;
        Noop.prototype.destroy = Noop;

        module.exports = Noop;
    }


    // Helpers

    function createIframe() {
        return $('<iframe>', {
            src: 'javascript:\'\'', // 不加的话，https 下会弹警告
            frameborder: 0,
            css: {
                display: 'none',
                border: 'none',
                opacity: 0,
                position: 'absolute'
            }
        }).appendTo(document.body);
    }

});
