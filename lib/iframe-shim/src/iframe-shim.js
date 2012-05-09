define(function(require, exports, module) {

    var $ = require('jquery'),
        position = require('position');


    // target 为需要被遮盖的目标元素，可以传 `Dom Element` 或 `Selector`
    function Shim(target) {

        if (!target) {
            throw 'Target must be specified';
        }

        // 如果选择器选了多个 Dom，则只取第一个
        this.target = $(target).eq(0);
        this.iframe = $('<iframe src="javascript:\'\'" frameborder="0" scrolling="no"></iframe>')
                .css({'opacity': 0, 'position': 'absolute'}).appendTo(document.body);
        this.sync();
    };


    // 根据目标元素计算 iframe 的显隐、宽高、定位
    Shim.prototype.sync = function() {
        var height = this.target.outerHeight();
        var width = this.target.outerWidth();
        var zIndex = Number(this.target.css('zIndex'));

        // 如果目标元素隐藏，iframe 也隐藏
        // jquery 判断宽高同时为0才算隐藏，这里判断宽高其中一个为0就隐藏
        // http://api.jquery.com/hidden-selector/
        if (this.target.is(':hidden') || !(height && width)) {
            this.iframe.hide();
        } else {
            this.iframe.css({
                'height': height + 'px',
                'width': width + 'px',
                'zIndex': isNaN(zIndex) ? 0 : (zIndex - 1)
            });

            position.pin(this.iframe[0], this.target[0]);

            this.iframe.show();
        }
    };


    // 销毁 iframe
    Shim.prototype.destroy = function() {
        this.iframe.remove();
        delete this.iframe;
    };


    var isIE6 = !-[1,] && !('maxHeight' in document.body.style);
    if (isIE6) {
        module.exports = Shim;
    } else {
        // 除了ie6都返回空的构造函数
        function Noop() {}
        Noop.prototype.sync = function() {};
        Noop.prototype.destroy = function() {};

        module.exports = Noop;
    }
});

