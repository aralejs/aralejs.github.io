//Switchable circular plugin module.

define("#switchable/0.8.0/plugins/circular-debug", [], function(require, exports, module) {

    var POSITION = 'position',
        RELATIVE = 'relative',
        LEFT = 'left',
        TOP = 'top',
        EMPTY = '',
        PX = 'px',
        BACKWARD = 'backward',
        SCROLLX = 'scrollx',
        SCROLLY = 'scrolly';

    /**
     * 循环滚动效果函数
     */
    var Circular = module.exports = {
        initCircular: function() {
            var options = this.options;
        // 仅有滚动效果需要下面的调整
            // 覆盖滚动效果函数
            options.scrollType = options.effect; // 保存到 scrollType 中
            options.effect = circularScroll;
        }
    };

    function circularScroll(callback, direction) {
        var that = this,
            fromIndex = this.fromIndex,
            options = this.options,
            len = this.length,
            isX = options.scrollType === SCROLLX,
            prop = isX ? LEFT : TOP,
            index = this.activeIndex,
            viewDiff = this.viewSize[isX ? 0 : 1],
            diff = -viewDiff * index,
            panels = this.panels,
            steps = options.steps,
            props = {},
            isCritical,
            isBackward = direction === BACKWARD;

        // 从第一个反向滚动到最后一个 or 从最后一个正向滚动到第一个
        isCritical = (isBackward && fromIndex === 0 && index === len - 1) || (!isBackward && fromIndex === len - 1 && index === 0);

        // 开始动画
        if (this.anim) {
            this.anim.stop();
            // 快速的话会有点问题
            // 上一个 relative 没清掉：上一个还没有移到该移的位置
            if (panels[fromIndex * steps].style.position == RELATIVE) {
                // 快速移到 reset 后的结束位置，用户不会察觉到的！
                resetPosition.call(this, panels, fromIndex, prop, viewDiff, 1);
            }
        }

        if (isCritical) {
            // 调整位置并获取 diff
            diff = adjustPosition.call(this, panels, isBackward, prop, viewDiff);
        }

        props[prop] = diff + PX;

        if (fromIndex > -1) {
            this.anim = this.content.animate(props, options.duration, options.easing, function() {
                that.anim = undefined; // free
                callback && callback();
                if (isCritical) {
                    // 复原位置
                    resetPosition.call(that, panels, isBackward, prop, viewDiff, 1);
                }
                // free
                that.anim = undefined;
                callback && callback();
            });
        } else {
            // 初始化
            this.content.css(props);
            callback && callback();
        }

    }

    /**
     * 调整位置
     */
    function adjustPosition(panels, isBackward, prop, viewDiff) {
        var options = this.options;
            steps = options.steps,
            panels = this.panels;
            len = this.length,
            start = isBackward ? len - 1 : 0,
            from = start * steps,
            to = (start + 1) * steps;

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
            options = this.options,
            steps = options.steps,
            len = this.length,
            start = isBackward ? len - 1 : 0,
            from = start * steps,
            to = (start + 1) * steps;

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

