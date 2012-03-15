/**
 * @name aralex.Widget
 * @class
 * Arale所有组件的基类，它规定了组件的声明周期，和一些常见的接口
 * @author <a href="hui.kang@alipay.com">康辉</a>
 */

exports.Widget = arale.declare('aralex.Widget', null, {
    /** @lends aralex.Widget.prototype */

    //组件所要处理的对象的id,这个和下面的domNode互斥,两者只能设置其一
    id: null,

    //组件所要处理的对象
    domNode: null,

    init: function(params) {
        //一些初始化的内容,在这个里面可以更改params里面的东西
        //TODO 需要不需要把模版里面的空行,啥的给去掉
    },
    create: function(params) {
        arale.mixin(this, params, true);
        //为了方便垃圾收集,我们把在我们绑定到我们widget的事件都给放到这里面,当我们的widget destory的时候,去进行处理
        this._connects = [];

        this.actionFilters = {};

        this.beforeCreate.apply(this, arguments);
        //初始化dom,根据不同的基类组件可以有自己初始化base dom的方式
        this.initDom.apply(this, arguments);
        //绑定事件
        this.bind.apply(this, arguments);
        this.postCreate();
        this._created = true;
    },
    beforeCreate: function() {

    },
    initDom: function() {
        if (this.id) {
            this.domNode = $(this.id);
        }
    },
    postCreate: function() {
        //一些需要组件初始化完成后才能做的事情放到这里
    },
    bind: function() {
        //之类可以在这里进行覆盖,绑定自己需要的事件
    },
    /**
     * 添加一个需要绑定widget元素的事件
     * @param { String } event 事件名称,绑定那个事件.
     * @param { Function } handler 具体的处理函数.
     * @param { String } selector 一个选择表达式,用来指定widget具体响应事件的元素.
     * @example
     * this.add
     * @return {dom}
     */
    addEvent: function(eventType, handler, selector) {
        var handler = $E.delegate(this.domNode, eventType, arale.hitch(this, handler), selector);
        this._connects.push(handler);
    },
    /**
     * 给指定的函数添加before,after事件,默认是发布事件,fn
     * @param { String } fn 需要绑定的事件名称.
     * @example
     * this.aroundFn('show');
     * @return {Void}
     **/
     aroundFn: function(fn) {
         var that = this;
         var tracer = {
             before: function() {
                 $E.publish(that._getEventTopic(fn, 'before'), [].slice.call(arguments));
             },
             after: function() {
                 $E.publish(that._getEventTopic(fn, 'after'), [].slice.call(arguments));
             }
             /*
             around: function() {
                 $E.publish(that._getEventTopic(fn, 'before'), [].slice.call(arguments));
                 var retVal = arale.aspect.proceed.apply(null, arguments);
                 $E.publish(that._getEventTopic(fn, 'after'), [].slice.call(arguments));
                 return retVal;
             }
             */
         };
         $Aspect.advise(this, fn, tracer);
         this.defaultFn(fn);
     },
     defaultFn: function(fn) {
         var b = 'before' + $S(fn).capitalize();
         var a = 'after' + $S(fn).capitalize();
         this[b] && this.before(fn, this[b]);
         this[a] && this.after(fn, this[a]);

         var that = this;
         var tracer = {
             around: function() {
                 var checkFuncs;
                 if(checkFuncs = that.getActionFilters_(fn)) {
                     for(var e in checkFuncs) {
                         var isValid = checkFuncs[e];
                         if (arale.isFunction(isValid) && !isValid.apply(that, arguments)) {
                             return;
                         }
                     }
                 }
                 return $Aspect.proceed.apply(null, arguments);
             }
         };
         $Aspect.advise(this, fn, tracer);
     },

     /**
      * 增加一个actionFilter。使用actionFilter对某个函数进行过滤，若filter返回true，则函数有机会执行。
      * 若actionFilter返回false，则函数被拒绝执行。
      * @param {string} fn 要过滤的函数
      * @param {function:boolean} filter 控制函数，若此函数的返回值为false，则拒绝执行被控制的函数.
      * @return {Array} 此处返回的是一个句柄，用来移除此filter。
      */
     addActionFilter: function(fn, filter) {
         var id = arale.getUniqueId();
         (this.actionFilters[fn] || (this.actionFilters[fn] = {}))[id] = filter;
         return [fn, id];
     },

     getActionFilters_: function(fn) {
         return this.actionFilters[fn];
     },

     /**
      * 删除制定的actionFilter
      * @param {Array} handler 调用addActionFilter返回的句柄
      */
     removeActionFilter: function(handler) {
         if(arale.isArray(handler)) {
             var fn = handler[0], id = handler[1];
             if(fn && arale.isNumber(id) && arale.isObject(this.actionFilters[fn])) {
                 delete this.actionFilters[fn][id];
             }
         }
     },

     _getEventTopic: function(fn, phase) {
         return this.declaredClass + '/' + (this.id || 1) + '/' + fn + '/' + phase;
     },
     before: function(fn, callback) {
         return $E.subscribe(this._getEventTopic(fn, 'before'), arale.hitch(this, callback));
     },
     after: function(fn, callback) {
         return $E.subscribe(this._getEventTopic(fn, 'after'), arale.hitch(this, callback));
     },
     rmFn: function(handler) {
         $E.unsubscribe(handler);
     },
     /**
      **改变对象属性值
      */
     attr: function(key, value) {
         if ((key in this) && value !== undefined) {
             return (this[key] = value);
         }
         return this[key];
     },
     destroy: function() {
        $A(this._connects).each(function(handler) {
            $E.disConnect(handler);
        });
     }

});

 //1.默认组件需要一个domNode,这个元素是组件的外围元素.我们默认提供绑定事件addEvent这个方法都是在此元素的基础上的


