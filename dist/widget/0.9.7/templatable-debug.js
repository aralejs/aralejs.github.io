define("#widget/0.9.7/templatable-debug", ["handlebars","$"], function(require, exports, module) {

    var Handlebars = require('handlebars');
    var $ = require('$');


    // 提供 Template 模板支持，默认引擎是 Handlebars
    var Templatable = {

        // Handlebars 的 helpers
        templateHelpers: null,

        // 根据配置的模板和传入的数据，构建 this.element
        parseElementFromTemplate: function() {
            var html = this.renderTemplate();
            this.element = $(html);
        },

        renderTemplate: function(template, model) {
            if (!template) template = this.get('template');
            if (!model) model = this.model;

            var helpers = this.templateHelpers;

            // 注册 helpers
            if (helpers) {
                for (var name in helpers) {
                    Handlebars.registerHelper(name, helpers[name]);
                }
            }

            // 生成 html
            var html = Handlebars.compile(template)(model);

            // 卸载 helpers
            if (helpers) {
                for (name in helpers) {
                    delete Handlebars.helpers[name];
                }
            }
            return html;
        }
    };

    module.exports = Templatable;

});
