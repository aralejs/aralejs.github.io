define(function(require, exports, module) {
    var $ = require('$');
    var makeArray = $.makeArray;

    var DOT = '.';
    
    var Default = 0; //默认结构。
    var Normal = 1; // 适度灵活。
    var Flexible = 2;//完全自由

    var Markup = exports.parse = function(container, options) {
        var nav, content, triggers = [], panels = [], n;
        switch (options.markupType) {
            case Default: 
                nav = $(DOT + options.navCls, container);
                nav && (triggers = nav.children());
                content = $(DOT + options.contentCls, container);
                panels = content.children();
                break;
            case Normal: 
                triggers = $(DOT + options.triggerCls, container);
                panels = $(DOT + options.panelCls, container);
                break;
            case Flexible: 
                triggers = options.triggers;
                panels = options.panels;
                break;
        }
        nav = nav || options.hasTriggers && triggers[0] && triggers[0].parentNode;

        // 自动生成 triggers and nav.  or 指定了 navCls ，但是可能没有手动填充 trigger
        if (options.hasTriggers && ( !nav || triggers.length == 0 )) {
            nav = _generateTriggersMarkup(nav, length, options);
            container.append(nav);
            triggers = nav.children();
        }

        // 将 triggers 和 panels 转换为普通数组
        triggers = makeArray(triggers);
        panels = makeArray(panels);

        return {
            nav: nav,
            triggers: triggers,
            panels: panels
        };

    };
    exports.DEFAULT = Default; //默认结构。
    exports.NORMAL = Normal; // 适度灵活。
    exports.FLEXIBLE = Flexible;//完全自由

     //自动生成 triggers 的 markup
    var _generateTriggersMarkup = function(nav, len, options) {
        var ul = nav || $('<ul>');
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
