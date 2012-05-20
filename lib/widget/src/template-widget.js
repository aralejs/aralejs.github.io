define(function(require, exports, module) {

    // Template Widget
    // ------------------------------------------------
    // 模板类 UI 组件的基类，默认集成了 Handlebars 等强大的功能

    var Widget = require('./widget');
    var Handlebars = require('handlebars');
    var $ = require('$');


    var TemplateWidget = Widget.extend({

        options: {
            // 模板的 helpers
            helpers: {},

            // 组件的容器
            parentNode: document.body
        },

        // 根据模板和数据，构建出 this.element
        parseElementFromTemplate: function() {
            var options = this.options;
            var helpers = options.helpers;

            // 注册 helpers
            for (var name in helpers) {
                Handlebars.registerHelper(name, helpers[p]);
            }

            // 生成 html
            var html = Handlebars.compile(options.template)(this.model);

            // 卸载 helpers
            for (name in helpers) {
                delete Handlebars.helpers[name];
            }

            this.element = $(html);
        },

        // 将 widget 渲染到页面上，提供给子类覆盖
        // 约定：覆盖后，统一 `return this`
        render: function() {
            if (this.options.parentNode) {
                this.element.appendTo(this.options.parentNode);
            }

            return this;
        }
    });

    module.exports = TemplateWidget;

});
