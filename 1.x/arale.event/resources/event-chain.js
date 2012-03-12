/**
 * @name arale.event.chain
 * @namespace
 * 一个事件仓库, 所有的事件绑定的处理函数, 最终都会被添加到事件仓库里面
 * @description
 * 可以直接使用$E.来操作方法
 */
var arale = window.arale || require('arale.base');
arale.module('arale.event.chain', (function(arale) {
    var array = arale.array;
    var Action = function(fn) {
        this.handler = fn;
    };
    arale.augment(Action, {
        fire: function(e) {
            if (e && e.originalEvent && e.originalEvent.cancelBubble) {
                return;
            }else {
                this.handler.call(null, e);
                if (this.parent) {
                    this.parent.fire(e);
                }
            }
        },
        setParent: function(action) {
            this.parent = action;
        }
    });
    var Chain = function(fn) {
        if (arale.isArray(fn)) {
            var that = this, firstAction = fn.shift();
            this.action = new Action(firstAction);
            $A(fn).each(function(action) {
                that.addAction(action);
            });
        }else {
            this.action = new Action(fn);
        }
    };
    arale.augment(Chain, {
        /**
         * 在我们的chain中添加一个事件对象
         * @memberOf arale.event.chain
         * @param {Function} fn 事件处理函数.
         * @example
            * var chain = $E.getChains(f1);
         * chain.addAction(f2);
         * chain.addAction(f3);
         * chain.fire({name:kang});
         */
        addAction: function(fn) {
            var action = new Action(fn);
            action.setParent(this.action);
            this.action = action;
        },
        /**
         * 触发我们的chain
         * @memberOf arale.event.chain
         * @param {Object} e 在我们chain中需要传递的数据.
         * @example
         * var chain = $E.getChains(f1);
         * chain.addAction(f2);
         * chain.addAction(f3);
         * chain.fire({name:kang});
         */
        fire: function(e) {
            var obj = $E.getEventObject(this.action, e);
            this.action.fire.apply(this.action, [obj].concat(Array.prototype.slice.call(arguments)));
        }
    });
    var exportsObject = /** @lends arale.event.chain */{
         /**
         * 获取一个chain
         * @param {Function 或 Array} fn 初始化的action.
         * @example
         * var f1 = function() {console.log(1)};
            * var f2 = function() {console.log(2)};
            * var f3 = function() {console.log(3)};
         * var chain = $E.getChains(f1);
         * chain.addAction(f2);
         * chain.addAction(f3);
         * chain.fire({name:kang});
         * ========
         * var chain2 = $E.getChains([f1, f2, f3]) ;
         * chain2.fire();
         * ========
         * var chain3 = $E.getChains(f1, f2, f3) ;
         * chain3.fire();
         *
         */
        getChains: function(fn) {
            if (arguments.length > 1) {
                return new Chain([].slice.call(arguments, 0));
            }
            return new Chain(fn);
        }
    };
    exports.getChains = exportsObject.getChains;
})(arale), '$E');
