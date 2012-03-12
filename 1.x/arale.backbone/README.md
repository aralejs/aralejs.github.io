Overview
========

`arale.backbone`项目是前端mvc框架，支持复杂应用的MVC架构的快速实现。它引入开源的[Backbone](https://github.com/documentcloud/backbone/)项目，加上和Arale框架的适配器，放入Arale体系中由maven统一管理。

关于Backbone的文档可以参考[这里](http://documentcloud.github.com/backbone/)。

Arale适配后与Backbone官方不同的API
==================================

*   View的make方法不可用。
*   View里通过添加一个events对象，然后在初始化的时候默认调用delegateEvents的方式不可用，因为它强耦合了jQuery。新的方式是通过在initialize方法中手动的调用addEvents方法：
    
        var DocumentView = Backbone.View.extend({
            _events: {
                "dblclick"                : "open",
                "click .icon.doc"         : "select",
                "contextmenu .icon.doc"   : "showMenu",
                "click .show_notes"       : "toggleNotes",
                "click .title .lock"      : "editAccessLevel",
                "mouseover .title .date"  : "showTooltip"
            },
            initialize: function() {
                this.addEvents(this._events);
            },
            render: function() {
            },
            open: function() {
            },
            select: function() {
            }
        });
