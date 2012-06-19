define("#widget/0.9.16/ast-printer-mobile-debug", [], function(require, exports) {

    // Handlebars AST Printer
    // -----------------------
    // 基于 handlebars/compiler/printer.js 修改，用于将 AST 转换回 template 字符串

    var Printer = exports;
    Printer.print = print;

    function print(node, internal) {
        return Printer[node.type](node, internal);
    }

    Printer.program = function(node) {
        var out = '';
        var statements = node.statements;

        for (var i = 0, len = statements.length; i < len; i++) {
            out = out + print(statements[i]);
        }

        return out;
    };

    Printer.block = function(node) {
        var out = '';
        var mustache = node.mustache;

        out += print(mustache, true);
        out += print(node.program);
        out += '{{/' + print(mustache.id) + '}}';

        return out;
    };

    Printer.mustache = function(node, isBlockOpen) {
        var id = print(node.id);

        var params = node.params, paramStrings = [];
        for (var i = 0, len = params.length; i < len; i++) {
            paramStrings[i] = print(params[i]);
        }
        params = paramStrings.join(' ');
        if (params) params = ' ' + params;

        var hash = node.hash ? ' ' + print(node.hash) : '';
        var openTag = isBlockOpen ? '#' : '';

        return '{{' + openTag + id + params + hash + '}}';
    };

    Printer.hash = function(node) {
        var out = [];

        for (var i = 0, pairs = node.pairs, len = pairs.length; i < len; i++) {
            var pair = pairs[i];
            out[i] = pair[0] + '=' + print(pair[1]);
        }

        return out.join(' ');
    };

    Printer.STRING = function(node) {
        return '"' + node.string + '"';
    };

    Printer.INTEGER = function(node) {
        return node.integer;
    };

    Printer.BOOLEAN = function(node) {
        return node.bool;
    };

    Printer.ID = function(node) {
        return node.original; // 用 original 能保持 {{this}}
    };

    Printer.content = function(node) {
        return node.string;
    };

    Printer.comment = function(node) {
        return '{{!' + node.comment + '}}';
    };

});
