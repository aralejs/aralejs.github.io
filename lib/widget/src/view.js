define(function(require, exports, module) {

    var Class = require('class');
    var $ = require('jquery');
    //var Template = require('tmpl');
    var needOptions = ['element', 'tpl', 'model'];

    module.exports = Class.create({
        options: {

            //组件模板。 可以用户传入, 或者具体的组件提供。
            tpl: null,

            // 数据对象, 需要和模板同时传入。
            model: null,

            //组件关联对象。
            element: null,

            //组件对应的样式。
            style: null
        },

        initialize: function(options) {
            this.initOptions(options);
            this.initStyle(options);
        },

        initOptions: function(options) {
            var option;
            for (var i = 0, len = needOptions.length; i < len; i++) {
                option = needOptions[i];
                this.options[option] = options[option];
                delete options[option];
            }
        },

        initStyle: function() {
            if (this.style) {
                seajs.importCss(this.style);
            }
        },

        getElement: function() {
            if (!this.element) {
                this.element = $(this.options.element || this.render());
            }
            return this.element;
        },

        render: function() {
            var options = this.options;
            var tpl = options.tpl;
            var model = options.model;
            if (!(tpl || model)) {
                throw new Error('Missing required parameter!');
            }
            if (model) {
                return template.render(tpl, model);
            } else {
                return $(tpl);
            }
        },

        appendTo: function(target) {
            this.getElement().appendTo(target);
        },

        remove: function() {
            var element = this.getElement();
            element && element.remove();
        }
    });
});
