define(function(require, exports, module) {

    var Base = require('base');
    var $ = require('jquery');
    var View = require('./view.js');
    var Action = require('./action.js');
    var DAParser = require('./daparser.js');

    var slice = Array.prototype.slice;
    var on = $.prototype.on;

    var Widget = module.exports = Base.extend({

        //组件展现层对象, 被封装为jquery对象.
        view: null,

        // 组件生命周期定义.
        initialize: function(options) {
            options = options || {};
            this._initView(options);

            //根据用户提供的模板或者组件结构, 分析是否包含指定的行为.
            this._parseAction(options);
            
            //在options注入到组件之前， 可以在进行相关修改。
            this.initOptions(options);

            this.setOptions(options);

            //组件展现层已经处理完毕, 留给用户处理相应的逻辑
            this.beforeCreate();

            //绑定行为. 需要具体的组件进行覆盖, 添加组件的行为.
            this.bindAction();

            //触发初始化完成事件
            this.trigger('initialized');

            //组件初始化完毕, 用户可以在这个函数中添加相应的逻辑.
            this.postCreate();
        },

        //具体展现层的处理, 有View模块来负责。
        _initView: function(options) {
            this.view = new View(options);
            this.trigger('view');
        },
        
        initOptions: function() {
                     
        },
        beforeCreate: function() {

        },

        //主要通过DAParser对组件模板文件进行分析, 然后创建出Action。目前这个具体的过程还在完善。
        _parseAction: function(options) {
            var action = this.action = new Action(this, options);
            var parsedObj;
            return;
            parsedObj = DAParser(this['data-arrts']).parse(this.getElement());
            $.each(parseObj.actions, function(index, action) {

            });
        },

        postCreate: function() {

        },

        // 组件展现层进行 dom 事件绑定的便利的方法。
        onElement: function(type, selector, handler) {
            on.apply(this.getElement(), slice.call(arguments, 0));
        },

        // 根据分析出来的 Action。 进行行为添加。 目前还没有确定。 此方法暂时不可用。
        _applyAction: function(action) {
            var that = this;
            if ($.isFunction(action)) {
                action.call(that, that.getElement(), that);
            }
        },

        // 对指定的函数在执行之前和之后添加事件通知的便利方法。
        aroundFn: function(fnName, before, after) {
            if (!(before || after)) {
                return;
            }

            var that = this;
            var orignFunction = this[fnName];

            var newFunction = function() {
                before && that.trigger(before, that);
                orignFunction.apply(that, slice.call(arguments, 0));
                after && that.trigger(arter, that);
            }
            this[fnName] = newFunction;
        },

        // 获取组件对应的 dom 元素。
        getElement: function() {
            return this.view.getElement();
        },

        //给组件生成唯一的id。
        //TODO id是否需要和dom进行关联？
        getId: function() {
            return this.id || (this.id = 'widget_' + $.guid++);
        },

        destroy: function() {
            this.off();
            var element = this.getElement();
            element && element.off();
            this.action.destroy();
        }
    });
});
