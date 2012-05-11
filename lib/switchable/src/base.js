define(function(require, exports, module) {

    // Switchable
    // -----------------
    // Thanks to:
    //  https://github.com/kissyteam/kissy/blob/master/src/switchable/src/base.js

    var Widget = require('widget');
    var utils = require('./utils');
    var $ = require('jquery');

    //组件相关参数
    var DISPLAY = 'display',
        BLOCK = 'block',
        makeArray = $.makeArray,
        NONE = 'none',
        EventTarget = Event.Target,
        FORWARD = 'forward',
        BACKWARD = 'backward',
        DOT = '.',
        EVENT_INIT = 'init',
        EVENT_BEFORE_SWITCH = 'beforeSwitch',
        EVENT_SWITCH = 'switch',

        EVENT_BEFORE_REMOVE = 'beforeRemove',
        EVENT_ADDED = 'added',
        EVENT_REMOVED = 'removed',
        CLS_PREFIX = 'ks-switchable-',
        CLS_TRIGGER_INTERNAL = CLS_PREFIX + 'trigger-internal',
        CLS_PANEL_INTERNAL = CLS_PREFIX + 'panel-internal';



    function getDomEvent(e) {
        var originalEvent = {};
        originalEvent.type = e.type;
        originalEvent.target = e.target;
        return {originalEvent: originalEvent};
    }

    var Switchable = module.exports = Widget.extend({
        options: {
            // markup 的类型，取值如下
            // 0 - 默认结构：通过 nav 和 content 来获取 triggers 和 panels
            markupType: 0,
            navCls: CLS_PREFIX + 'nav',
            contentCls: CLS_PREFIX + 'content',

            // 1 - 适度灵活：通过 cls 来获取 triggers 和 panels
            triggerCls: CLS_PREFIX + 'trigger',
            panelCls: CLS_PREFIX + 'panel',
            // 2 - 完全自由：直接传入 triggers 和 panels
            triggers: [],
            panels: [],
            // 是否有触点
            hasTriggers: true,
            // 触发类型
            triggerType: 'mouse', // or 'click'
            // 触发延迟
            delay: .1, // 100ms
            /**
             * 如果 activeIndex 和 switchTo 都不设置，相当于设置了 activeIndex 为 0
             */
            // 如果设置了 activeIndex ，则需要为对应的 panel html 添加 activeTriggerCls class
            activeIndex: -1,
            activeTriggerCls: 'ks-active',
            // 初始切换到面板，设置了 switchTo 就不需要设置 activeIndex
            // 以及为对应 html 添加 activeTriggerCls class
            switchTo: undefined,
            // 可见视图内有多少个 panels
            steps: 1,

            // 可见视图区域的大小。一般不需要设定此值，仅当获取值不正确时，用于手工指定大小
            viewSize: []
        },
        initOptions: function(options) {
             // 调整配置信息
            if (!('markupType' in options)) {
                if (options.panelCls) {
                    options.markupType = 1;
                } else if (options.panels) {
                    options.markupType = 2;
                }
            }
        },
        beforeCreate: function() {
            // parse markup
            this._parseMarkup();
            //this._initPlugins();
            this.trigger(EVENT_INIT);
        },

        bindAction: function() {
            if (this.options.hasTriggers) {
                this._bindTriggers();
            }
            //bind panels
            this._bindPanels();
        },
        postCreate: function() {
            var options = this.options;
            /**
             * 当前正在动画/切换的位置
             * @type Number
             */
            var activeIndex = this.activeIndex = this.options.activeIndex;

            var willSwitch;

            // 设置了 activeIndex
            // 要配合设置 markup
            if (activeIndex > -1) {
            }
            //设置了 switchTo , activeIndex == -1
            else if (typeof options.switchTo == 'number') {
                willSwitch = options.switchTo;
            }
            // 否则，默认都为 0
            // 要配合设置位置 0 的 markup
            else {
                activeIndex = this.activeIndex = 0;
            }

            if (willSwitch !== undefined) {
                this.switchTo(options.switchTo);
            }
        },

        //解析 markup, 获取 triggers, panels, content
        _parseMarkup: function() {
            var container = this.getElement();
            var options = this.options;
            var nav, content, triggers = [], panels = [], n;

            switch (options.markupType) {
                case 0: // 默认结构
                    nav = $(DOT + options.navCls, container);
                    if (nav) {
                        //triggers = DOM.children(nav);
                        triggers = nav.children();
                    }
                    //content = DOM.get(DOT + options.contentCls, container);
                    content = $(DOT + options.contentCls, container);
                    //panels = DOM.children(content);
                    panels = content.children();
                    break;
                case 1: // 适度灵活
                    //triggers = DOM.query(DOT + options.triggerCls, container);
                    triggers = $(DOT + options.triggerCls, container);
                    //panels = DOM.query(DOT + options.panelCls, container);
                    panels = $(DOT + options.panelCls, container);
                    break;
                case 2: // 完全自由
                    triggers = options.triggers;
                    panels = options.panels;
                    break;
            }


            // get length
            n = panels.length;

            // fix self.length 不为整数的情况, 会导致之后的判断 非0, by qiaohua 20111101
            this.length = Math.ceil(n / options.steps);

            this.nav = nav || options.hasTriggers && triggers[0] && triggers[0].parentNode;

            // 自动生成 triggers and nav
            if (options.hasTriggers && (
                // 指定了 navCls ，但是可能没有手动填充 trigger
                !this.nav || triggers.length == 0
                )) {
                triggers = this._generateTriggersMarkup(this.length);
            }

            // 将 triggers 和 panels 转换为普通数组
            this.triggers = makeArray(triggers);
            this.panels = makeArray(panels);

            // get content
            this.content = content || panels[0].parentNode;
        },

        //自动生成 triggers 的 markup
        _generateTriggersMarkup: function(len) {
            var options = this.options;
            var ul = this.nav || $('<ul>'), li, i;
            //ul.className = cfg.navCls;
            ul.addClass(options.navCls);

            for (i = 0; i < len; i++) {
                //li = DOM.create('<li>');
                li = $('<li>');
                if (i === this.activeIndex) {
                    //li.className = cfg.activeTriggerCls;
                    li.addClass(options.activeTriggerCls);
                }
                //li.innerHTML = i + 1;
                li.html(i + 1);
                //ul.appendChild(li);
                ul.append(li);
            }
            //self.container.appendChild(ul);
            this.container.append(ul);
            this.nav = ul;
            //return DOM.children(ul);
            return ul.children();
        },

        //给 triggers 添加事件
        _bindTriggers: function() {
            //alert('bindTrigger---->');
            var that = this;
            var options = this.options;

            //navEl = KISSY.one(self.nav),
            var navEl = this.nav;
            var triggers = this.triggers;
            //给tigger添加class，使用委托
            $.each(triggers, function(index, trigger) {
                that._initTrigger(trigger);
            });

            navEl.on('click', '.' + CLS_TRIGGER_INTERNAL, function(e) {
                var trigger = e.currentTarget;
                var index = that._getTriggerIndex(trigger);
                that._onFocusTrigger(index, e);
            });

            if (options.triggerType === 'mouse') {
                navEl.on('mouseenter', '.' + CLS_TRIGGER_INTERNAL,
                    function(e) {
                        var trigger = e.currentTarget;
                        var index = that._getTriggerIndex(trigger);
                        that._onMouseEnterTrigger(index, e);
                    }).on('mouseleave', '.' + CLS_TRIGGER_INTERNAL, function() {
                        that._onMouseLeaveTrigger();
                    });
            }
        },
         //初始化Tirgger ，添加样式
        _initTrigger: function(trigger) {
            //DOM.addClass(trigger, CLS_TRIGGER_INTERNAL);
            $(trigger).addClass(CLS_TRIGGER_INTERNAL);
        },

        _bindPanels: function() {
            var that = this;
            var panels = this.panels;

            $.each(panels, function(index, panel) {
                that._initPanel(panel);
            });
        },

        //初始化panel,添加class
        _initPanel: function(panel) {
            //DOM.addClass(panel, CLS_PANEL_INTERNAL);
            $(panel).addClass(CLS_PANEL_INTERNAL);
        },

        //click or tab 键激活 trigger 时触发的事件
        _onFocusTrigger: function(index, e) {
            // 重复点击
            if (!this._triggerIsValid(index)) {
                return;
            }
            this._cancelSwitchTimer(); // 比如：先悬浮，再立刻点击，这时悬浮触发的切换可以取消掉。
            this.switchTo(index, undefined, getDomEvent(e));
        },

         //鼠标悬浮在 trigger 上时触发的事件
        _onMouseEnterTrigger: function(index, e) {
            var that = this;
            if (!this._triggerIsValid(index)) {
                return;
            }
            var ev = getDomEvent(e);
            // 重复悬浮。比如：已显示内容时，将鼠标快速滑出再滑进来，不必再次触发。
            this.switchTimer = utils.later(function() {
                that.switchTo(index, undefined, ev);
            }, that.options.delay * 1000);
        },

        //鼠标移出 trigger 时触发的事件
        _onMouseLeaveTrigger: function() {
            this._cancelSwitchTimer();
        },

        //重复触发时的有效判断
        _triggerIsValid: function(index) {
            return this.activeIndex !== index;
        },

        //取消切换定时器
        _cancelSwitchTimer: function() {
            if (this.switchTimer) {
                this.switchTimer.cancel();
                this.switchTimer = undefined;
            }
        },

        //获取trigger的索引
        _getTriggerIndex: function(trigger) {
            return utils.indexOf(trigger, this.triggers);
        },

        //重置 length: 代表有几个trigger
        _resetLength: function() {
            this.length = this._getLength();
        },

        //获取 Trigger的数量
        _getLength: function(panelCount) {
            var options = this.options;
            if (panelCount === undefined) {
                panelCount = this.panels.length;
            }
            return Math.ceil(panelCount / options.steps);
        },

        // 添加完成后，重置长度，和跳转到新添加项
        _afterAdd: function(index, activated) {
            // 重新计算 trigger 的数目
            this._resetLength();
            var page = this._getLength(index + 1) - 1;
            // 重置当前活动项

            if (this.options.steps == 1) {
                // step =1 时 ，相同的 activeIndex 需要拍后
                if (this.activeIndex >= page) {
                    this.activeIndex += 1;
                }
            } else {
                // step >1 时 ，activeIndex 不排后
            }

            // 保持原来的在视窗
            var n = this.activeIndex;
            // 设为 -1，立即回复到原来视图
            this.activeIndex = -1;
            this.switchTo(n);

            // 需要的话，从当前视图滚动到新的视图
            if (activated) {
                // 放到 index 位置
                this.switchTo(page);
            }
        },
        /**
         * 添加一项
         * @param {Object} conf 添加项的配置.
         * @param {String|Object} conf.Trigger 导航的Trigger.
         * @param {String|Object} conf.panel 内容.
         * @param {Number} conf.index 添加到得位置.
         */
        add: function(conf) {
            var navContainer = this.nav,
                contentContainer = this.content,
                triggerDom = conf.trigger, //trigger 的Dom节点
                panelDom = conf.panel, //panel的Dom节点
                activated = conf['activated'], //添加一项后是否跳转到对应的trigger
                count = this.panels.length,
                index = conf.index != null ? conf.index : count,
                triggers = this.triggers,
                panels = this.panels,
                beforeLen = this.length, //添加节点之前的 trigger个数，如果step>1时，tirgger的个数不等于panel的个数
                currentLen = null,
                nextTrigger = null; //原先在此位置的元素

            //如果 index 大于集合的总数，添加到最后
            index = Math.max(0, Math.min(index, count));

            var nextPanel = panels[index];
            panels.splice(index, 0, panelDom);
            //插入content容器对应的位置
            if (nextPanel) {
                //DOM.insertBefore(panelDom, nextPanel);
                //TODO 需要注意查看参数的顺序. panelDom == newNodes, nextPanel == refNodes;
                panelDom.insertBefore(nextPanel);
            } else {
                //DOM.append(panelDom, contentContainer);
                contentContainer.append(panelDom);
            }
            //当trigger 跟panel一一对应时，插入对应的trigger
            if (this.options.steps == 1) {
                nextTrigger = triggers[index];
                //插入导航对应的位置
                if (nextTrigger) {
                    //DOM.insertBefore(triggerDom, nextTrigger);
                    triggerDom.insertBefore(nextTrigger);
                } else {
                    //DOM.append(triggerDom, navContainer);
                    navContainer.append(triggerDom);
                }
                //插入集合
                triggers.splice(index, 0, triggerDom);
            } else {//否则，多个panel对应一个trigger时，在最后附加trigger
                currentLen = this._getLength();
                if (currentLen != beforeLen) {
                    //附加到导航容器
                    //DOM.append(triggerDom, navContainer);
                    navContainer.append(triggerDom);
                    triggers.push(triggerDom);
                }
            }

            this._initPanel(panelDom);
            this._initTrigger(triggerDom);

            //触发添加事件
            //TODO 需要注意fire和我们的事件机制是否一致。
            this.trigger(EVENT_ADDED, {index: index, trigger: triggerDom, panel: panelDom});
            this._afterAdd(index, activated);
        },
        /**
         * 移除一项
         * @param {Number|HTMLElement} index 移除项的索引值或者DOM对象.
         */
        remove: function(index) {
            var steps = this.options.steps,
                beforeLen = this.length,
                panels = this.panels,
                afterLen = this._getLength(panels.length - 1), //删除panel后的tigger个数
                triggers = this.triggers,
                trigger = null,
                panel = null;

            //传入Dom对象时转换成index
            index = utils.isNumber(index) ?
                Math.max(0, Math.min(index, panels.length - 1)) :
                utils.indexOf(index, panels);

            //如果trigger跟panel不一一对应则，取最后一个
            trigger = steps == 1 ? triggers[index] :
                (afterLen !== beforeLen ? triggers[beforeLen - 1] : null);

            panel = panels[index];


            //触发删除前事件,可以阻止删除
            //TODO 事件处理
            if (this.trigger(EVENT_BEFORE_REMOVE, {
                index: index,
                panel: panel,
                trigger: trigger
            }) === false) {
                return;
            }

            function deletePanel() {

                //删除panel
                if (panel) {
                    //DOM.remove(panel);
                    panel.remove();
                    panels.splice(index, 1);
                }

                //删除trigger
                if (trigger) {
                    //DOM.remove(trigger);
                    trigger.remove();
                    if (steps == 1) {
                        // 当trigger跟panel一一对应时删除对应的trigger
                        this.triggers.splice(index, 1);
                    } else {
                        // 否则，当最后一个trigger没有关联的panel时删除
                        this.triggers.splice(beforeLen - 1, 1);
                    }
                }

                //重新计算 trigger的数目
                this._resetLength();

                //TODO 事件处理
                this.trigger(EVENT_REMOVED, {
                    index: index,
                    trigger: trigger,
                    panel: panel
                });
            }

            // 完了
            if (afterLen == 0) {
                deletePanel();
                return;
            }

            var activeIndex = this.activeIndex;

            if (steps != 1) {
                if (activeIndex >= afterLen) {
                    // 当前屏幕的元素将要空了，先滚到前一个屏幕，然后删除当前屏幕的元素
                    this.switchTo(afterLen - 1, undefined, undefined, deletePanel);
                } else {
                    // 不滚屏，其他元素顶上来即可
                    deletePanel();
                    this.activeIndex = -1;
                    // notify datalazyload
                    this.switchTo(activeIndex);
                }
                return;
            }

            // steps ==1
            // 一律滚屏
            var n = activeIndex > 0 ?
                activeIndex - 1 :
                activeIndex + 1;
            this.switchTo(n, undefined, undefined, deletePanel);
        },
         /**
         * 切换操作，对外 api
         * @param index 要切换的项.
         * @param [direction] 方向，用于 autoplay/circular.
         * @param [ev] 引起该操作的事件.
         * @param [callback] 运行完回调，和绑定 switch 事件作用一样.
         */
        switchTo: function(index, direction, ev, callback) {
            var options = this.options,
                fromIndex = this.activeIndex,
                triggers = this.triggers;


            // 再次避免重复触发
            if (!this._triggerIsValid(index)) {
                return this;
            }
            //TODO 事件处理
            if (this.trigger(EVENT_BEFORE_SWITCH, {
                fromIndex: fromIndex,
                toIndex: index
            }) === false) {
                return self;
            }
            this.fromIndex = fromIndex;

            // switch active trigger
            if (options.hasTriggers) {
                this._switchTrigger(fromIndex > -1 ?
                    triggers[fromIndex] : null,
                    triggers[index]);
            }

            // switch active panels
            if (direction === undefined) {
                direction = index > fromIndex ? FORWARD : BACKWARD;
            }

            // 当前正在处理转移到 index
            this.activeIndex = index;

            // switch view
            this._switchView(direction, ev, function() {
                callback && callback.call(this);
            });

            return this; // chain
        },

        //切换当前触点
        _switchTrigger: function(fromTrigger, toTrigger) {
            var activeTriggerCls = this.options.activeTriggerCls;

            if (fromTrigger) {
                //DOM.removeClass(fromTrigger, activeTriggerCls);
                $(fromTrigger).removeClass(activeTriggerCls);
            }

            //DOM.addClass(toTrigger, activeTriggerCls);
            $(toTrigger).addClass(activeTriggerCls);
        },

        _getFromToPanels: function() {
            var fromIndex = this.fromIndex,
                fromPanels,
                toPanels,
                steps = this.options.steps,
                panels = this.panels,
                toIndex = this.activeIndex;

            if (fromIndex > -1) {
                fromPanels = panels.slice(fromIndex * steps, (fromIndex + 1) * steps);
            } else {
                fromPanels = null;
            }

            toPanels = panels.slice(toIndex * steps, (toIndex + 1) * steps);

            return {
                fromPanels: fromPanels,
                toPanels: toPanels
            };
        },

        //切换视图
        _switchView: function(direction, ev, callback) {
            var that = this;
            var panelInfo = this._getFromToPanels(),
                fromPanels = panelInfo.fromPanels,
                toPanels = panelInfo.toPanels;

            // 最简单的切换效果：直接隐藏/显示
            if (fromPanels) {
                //DOM.css(fromPanels, DISPLAY, NONE);
                $(fromPanels).css(DISPLAY, NONE);
            }

            //DOM.css(toPanels, DISPLAY, BLOCK);
            $(toPanels).css(DISPLAY, BLOCK);
            // fire onSwitch events
            // 同动画时保持一致，强制异步
            setTimeout(function () {
                that._fireOnSwitch(ev);
            }, 0);

            callback && callback.call(this);
        },

        /**
         * 触发 switch 相关事件
         */
        _fireOnSwitch: function(ev) {
            //TODO event
            this.trigger(EVENT_SWITCH, $.merge(ev || {}, {
                fromIndex: this.fromIndex,
                currentIndex: this.activeIndex
            }));
        },

        //切换到上一视图
        prev: function(ev) {
            // 循环
            this.switchTo((this.activeIndex - 1 + this.length) % this.length,
                BACKWARD, ev);
        },

        //切换到下一视图
        next: function(ev) {
            // 循环
            this.switchTo((this.activeIndex + 1) % this.length,
                FORWARD, ev);
        },

        destroy: function() {
            //DOM.remove(self.container);
            this.container.remove();
            this.nav = null;
            this.content = null;
            this.container = null;
            //释放保存元素的集合
            this.triggers = [];
            this.panels = [];
            //释放事件
            this.off();
            this.detach();
        }
    });
});
