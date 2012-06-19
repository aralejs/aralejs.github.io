define("#widget/0.9.16/templatable-debug", ["#jquery/1.7.2/jquery-debug", "#handlebars/1.0.0/handlebars-debug", "#widget/0.9.16/ast-printer-debug"], function(require, exports, module) {

    var $ = require("#jquery/1.7.2/jquery-debug");
    var Handlebars = require("#handlebars/1.0.0/handlebars-debug");
    Handlebars.print = require("#widget/0.9.16/ast-printer-debug").print;


    // 提供 Template 模板支持，默认引擎是 Handlebars
    var Templatable = {

        // Handlebars 的 helpers
        templateHelpers: null,

        // template 对应的 DOM-like object
        templateObject: null,

        // 根据配置的模板和传入的数据，构建 this.element 和 templateElement
        parseElementFromTemplate: function() {
            this.templateObject = convertTemplateToObject(this.template);
            this.element = $(this.compile());
        },

        // 编译模板，混入数据，返回 html 结果
        compile: function(template, model) {
            template || (template = this.template);

            model || (model = this.model);
            if (model.toJSON) {
                model = model.toJSON();
            }

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

        // 刷新 selector 指定的局部区域
        renderPartial: function(selector) {
            var template = this._getTemplatePartial(selector);
            this.$(selector).html(this.compile(template));
            return this;
        },

        // 得到模板片段
        _getTemplatePartial: function(selector) {
            var template;

            // 获取模板片段
            if (selector) {
                template = convertObjectToTemplate(
                        this.templateObject, selector);
            }
            // 没有选择器时，表示选择整个模板
            else {
                template = this.template;
            }

            return template;
        }
    };

    module.exports = Templatable;


    // Helpers
    // -------

    // 将 template 字符串转换成对应的 DOM-like object
    function convertTemplateToObject(template) {
        var statements = Handlebars.parse(template).statements;
        var html = '';

        for (var i = 0, len = statements.length; i < len; i++) {
            var stat = statements[i];

            // AST.ContentNode
            if (stat.type === 'content') {
                html += stat.string;
            }
            // AST.MustacheNode or AST.BlockNode
            else {
                html += '{{STAT ' + i + '}}';
            }
        }

        html = encode(html);

        var templateObject = $(html);
        templateObject.template = html;
        templateObject.statements = statements;

        return templateObject;
    }

    // 根据 selector 得到 DOM-like template object，并转换为 template 字符串
    function convertObjectToTemplate(templateObject, selector) {
        var element = templateObject.find(selector);
        if (element.length === 0) {
            throw new Error('Invalid template selector: ' + selector);
        }

        var html = decode(element.html());
        var statements = templateObject.statements;

        // 将 html 中的 {{STAT n}} 还原为模板字符串
        html = html.replace(STAT_RE, function(match, $1, $2) {
            return Handlebars.print(statements[$2]);
        });

        return html;
    }


    var STAT_RE = /({{STAT (\d+)}})/g;
    var STAT_DECODE_RE = /(?:<|&lt;)!--({{STAT \d+}})--(?:>|&gt;)/g;

    function encode(template) {
        return template.replace(STAT_RE, '<!--$1-->');
    }

    function decode(template) {
        return template.replace(STAT_DECODE_RE, '$1');
    }

});
