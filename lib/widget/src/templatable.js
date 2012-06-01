define(function(require, exports, module) {

    var Handlebars = require('handlebars');
    var $ = require('$');
    var DAParser = require('./daparser');


    // 提供 Template 模板支持，默认引擎是 Handlebars
    var Templatable = {

        // Handlebars 的 helpers
        templateHelpers: null,

        // template 对应的 DOM element
        templateElement: null,

        // 根据配置的模板和传入的数据，构建 this.element 和 templateElement
        parseElementFromTemplate: function() {
            this.templateElement = getTemplateElement(this.template);

            // 将 daparser class 添加在模板中，以便动态更新时依旧有效
            /*
            if (this.get('data-api')) {
                this.dataset = DAParser.parse(this.templateElement[0]);
                // 更新 template 为最新
                this.template = this._getTemplate();
            }
            */

            // 生成 element
            this.element = $(this.compile());
        },

        // 编译模板，混入数据，返回 html 结果
        compile: function(template, model) {
            template || (template = this.template);
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
        },

        // 局部刷新，比如 `this.renderPartial('#content')`，只刷新内容区域
        renderPartial: function(selector, model) {
            var template = this._getTemplate(selector);
            var html = this.compile(template, model);

            this.$(selector).html(html);
            return this;
        },

        // 得到模板片段
        _getTemplate: function(selector) {
            var html;

            // 获取模板片段
            if (selector) {
                html = this.templateElement.find(selector).html();
            }
            // 没有选择器时，表示选择整个模板
            else {
                html = getOuterHTML(this.templateElement);
            }

            return decode(html);
        }
    };

    module.exports = Templatable;


    // Helpers
    // -------

    // 将 template 字符串转换成对应的 document fragment
    function getTemplateElement(template) {
        return $(encode(template));
    }


    var TPL_ENCODE_RE = /({{[^{}]+}})/g;
    var TPL_DECODE_RE = /(?:<|&lt;)!--({{[^{}]+}})--(?:>|&gt;)/g;

    function encode(template) {
        return template.replace(TPL_ENCODE_RE, '<!--$1-->');
    }

    function decode(template) {
        return template.replace(TPL_DECODE_RE, '$1');
    }


    function getOuterHTML(element) {
        if (element[0].outerHTML !== undefined) {
            return element[0].outerHTML;
        }
        else {
            return element.wrap('<div></div>').html();
        }
    }

});
