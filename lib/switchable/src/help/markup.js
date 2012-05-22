define(function(require, exports, module) {
    var $ = require('$');
    var makeArray = $.makeArray;

    var DOT = '.';
    var Default = 0; //默认结构。
    var Normal = 1; // 适度灵活。
    var Flexible = 2;//完全自由

    var Markup = exports.parse = function(w, options) {
        var nav, content, triggers = [], panels = [], n, length;
        switch (options.markupType) {
            case Default:
                nav = w.$(DOT + options.navCls);
                nav && (triggers = nav.children());
                content = w.$(DOT + options.contentCls);
                panels = content.children();
                break;
            case Normal:
                triggers = w.$(DOT + options.triggerCls);
                panels = w.$(DOT + options.panelCls);
                break;
            case Flexible:
                triggers = options.triggers;
                panels = options.panels;
                break;
        }
        nav = nav || options.hasTriggers && triggers[0] && triggers[0].parentNode;
        length = Math.ceil(panels.length / options.steps);
        // 自动生成 triggers and nav.  or 指定了 navCls ，但是可能没有手动填充 trigger
        if (options.hasTriggers && (!nav || triggers.length == 0)) {
            nav = _generateTriggersMarkup(nav, length, options);
            w.element.append(nav);
            triggers = nav.children();
        }

        // 将 triggers 和 panels 转换为普通数组
        triggers = makeArray(triggers);
        panels = makeArray(panels);
        content = content || panels[0].parentNode;

        return {
            nav: nav,
            triggers: triggers,
            panels: panels,
            content: content
        };

    };
    exports.DEFAULT = Default; //默认结构。
    exports.NORMAL = Normal; // 适度灵活。
    exports.FLEXIBLE = Flexible;//完全自由

     //自动生成 triggers 的 markup
    var _generateTriggersMarkup = function(nav, len, options) {
        var ul = (nav && nav.length > 0) || $('<ul>');
        var li, i;

        ul.addClass(options.navCls);

        for (i = 0; i < len; i++) {
            li = $('<li>');
            if (i === this.activeIndex) {
                li.addClass(options.activeTriggerCls);
            }
            li.html(i + 1);
            ul.append(li);
        }
        return ul;
    };
});
