define(function(require, exports, module) {

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

        compile: function(template, model) {
            template || (template = this.get('template'));
            model || (model = this.model);
            var helpers = this.templateHelpers;

            // 注册 helpers
            if (helpers) {
                for (var name in helpers) {
                    if (helpers.hasOwnProperty(name)) {
                        Handlebars.registerHelper(name, helpers[name]);
                    }
                }
            }

            // 生成 html
            var html = Handlebars.compile(template)(model);

            // 卸载 helpers
            if (helpers) {
                for (name in helpers) {
                    if (helpers.hasOwnProperty(name)) {
                        delete Handlebars.helpers[name];
                    }
                }
            }

            return html;
        }
    };

    module.exports = Templatable;

});
