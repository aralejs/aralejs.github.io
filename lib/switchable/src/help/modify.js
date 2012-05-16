//给switchable增加动态扩展功能， 增加和删除
define(function(require, exports, module) {
    module.exports = {
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
 
    }
});
