/**
 * @name aralex.slider.ScrollSlider
 * @class
 * ScrollSlider继承于Switchable，是实现了左右或者上下滑动的slider组件。<br/>
 * ScrollSlider要求视图容器外层需要有一个容器设置为单张slide的大小，并且设置overflow为hidden。例如下面的例子中的 views外面需要wrapper来遮挡。views的子元素最好设置宽高，以防止在图片等加载速度慢时，IE下获取slide宽度失真。<br/>
 * 视图容器请根据需要进行样式的设置，左右滑动时应设置样式使视图的容器水平，比如可以设置视图元素float:left。 
 * @author <a href="mailto:shuai.shao@alipay.com">邵帅</a>
 * @extends aralex.Switchable
 * @param {Object} cfg 配置
 * @returns {aralex.slider.ScrollSlider} ScrollSlider组件对象
 * @example
实例化代码:
 
        var ss = new aralex.slider.ScrollSlider ({
            id: "views",
            triggerId: "triggers"
        });
 
DOM结构:
 
        &lt;div id="wrapper"&gt;
            &lt;ul id="views"&gt;
                &lt;li&gt;111&lt;/li&gt;
                &lt;li&gt;222&lt;/li&gt;
            &lt;/ul&gt;
        &lt;/div&gt;
        &lt;span id="triggers"&gt;&lt;a href="#"&gt;1&lt;/a&gt;&lt;a href="#"&gt;2&lt;/a&gt;&lt;/span&gt;
 */
var arale = require('arale.base');
var $S = require('arale.string');
var $A = require('arale.array');
var declare = require('arale.class');
var Switchable = require('aralex.switchable');
var $Node = require('arale.dom').$Node;
var $Animator = require('arale.fx');
module.exports = declare('aralex.slider.ScrollSlider', [Switchable], {
    /** @lends aralex.slider.ScrollSlider.prototype */

    /**
     * 滑动方式："scrollX", "scrollY" or "fade"
     * @type String
     * @default "scrollX"
     */
    type: 'scrollX', //"scrollX", "scrollY" or "fade"

    /**
     * 每次滑动动画的执行时间，以毫秒为单位
     * @type Number
     * @default 500
     */
    duration: 500,

    /**
     * 是否自动滑动
     * @type Boolean
     * @default true
     */
    auto: true,

    /**
     * 指显示出的slide的大小。比如单个slide的宽度为5，外层遮挡容器的宽度设置为15，capacity的大小就是3
     * @type number
     * @default 1
     */
    capacity: 1,

    /**
     * 自动播放时的循环方式，可选值为"loop"(播放到最后一张后从第一张开始重新播放)和"back"(播放到最后一张后，反方向播放)，还有"persistent"(一直向一个方向)
     * 但是"persistent"效果不能有tirgger，这是受到现在的实现制约，以后会再改进
     * @type String
     * @default "loop"
     */
    effect: "loop",	//"loop" or "back" or "persistent"

    /** @private */
    switchViewEffect: function(from, to, callback) {
        if(from == to) {callback();return;};
        var views = this._getChildren(this.domNode);
        this._currentAnim && this._currentAnim.clearSubjects();
        var that = this;
        this._currentAnim = new $Animator({
            duration: that.duration,
            interval: 20,
            onComplete: function() {
                callback.apply(this);
            }
        });
        var anim = this._currentAnim;
        var prop = this.type == 'scrollY' ? 'top' : 'left';
        anim.addCSSMotion(this.domNode.node, prop + ':-' + views[to].node.startPos + 'px');
        anim.play();
    },

    /** @private */
    prepare: function() {
        this.currentView = this.currentTrigger = this.start;
        var eles = this._getChildren(this.domNode);
        var _w = 0, prop,
            style = {position: 'relative'};
        if (this.type == 'scrollX') {
            prop = 'width';
            style.left = 0;
        } else if (this.type == 'scrollY') {
            prop = 'height';
            style.top = 0;
        }
        for (var i = 0, l = eles.length; i < l; i++) {
            eles[i].node.startPos = _w;
            var s = $Node(eles[i]).getStyle(prop);
            var t = s ? $S(s).toInt() : $Node(eles[i]).getViewportSize()[prop];
            //_w += $S($(eles[i]).getStyle(prop)).toInt();
            _w += t;
        }
        style[prop] = _w + 'px';
        this.domNode.setStyle(style);
        this.domNode.setStyle(this.type == 'scrollX' ? 'left' : 'top', -eles[this.start].node.startPos + 'px');
        this.parent(arguments);
    },

    /**
     * 下一帧
     * @param {Number} [step] 步长，例如next(2)指滑动到2步之后
     * @returns {aralex.Switchable} 原对象
     */
    next: function(step) {
        if(this.effect == 'persistent') {
            step = step || 1;
            var target = this.currentView + step;
            if(this.validIndex_(this.currentView + step + this.capacity -1)) {
                return this.switchView(target);
            } else {
                this._dealPersistentEffect(1);
                return this.next(step);
            }
        } else {
            return this.parent(arguments);
        }
    },

    /**
     * 上一帧
     * @param {Number} [step] 步长，例如next(2)指滑动到2步之前
     * @returns {aralex.Switchable} 原对象
     */
    previous: function(step) {
        if(this.effect == 'persistent') {
            step = step || 1;
            var target = this.currentView - step;
            if(this.validIndex_(target)) {
                return this.switchView(target);
            } else {
                this._dealPersistentEffect(-1);
                return this.previous(step);
            }
            //return this.validIndex_(target) ? this.switchView(target) : this;
        } else {
            return this.parent(arguments);
        }
    },

    /**
     * 得到自动播放的下一帧
     * @private
     */
    getNextAutoView: function() {
        if(this.effect == 'persistent') {
            /*
            var i = this.currentView + this.direction * this.step,
                b = this._checkViewValid(i);
            if(b) {return i;}
            this._dealPersistentEffect(1);
            return this.getNextAutoView();
            */
            var target = this.currentView + this.direction * this.step,
                b = this.validIndex_(this.direction > 0 ? (target + this.capacity - 1) : target);
            if (b) return target;
            this._dealPersistentEffect(this.direction);
            return this.getNextAutoView();
        } else {
            return this.parent(arguments);
        }
    },

    _dealPersistentEffect: function(direction) {
        direction = direction || this.direction;
        this.useCache = false;
        var children = this._getChildren(this.domNode);
        if(direction > 0) {
            var toBeMoved = children.slice(this.currentView),
                pos = 'top';
            for(var i = toBeMoved.length - 1; i >= 0; i-- ) {
                toBeMoved[i].inject(this.domNode, pos);
            }
        } else {
            var toBeMoved = children.slice(0, this.currentView + this.capacity),
                pos = 'bottom';
            for(var i = 0, l = toBeMoved.length; i < l; i++ ) {
                toBeMoved[i].inject(this.domNode, pos);
            }
        }

        this.start = direction > 0 ? 0 : children.length - this.capacity;
        this.prepare();
    }
});
