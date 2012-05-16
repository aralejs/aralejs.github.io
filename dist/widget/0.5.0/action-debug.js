//TODO 1. 目前准备对所有的行为绑定应该是widget来控制, 那我们的action到底来管理什么? type and handler?
//
//TODO 2. 当我们拿到一个 action, widget 来负责执行。 action 只负责管理对 action 的存储?
define("#widget/0.5.0/action-debug", ["class","$"], function(require, exports, module) {

    var Class = require('class');
    var $ = require('$');

    var slice = Array.prototype.slice;


    module.exports = Class.create({
        context: null,

        _actions: null,

        initialize: function(context, options) {
            this.context = context;
            this._actions = [];
            var actions = options.actions;
            if (actions) {
                delete options.actions;
                this.add(actions);
            }
        },

        add: function(action) {
            var that = this;
            if ($.isArray(action)) {
                $.each(action, function(index, _action) {
                    that.add(_action);
                });
            }
            if ($.isFunction(action)) {
                this._actions.push(action);
            }
        },

        use: function() {
            var that = this;
            var args = slice.call(arguments, 0);
            $.each(this._actions, function(index, action) {
                action.apply(that.context, args);
            });
        },

        destroy: function() {
            this._actions = null;
        }
    });
});
