define("#switchable/0.9.3/plugins/circular-debug", ["jquery","./effects"], function(require, exports, module) {

    var $ = require('jquery');

    var SCROLLX = 'scrollx';
    var SCROLLY = 'scrolly';
    var Effects = require('./effects').Effects;


    // 无缝循环滚动插件
    module.exports = {

        // 仅在开启滚动效果时需要
        isNeeded: function() {
            var effect = this.get('effect');
            var circular = this.get('circular');
            return circular && (effect === SCROLLX || effect === SCROLLY);
        },

        install: function() {
            this.set('scrollType', this.get('effect'));
            this.set('effect', 'scrollCircular');
        }
    };

    Effects.scrollCircular = function(panelInfo) {
        var toIndex = panelInfo.toIndex;
        var fromIndex = panelInfo.fromIndex;
        var len = this.get('length');

        var isBackwardCritical = (fromIndex === 0 && toIndex === len - 1);
        var isForwardCritical = (fromIndex === len - 1 && toIndex === 0);

        var isBackward = isBackwardCritical ||
                (!isForwardCritical && toIndex < fromIndex);
        var isCritical = isBackwardCritical || isForwardCritical;

        var isX = this.get('scrollType') === SCROLLX;
        var prop = isX ? 'left' : 'top';
        var viewDiff = this.get('viewSize')[isX ? 0 : 1];
        var diff = -viewDiff * toIndex;

        // 开始动画前，先停止掉上一动画
        if (this.anim) {
            this.anim.stop(false, true);
        }

        // 在临界点时，先调整 panels 位置
        if (isCritical) {
            diff = adjustPosition.call(this, isBackward, prop, viewDiff);
        }

        var props = {};
        props[prop] = diff + 'px';

        // 开始动画
        if (fromIndex > -1) {
            var duration = this.get('duration');
            var easing = this.get('easing');
            var that = this;

            this.anim = this.content.animate(props, duration, easing,
                    function() {
                        that.anim = null; // free

                        // 复原位置
                        if (isCritical) {
                            resetPosition.call(that, isBackward,
                                    prop, viewDiff);
                        }
                    });
        }
        // 初始化
        else {
            this.content.css(props);
        }

    };

    // 调整位置
    function adjustPosition(isBackward, prop, viewDiff) {
        var step = this.get('step');
        var len = this.get('length');
        var start = isBackward ? len - 1 : 0;
        var from = start * step;
        var to = (start + 1) * step;
        var diff = isBackward ? viewDiff : -viewDiff * len;

        // 调整 panels 到下一个视图中
        var toPanels = $(this.panels.get().slice(from, to));
        toPanels.css('position', 'relative');
        toPanels.css(prop, -diff + 'px');

        // 返回偏移量
        return diff;
    }

    // 复原位置
    function resetPosition(isBackward, prop, viewDiff) {
        var step = this.get('step');
        var len = this.get('length');
        var start = isBackward ? len - 1 : 0;
        var from = start * step;
        var to = (start + 1) * step;

        // 滚动完成后，复位到正常状态
        var toPanels = $(this.panels.get().slice(from, to));
        toPanels.css('position', '');
        toPanels.css(prop, '');

        // 瞬移到正常位置
        this.content.css(prop, isBackward ? -viewDiff * (len - 1) : '');
    }

});
