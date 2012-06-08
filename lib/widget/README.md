
# Widget 

Widget 是 UI 组件的基础类，约定了组件的基本生命周期，实现了一些通用功能。基于 Widget
可以构建出任何你想要的 Web 组件。

---


## 模块依赖

 - [seajs](seajs/README.md)
 - [base](base/README.md)
 - [jquery](jquery/README.md) / [zepto](zepto/README.md)
 - [handlebars](handlebars/README.md)

**注**：handlebars 依赖仅在混入 `Templatable` 后才产生。


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
        ...
    });

    // 实例化
    var demo = new SimpleTabView({ element: '#demo' }).render();
});

```

详细源码可访问：[simple-tabview.html](http://aralejs.org/lib/widget/examples/simple-tabview.html)


### initialize `new Widget([config])`

Widget 实例化时，会调用此方法。

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

`config` 参数用来传入选项，实例化后可以通过 `get/set` 来访问。`config`
参数如果包含 `element` 和 `model` 属性，实例化后会直接放到 `this` 上，即可通过
`this.element`、`this.model` 来获取。


在 `initialize` 方法中，确定了组件构建的基本流程：

```js
    this.initAttrs(...);
    this.parseElement();
    this.initProps();
    this.delegateEvents();
    this.setup();
```

下面逐一讲述。


### initAttrs `widget.initAttrs(config, [dataAttrsConfig])`

选项的初始化方法。通过该方法，会将传入的 `config` 参数与所继承的类中的默认 `config`
进行合并处理。

子类如果想在 `initAttrs` 执行之前或之后进行一些额外处理，可以覆盖该方法：

```
var MyWidget = Widget.extend({
    initAttrs: function(config) {
        // 提前做点处理

        // 调用父类的
        MyWidget.superclass.initAttrs.call(this, config);

        // 之后做点处理
    }
});

```

**注意**：一般情况下不需要覆盖 `initAttrs`。


### parseElement `widget.parseElement()`

该方法只干一件事：根据选项信息，构建好 `this.element`。

默认情况下，如果 `config` 参数中传入了 `element` 选项（取值可为 DOM element / selector），
会直接根据该选项来获取 `this.element` 对象。

`this.element` 是一个 jQuery / Zepto 对象。


### parseElementFromTemplate `widget.parseElementFromTemplate()`

如果 `config` 参数中未传入 `element` 选项，则会根据 `template` 选项来构建
`this.element`。 默认的 `template` 是 `<div></div>`。

子类可覆盖该方法，以支持 Handlebars、Mustache 等模板引擎。


### element `widget.element`

widget 实例对应的 DOM 根节点，是一个 jQuery / Zepto 对象。


### initProps `widget.initProps()`

properties 的初始化方法，提供给子类覆盖，比如：

```js
initProps: function() {
    this.targetElement = $(this.get('target'));
}
```


### delegateEvents `widget.delegateEvents([events])`

### delegateEvents `widget.delegateEvents(eventType, handler)`

注册事件代理。在 Widget 组件的设计里，推荐使用代理的方式来注册事件。这样可以使得对应的
DOM 内容有修改时，无需重新绑定。

`widget.delegateEvents()` 会在实例初始化时自动调用，这时会从 `this.events`
中取得声明的代理事件，比如

```js
var MyWidget = Widget.extend({
    events: {
        "dblclick": "open",
        "click .icon.doc": "select",
        "mouseover .date": "showTooltip"
    },
    open: function() {
        ...
    },
    select: function() {
        ...
    },
    ...
});
```

`events` 中每一项的格式是：`"event selector": "callback"`，当省略 `selector`
时，默认会将事件绑定到 `this.element` 上。`callback` 可以是字符串，表示当前实例上的方法名；
也可以直接传入函数。

`events` 还可以是方法，返回一个 events hash 对象即可。比如

```js
var MyWidget = Widget.extend({
    events: function() {
        var hash = {
            "click": "open",
            "click .close": "close"
        };

        // 给 data-role="title" 的元素声明 toggle 事件代理
        hash["click " + this.dataset.role.title] = "toggle";

        return hash;
    },
    ...
});
```

`events` 中，还支持 `{{name}}` 模板表达式，比如上面的代码，可以简化为：

```js
var MyWidget = Widget.extend({
    events: {
        "click": "open",
        "click .close": "close",
        "click {{dataset.role.title}}": "toggle",
        "mouseover {{trigger}}": "open",
        "mouseover {{attrs.panels}}": "hover"
        "click {{header}},{{footer}}": "egg"
    },
    ...
});
```

实例化后，还可以通过 `delegateEvents` 方法动态添加事件代理：

```js
var myWidget = new Widget();

myWidget.delegateEvents('click .move', function() {
  // ...
});
```


### undelegateEvents `widget.undelegateEvents([eventType])`

卸载事件代理。不带参数时，表示卸载所有事件。


### setup `widget.setup()`

提供给子类覆盖的初始化方法。可以在此处理更多初始化信息，比如

```js
var TabView = Widget.extend({
    ...
    setup: function() {
        this.activeIndex = getActiveIndex();
    },
    ...
});
```


### render `widget.render()`

提供给子类覆盖的初始化方法。render 方法只干一件事件：将 `this.element` 渲染到页面上。

默认无需覆盖。需要覆盖时，请使用 `return this` 来保持该方法的链式约定。


### $ `widget.$(selector)`

在 `this.element` 内查找匹配节点。


### destroy `widget.destroy()`

销毁实例。


### on `widget.on(event, callback, [context])`

这是从 Events 中自动混入进来的方法。还包括 `off` 和 `trigger`。

具体使用请参考 [events 使用文档](events/README.md)。


### autoRenderAll `Widget.autoRenderAll(root)`

根据 data-widget 属性，自动渲染找到的所有 Widget 类组件。


## Templatable

可混入的功能类，提供 Handlebars 模板支持。

```js
var Templatable = require('widget-templatable');

var MyWidget = Widget.extend({
    Implements: Templatable
});

var myWidget = new MyWidget({
    template: '<h3>{{title}}</h3><ol>{{#each list}}<li>{{item}}</li>{{/each}}',
    model: {
        'title': '标题',
        'list': [
            { 'item': '文章一' },
            { 'item': '文章二' }
        ]
    },
    parentNode: '#demo'
});

myWidget.render();
```


## DAParser

data-api 解析工具，功能如下：


### parseBlock `DAParser.parseBlock(root)`


解析对应 DOM 结构中的 DATA-ATTRIBUTE API。假设 `root` 元素的 html 为：

```
<div data-widget="dialog">
    <div data-role="title">{{title}}</div>
    <div data-role="content">{{content}}</div>
    <span data-action="click close">X</span>
</div>
```

通过 `parseBlock` 方法，可以得到 `dataset` 对象：

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

`daparser-n` 是自动添加到对应 DOM 元素上具有唯一性质的 className 。


### parseElement `DAParser.parseElement(element)`

得到单个 DOM 元素的 dataset 数据。


### stamp `DAParser.stamp(element)`

给 DOM 元素添加具有唯一性质的 className 。


## 演示页面

 - <http://aralejs.org/lib/widget/examples/widget.html>
 - <http://aralejs.org/lib/widget/examples/simple-tabview.html>


## 测试用例

 - <http://aralejs.org/lib/widget/tests/runner.html>


## 交流讨论

欢迎创建
[GitHub Issue](https://github.com/alipay/arale/issues/new)
来提交反馈。
