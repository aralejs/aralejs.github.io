//Switchable circular plugin module.

define(function(require, exports, module) {

    var POSITION = 'position',
        RELATIVE = 'relative',
        LEFT = 'left',
        TOP = 'top',
        EMPTY = '',
        PX = 'px',
        BACKWARD = 'backward',
        SCROLLX = 'scrollx',
        SCROLLY = 'scrolly';

    var $ = require('jquery');
    var Easing = require('easing');

    /**
     * 循环滚动效果函数
     */
    var Circular = module.exports = {
        isRequire: function() {
            // 仅有滚动效果需要下面的调整
            var _effect = this.get('effect');
            var _circular = this.get('circular');
            if (_circular && (_effect === SCROLLX || _effect === SCROLLY)) {
                return true;
            }
            return false;
        },
        install: function() {
            // 覆盖滚动效果函数
            this.set('scrollType', this.get('effect')); // 保存到 scrollType 中
            this.set('effect', circularScroll);
        }
    };

    function circularScroll(panelInfo, direction) {
        var that = this,
            toIndex = panelInfo.toIndex,
            fromIndex = panelInfo.fromIndex,
            len = this.length,
            isX = this.get('scrollType') === SCROLLX,
            prop = isX ? LEFT : TOP,
            viewDiff = this.viewSize[isX ? 0 : 1],
            diff = -viewDiff * toIndex,
            panels = this.panels,
            step = this.get('step'),
            props = {},
            isCritical,
            isBackward = direction === BACKWARD;

        // 从第一个反向滚动到最后一个 or 从最后一个正向滚动到第一个
        var isB = (isBackward && fromIndex === 0 && toIndex === len - 1);
        var notB = (!isBackward && fromIndex === len - 1 && toIndex === 0);
        isCritical = isB || notB;

        // 开始动画
        if (this.anim) {
            this.anim.stop();
            // 快速的话会有点问题
            // 上一个 relative 没清掉：上一个还没有移到该移的位置
            if (panels[fromIndex * step].style.position == RELATIVE) {
                // 快速移到 reset 后的结束位置，用户不会察觉到的！
                var args1 = [panels, fromIndex, prop, viewDiff, 1];
                resetPosition.apply(this, args1);
            }
        }

        if (isCritical) {
            // 调整位置并获取 diff
            var args2 = [panels, isBackward, prop, viewDiff];
            diff = adjustPosition.apply(this, args2);
        }

        props[prop] = diff + PX;

        if (fromIndex > -1) {
            var dur = this.duration;
            var easing = this.get('easing');
            var content = this.content;
            this.anim = content.animate(props, dur, easing, function() {
                that.anim = undefined; // free
                if (isCritical) {
                    // 复原位置
                    var args3 = [panels, isBackward, prop, viewDiff, 1];
                    resetPosition.apply(that, args3);
                }
                // free
                that.anim = undefined;
            });
        } else {
            // 初始化
            this.content.css(props);
        }

    }

    /**
     * 调整位置
     */
    function adjustPosition(panels, isBackward, prop, viewDiff) {
        var step = this.get('step'),
            panels = this.panels;
            len = this.length,
            start = isBackward ? len - 1 : 0,
            from = start * step,
            to = (start + 1) * step;

        // 调整 panels 到下一个视图中
        var actionPanels = panels.slice(from, to);
        $(actionPanels).css(POSITION, RELATIVE);
        $(actionPanels).css(prop, (isBackward ? -1 : 1) * viewDiff * len);
        // 偏移量
        return isBackward ? viewDiff : -viewDiff * len;
    }

    /**
     * 复原位置
     */
    function resetPosition(panels, isBackward, prop, viewDiff, setContent) {
        var that = this,
            step = this.get('step'),
            len = this.length,
            start = isBackward ? len - 1 : 0,
            from = start * step,
            to = (start + 1) * step;

        // 滚动完成后，复位到正常状态
        var actionPanels = panels.slice(from, to);
        $(actionPanels).css(POSITION, EMPTY);
        $(actionPanels).css(prop, EMPTY);

        if (setContent) {
            // 瞬移到正常位置
            this.content.css(prop, isBackward ? -viewDiff * (len - 1) : EMPTY);
        }
    }
});

