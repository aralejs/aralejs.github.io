
# Widget 

Widget 是 UI 组件的基础类，约定了组件的基本生命周期，实现了一些通用功能。基于 Widget
可以构建出任何你想要的 Web 界面。

---


## 模块依赖

 - [seajs](seajs/README.md)
 - [base](base/README.md)
 - [jquery](jquery/README.md) / [zepto](zepto/README.md)
 - TemplateWidget 还依赖 [handlebars](handlebars/README.md)


## 使用说明


### extend `Widget.extend(properties)`

使用 `extend` 方法，可以基于 `Widget` 来创建子类。

```js
define(function(require, exports, module) {
    var Widget = require('widget');

    // 定义 SimpleTabView 类
    var SimpleTabView = Widget.extend({
        events: {
            'click .nav li': 'switchTo'
        },

        switchTo: function(index) {
            ...
        },

        init: function() {
            this.triggers = this.$('.nav li');
            this.panels = this.$('.content div');
        },

        render: function() {
            this.switchTo(0);
            return this;
        }
    });

    // 实例化
    var demo = new SimpleTabView({ element: '#demo' }).render();
});

```

详细源码可访问：<http://aralejs.org/lib/widget/examples/simple-tabview.html>


### initialize `new Widget([options])`

Widget 实例化时，会调用此方法。

`options` 参数用于指定选项配置，之后可以通过 `this.options` 来访问。`options`
参数如果包含 `element` 和 `model` 属性，实例化后会直接放到 `this` 上，可通过
`this.element`、`this.model` 来获取。

```js
var widget = new Widget({
   element: '#demo',
   className: 'widget',
   model: {
       title: '设计原则',
       content: '开放、简单、易用'
   }
});
```

`options` 参数中还可以通过 `parentNode` 属性来指定当前 widget 在 DOM 中的父节点。

如果是 TemplateWidget，则还可以通过 `options.template` 指定对应的模板代码。


在 `initialize` 方法中，确定了组件构建的基本流程：

```js
initialize: function(options) {
    this.cid = uniqueId();
    this.initOptions(options);
    this.parseElement();
    this.parseDataAttrs();
    this.delegateEvents();
    this.init();
}
```


### initOptions `widget.initOptions(options)`

选项的初始化方法。通过该方法，会自动将传入的 `options` 参数与所继承的类中的默认 `options`
进行合并处理。

子类如果想在 `initOptions` 执行之前或之后进行一些额外处理，可以覆盖该方法：

```
var MyWidget = Widget.extend({
    initOptions: function(options) {
        // 提前做点处理

        // 调用父类的
        MyWidget.superclass.initOptions.call(this, options);

        // 之后做点处理
    }
});

```

**注意**：一般情况下不需要覆盖 `initOptions`。


### parseElement `widget.parseElement()`

该方法只干一件事：根据选项信息，构建好 `this.element`。

默认情况下，如果 `options` 参数中传入了 `element` 选项（取值可为 DOM element / Selector），会直接
根据该选项来获取 `this.element` 对象。否则会根据 `options.template` 来构建。

`this.element` 是一个 jQuery / Zepto 对象。


### parseElementFromTemplate `widget.parseElementFromTemplate()`

如果 `options` 参数中未传入 `element` 选项，则会根据 `template` 选项来构建
`this.element`。 默认的 `template` 是 `<div></div>`。

子类可覆盖该方法，以支持 Handlebars、Mustache 等模板引擎。


### parseDataAttrs `widget.parseDataAttrs()`

解析对应 DOM 结构中的 data-attribute api。假设 `this.element` 的 html 为：

```
<div data-widget="dialog">
    <div data-role="title">{{title}}</div>
    <div data-role="content">{{content}}</div>
    <span data-action="click close">X</span>
```

通过 `parseDataAttrs` 方法，可以得到 `this.dataset` 属性：

```
{
    "widget": { "dialog": ".daparser-0" },
    "role": {
              "title": ".daparser-1"
              "content": ".daparser-2"
            },
    "action": { "click close": ".daparser-3" }
}
```

`daparser-n` 是自动添加到对应 DOM 元素上的 className。通过 `this.dataset`
属性，可以快速找到匹配特定 data 属性的元素。比如

```
this.titleElement = this.$(this.dataset.role.title);
```


### delegateEvents `widget.delegateEvents(events, [handler])`



### undelegateEvents `widget.undelegateEvents(eventType, [handler])`



### init `widget.init()`



### render `widget.render()`



### $ `widget.$(selector)`



### destroy `widget.destroy()`



### on `widget.on(event, callback, [context])`

这是从 Events 中自动混入进来的方法。还包括 `off` 和 `trigger`。

具体使用请参考 [events 使用文档](events/README.md)。


## TemplateWidget 类





## 演示页面

 - <http://aralejs.org/lib/widget/examples/widget.html>
 - <http://aralejs.org/lib/widget/examples/simple-tabview.html>


## 测试用例

 - <http://aralejs.org/lib/widget/tests/runner.html>


## 交流讨论

欢迎创建
[GitHub Issue](https://github.com/alipay/arale/issues/new)
来提交反馈。
