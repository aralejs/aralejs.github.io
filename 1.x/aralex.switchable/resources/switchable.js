/**
 * @name aralex.Switchable
 * @class
 * Switchable是对视图可切换的组件的抽象，例如Tab, Slider, Accordion。在Switchable的约束下，以上各组件遵循同样的生命周期，使用共同的接口。<br/>
 * Switchable的设计是为了约束生命周期和统一接口，所以不建议直接使用。可以使用它的子类 Tab， ScrollSlider， FadeSlider， Accordion。
 * @extends aralex.Widget
 * @author <a href="mailto:shuai.shao@alipay.com">邵帅</a>
 * @param {Object} cfg 配置
 * @returns {aralex.slider.Switchable} Switchable组件对象
 * @example
实例化代码:
        var sw = new aralex.Switchable ({
            id: "views",
            triggerId: "triggers"
        });
 
DOM结构:
        &lt;ul id="views"&gt;
            &lt;li&gt;111&lt;/li&gt;
            &lt;li&gt;222&lt;/li&gt;
        &lt;/ul&gt;
        &lt;span id="triggers"&gt;&lt;a href="#"&gt;1&lt;/a&gt;&lt;a href="#"&gt;2&lt;/a&gt;&lt;/span&gt;
 */
var arale = require('arale.base');
var declare = require('arale.class');
var $E = require('arale.event');
var $A = require('arale.array');
var $ = require('arale.dom').$;
var $$ = require('arale.dom').$$;
var aralexBase = require('aralex.base');
module.exports = declare('aralex.Switchable', [aralexBase.Widget], {
        /** @lends aralex.Switchable.prototype */

        /**
         * 是否自动播放
         * @type Boolean
         * @default false
         */
        auto: false,

        /**
         * 触发点的容器ID
         * @type string
         * @default NULL
         */
        triggerId: null,

        /**
         * 触发切换的事件，使用原生'click'和'mouseover'这种命名方式。
         * @type string
         * @default 'click'
         */
        triggerEvent: 'click',	//"click", "mouseover"

        /**
         * 当前的Trigger
         * @type number | string
         * @default 0
         */
        currentTrigger: 0,

        /**
         * 当前的视图
         * @type number | string
         * @default 0
         */
        currentView: 0,

        /**
         * 初始化视图
         * @type number | string
         * @default 0
         */
        start: 0,

        /**
         * 当前trigger 的Class
         * @type string
         * @default "current"
         */
        activeTriggerClass: 'current',

        /**
         * 当前视图的Class
         * @type string
         * @default "current"
         */
        activeViewClass: 'current',

        /**
         * 自动播放时每两次切换的间隔时间，以毫秒为单位
         * @type number
         * @default 5000
         */
        delay: 5000,

        /**
         * 自动播放时的循环方式，可选值为"loop"(播放到最后一张后从第一张开始重新播放)和"back"(播放到最后一张后，反方向播放)
         * @type string
         * @default "loop"
         */
        effect: "loop",	//"loop" or "back"

        /**
         * 自动播放的方向
         * @type number
         * @default 1
         */
        direction: 1,

        /**
         * 自动播放的步长
         * @type number
         * @default 1
         */
        step: 1,

        /**
         * 当鼠标放在视图上时是否停止自动播放。
         * @type Boolean
         * @default true
         */
        hoverStop: true,

        /**
         * @ignore
         * 自动播放的计时器句柄
         */
        autoTimer: null,

        /**
         * 是否使用缓存。这是指每次操作的时候是否使用缓存存储trigger和view的查询结果。
         * @type {Boolean}
         * @default true
         */
        useCache: true,


        /** @ignore */
        init: function() {
            if(this.useCache) {
                this.cache = {};
            }
        },

        /**
         * 事件绑定
         * @ignore
         */
        bind: function() {
            this.hoverStop && this._hoverStop(); //自动播放时鼠标悬停时停止自动播放。

            this.triggerId && this.bindTrigger();
        },

        /**
         * @private
         * 事件绑定:当点击trigger时切换到相应的视图
         */
        bindTrigger: function(id) {
            id && (this.triggerId = id);
            this._autoSwitchTrigger(); //自动切换trigger

            var h = this._dl(this.triggerId, this.triggerEvent, function(t, i, e) {
                this.switchView(this.getView(t, i));
            });
            h && this._connects.push(h);
        },

        /**
         * @private
         * 事件代理
         */
        _dl: function(ele, event, callback) {
            ele = $(ele);
            var t = this;
            var h = function(e) {
                var index = -1,
                    target = e.target;
                var b = $A(t._getChildren(ele)).some(function(v, i) {
                    target = v.node;
                    index = i;
                    return $E._isInDomChain(e.target, v.node, ele.node);
                });
                if (b) {
                    callback.call(t, target, index, e);
                }
            }
            return $E.connect(ele, event, h);
        },

        /**
         * @private
         * 根据trigger的DOM元素和Index获取相应的视图标识
         */
        getView: function(ele, index) {
            return index;
        },

        /**
         * @private
         * 更具视图标识获取相应的trigger标识
         */
        getTrigger: function(target) {
            return target;
        },

        /**
         * 当鼠标放在视图上时，停止自动播放。
         * @private
         */
        _hoverStop: function() {
            var b = false;//保存自动播放状态
            this.addEvent('mouseover', function() {
                if (this.auto) {
                    b = true;
                    this.stop();
                }
            });
            this.addEvent('mouseout', function() {
                if (b) {
                    b = false;
                    this.play();
                }
            });
        },

        /**
         * 自动切换trigger
         * @private
         */
        _autoSwitchTrigger: function() {
            var t = this;
            return this.before('switchView', function(from, to) {
                t.switchTrigger(t.getTrigger(to));
            });
        },

        /**
         * 切换视图
         * @param {number | string} target
         */
        switchView: function(target) {
            //if(this.currentView == target) {return;}

            $E.publish(this._getEventTopic('switchView', 'before'), [this.currentView, target]);
            var self = this;
            this.switchViewEffect(this.currentView, target, function() {
                $E.publish(self._getEventTopic('switchView', 'after'), [self.currentView, target]);
                self.auto && self._auto();
            });
            self.currentView = target;
            return this;
        },

        /**
         * 切换视图的效果。
         * 注意让切换视图结束时，调用callback。callback里封装了"切换视图结束事件"发布。所以如果是动画效果的切换效果，要把callback放在动画执行结束的回调函数里执行。
         * @private
         */
        switchViewEffect: function(from, to, callback){
            var views = this._getChildren(this.domNode);
            var c = views[from], n = views[to], avc = this.activeViewClass;
            if(avc) {
                c.removeClass(avc);
                n.addClass(avc);
            }
            callback.apply(this);
        },

        /**
         * 切换trigger
         * @private
         */
        switchTrigger: function(target) {
            if(this.currentTrigger == target) {return;}
            $E.publish(this._getEventTopic('switchTrigger', 'before'), [this.currentTrigger, target]);
            var self = this;
            this.switchTriggerEffect(this.currentTrigger, target, function(){
                $E.publish(self._getEventTopic('switchTrigger', 'after'), [self.currentTrigger, target]);
            });
            this.currentTrigger = target;
            return this;
        },

        /**
         * 切换视图的效果。
         * @private
         */
        switchTriggerEffect: function(from, to, callback) {
            var triggers = this._getChildren(this.triggerId);
            var c = triggers[from], n = triggers[to],atc = this.activeTriggerClass;
            c.removeClass(atc);
            n.addClass(atc);
            callback.apply(this);
        },

        /**
         * @ignore
         */
        postCreate: function() {
            this.prepare();

            /**
             * 切换trigger事件
             * @name switchTrigger
             * @event
             * @memberOf aralex.Switchable
             * @param {number | string} currentTrigger 起始trigger
             * @param {number | string} targetTrigger 目标trigger
             * @example
             * tab.after("switchTrigger", function(currentTrigger, targetTrigger) {
             * });
             */
            this.defaultFn("switchTrigger");

            /**
             * 切换view事件
             * @name switchView
             * @event
             * @memberOf aralex.Switchable
             * @param {number | string} currentView 起始view
             * @param {number | string} targetView 目标view
             * @example
             * tab.after("switchView", function(c, t) {
             * });
             */
            this.defaultFn("switchView");

            if(this.auto) {
                this.play();
            }
        },

        /**
         * 预先整理DOM结构和一些初始化工作。
         * @private
         */
        prepare: function() {
            this.currentView = this.currentTrigger = this.start;
            $A(this._getChildren(this.domNode)).each(function(v, i) {
                if(i != this.currentView) {
                    this.activeViewClass && v.removeClass(this.activeViewClass);
                } else{
                    this.activeViewClass && v.addClass(this.activeViewClass);
                }
            }, this);

            this.triggerId && this.activeTriggerClass && $A(this._getChildren(this.triggerId)).each(function(v, i) {
                if(i != this.currentTrigger) {
                    v.removeClass(this.activeTriggerClass);
                } else{
                    v.addClass(this.activeTriggerClass);
                }
            }, this);
        },

        /**
         * 下一帧
         * @param {number} [step] 步长，例如next(2)指滑动到2步之后
         * @returns {aralex.Switchable} 原对象
         */
        next: function(step) {
            step = step || 1;
            var target = this.currentView + step;
            return this.validIndex_(target) ? this.switchView(target) : this;
        },

        /**
         * @private
         */
        validIndex_: function(target) {
            return (target >=0 && target <= this._getChildren(this.domNode).length - 1);
        },

        /**
         * 上一帧
         * @param {number} [step] 步长，例如next(2)指滑动到2步之前
         * @returns {aralex.Switchable} 原对象
         */
        previous: function(step) {
            step = step || 1;
            var target = this.currentView - step;
            return this.validIndex_(target) ? this.switchView(target) : this;
        },

        /**
         * 开始自动播放
         * @returns {aralex.Switchable} 原对象
         */
        play: function() {
            this.auto = true;
            return this._auto();
        },

        /**
         * 停止自动播放
         * @returns {aralex.Switchable} 原对象
         */
        stop: function() {
            clearTimeout(this.autoTimer);
            this.autoTimer = null;
            this.auto = false;
            return this;
        },

        /**
         * @ignore
         */
        _auto: function() {
            var t = this;
            clearTimeout(this.autoTimer);
            this.autoTimer = setTimeout(function(){
                t.switchView(t.getNextAutoView());
            }, t.delay);
            return this;
        },

        /**
         * 得到自动播放的下一帧
         * @private
         */
        getNextAutoView: function() {
            var i = this.currentView + this.direction * this.step,
                b = this._checkViewValid(i);
            if(b) {return i;}
            switch(this.effect) {
                case "loop":
                    return Math.abs(Math.abs(i) - this._getChildren(this.domNode).length);
                case "back":
                    this.direction *= (-1);
                    return this.getNextAutoView();
                default:
                    break;
            }
        },

        /**
         * 检查自动播放时，下一帧是否合法
         * @private
         */
        _checkViewValid: function(i) {
            if(i<0) {return false;}
            var arr = this._getChildren(this.domNode);
            if(i>=arr.length) {return false;}
            return true;
        },

        /**
         * @private
         */
        _getChildren: function(e) {
            e = $(e);
            if(this.useCache) {
                var b = this.cache[e.attr("id")] || (this.cache[e.attr("id")] = e.nodes());
                return b;
            }
            /*
            */
            return e.nodes();
        },

        /**
         * 销毁组件。
         */
        destroy: function() {
            this.parent(arguments);
            clearTimeout(this.autoTimer);
        }
});
