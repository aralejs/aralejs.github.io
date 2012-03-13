/**
 * @name arale.event.store
 * @namespace
 * 一个事件仓库,所有的事件绑定的处理函数,最终都会被添加到事件仓库里面.
 * @description
 * 可以直接使用$E.来操作方法 .
 */
var arale = window.arale || require('arale.base');
var $A = window.$A || require('arale.array');

arale.module('arale.event.store', (function(arale) {
    var array = arale.array, arr = Array.prototype;
    /**
        {
            targets:{
                id:target
            },
            handlers:{
                id:{type:[]}
            }
        }
    **/
    var store = function() {
        this.targets = {};
        this.handlers = {};
    };
    arale.augment(store, {
        /**
         * 给事件仓库添加一个事件 .
         * @memberOf arale.event.store.
         * @param {number} id 某一类事件的标示 .
         * @param {string} type 事件的类型.
         * @param {function} fn 事件处理函数.
         * @example
         * var store = $E.getStore();
         * store.addHandler("123","click",f1);
         */
        addHandler: function(id, type, fn) {
            //TODO 优化
            this._getHandlerList(id, type).push(fn);
            return fn;
        },
        _getHandlerList: function(id, type){
            var handlers = this.handlers;
            var handlersForId = handlers[id] || (handlers[id] = {});
            return (handlersForId[type] || (handlersForId[type] = []));
        },
        /**
         * 移除一个事件
         * @memberOf arale.event.store  .
         * @param {number} id 某一类事件的标示 .
         * @param {string} type 事件的类型 .
         * @param {function} fn 事件处理函数.
         * @example
         * var store = $E.getStore();
         * store.addHandler("123","click",f1);
         * store.removeHandler("123","click",f1);
         */
        removeHandler: function(id, type, fn) {
            var handlers = this.handlers, shandler;
            if (!handlers[id]) return;
            shandler = handlers[id];
            if (!shandler[type]) return;
            shandler[type] = $A(shandler[type]).filter(function(f) {
                return f != fn;
            });
            if (shandler[type].length === 0) {
                delete handlers[id][type];
            }
        },
        /**
         * 移除某这个类型的所有事件 .
         * @memberOf arale.event.store.
         * @param {number} id 某一类事件的标示  .
         * @param {string} type 事件的类型 .
         * @param {function} fn 事件处理函数.
         * @example
         * var store = $E.getStore();
         * store.addHandler("123","click",f1);
         * store.addHandler("123","click",f1);
         * store.addHandler("123","click",f2);
         * store.removeAllHandler("123","click");
         */
        removeAllHandler: function(id, type) {
            var handlers = this.handlers;
            if (handlers[id] && handlers[id][type]) {
                handlers[id][type] = null;
                delete handlers[id][type];
            }
        },
        /**
         * 调用某类型的所有事件 .
         * @memberOf arale.event.store .
         * @param {number} id 某一类事件的标示 .
         * @param {string} type 事件的类型 .
         * @param {Object} fn 事件对象   .
         * @example
         * var store = $E.getStore();
         * store.addHandler("123","click",f1);
         * store.addHandler("123","click",f1);
         * store.addHandler("123","click",f2);
         * store.invoke("123","click",{'name:kang'})
         */
        invoke: function(id, type, e) {
            var handlers = this.getHandlers(id, type), params = arr.slice.call(arguments, 2);
            $A(handlers).each(function(fn) {
                arale.isFunction(fn) && fn.apply(null, params);
            });
        },
        /**
         * 获取某类型的所有事件 .
         * @memberOf arale.event.store.
         * @param {number} id 某一类事件的标示.
         * @param {string} type 事件的类型 .
         * @example
         * var store = $E.getStore();
         * store.addHandler("123","click",f1);
         * store.addHandler("123","click",f1);
         * store.addHandler("123","click",f2);
         * var handlers = store.getHandlers("123","click");
         */
        getHandlers: function(id, type) {
            if (this.handlers[id] === undefined) return [];
            if (this.handlers[id][type] === undefined) {
                return this.handlers[id][type] = [];
            }
            return this.handlers[id][type];
        },
        getTarget: function(id) {
            return this.targets[id];
        },
        setTarget: function(target) {
            this.targets[id] = target;
        }
    });
    var exportsObject = /** @lends arale.event.store.prototype */{
        /**
         * 获取一个事件仓库.
         * @memberOf arale.event.store.
         * @example
         * var f1 = function(){console.log(1)};
         * var f2 = function(){console.log(2)};
         * var f3 = function(){console.log(3)};
         * var store = $E.getStore();
         * store.addHandler("123","click",f1);
         * store.addHandler("123","click",f2);
         * store.addHandler("123","click",f3);
         * store.invoke("123","click",{'name:kang'})
         * store.removeHandler("123",'click',f1);
         * store.invoke("123","click",{'name:kang'})
         */
        getStore: function() {
            return new store();
        }
    };
    exports.getStore = exportsObject.getStore;
    return exportsObject;
})(arale), '$E');
