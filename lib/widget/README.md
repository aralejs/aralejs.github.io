
# Widget 

Widget 是 UI 组件的基础类，约定了组件的基本生命周期，实现了一些通用功能。基于 Widget
可以构建出任何你想要的 Web 组件。

---


## 模块依赖

 - [seajs](seajs/README.md)
 - [base](base/README.md)
 - [jquery](jquery/README.md) / [zepto](zepto/README.md)
 - [handlebars](handlebars/README.md)

**注**：handlebars 仅在混入 `Widget.Template` 后才产生依赖。


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

        render: function() {
            this.switchTo(0);
            return this;
        }
    });

    // 实例化
    var demo = new SimpleTabView({ element: '#demo' }).render();
});

```

详细源码可访问：[simple-tabview.html](http://aralejs.org/lib/widget/examples/simple-tabview.html)


### initialize `new Widget([options])`

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

`options` 参数用来传入选项，实例化后可以通过 `this.options` 来访问。`options`
参数如果包含 `element` 和 `model` 属性，实例化后会直接放到 `this` 上，即可通过
`this.element`、`this.model` 来获取。

`options` 参数中还可以通过 `parentNode` 属性来指定当前 widget 在 DOM 中的父节点。


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

下面逐一讲述。


### initOptions `widget.initOptions(options)`

选项的初始化方法。通过该方法，会将传入的 `options` 参数与所继承的类中的默认 `options`
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

默认情况下，如果 `options` 参数中传入了 `element` 选项（取值可为 DOM element / selector），
会直接根据该选项来获取 `this.element` 对象。

`this.element` 是一个 jQuery / Zepto 对象。


### parseElementFromTemplate `widget.parseElementFromTemplate()`

如果 `options` 参数中未传入 `element` 选项，则会根据 `template` 选项来构建
`this.element`。 默认的 `template` 是 `<div></div>`。

子类可覆盖该方法，以支持 Handlebars、Mustache 等模板引擎。


### element `widget.element`

widget 实例对应的 DOM 根节点，是一个 jQuery / Zepto 对象。


### parseDataAttrs `widget.parseDataAttrs()`

解析对应 DOM 结构中的 DATA-ATTRIBUTE API。假设 `this.element` 的 html 为：

```
<div data-widget="dialog">
    <div data-role="title">{{title}}</div>
    <div data-role="content">{{content}}</div>
    <span data-action="click close">X</span>
</div>
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

`daparser-n` 是自动添加到对应 DOM 元素上具有唯一性质的 className。通过 `this.dataset`
属性，可以快速找到具有特定 data 属性的元素。比如

```
this.title = this.$(this.dataset.role.title);
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

        // 给 trigger DOM element 声明 open 事件代理
        hash["mouseover " + this.uniqueClass(this.trigger)] = "open";

        return hash;
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


### undelegateEvents `widget.undelegateEvents([eventType], [handler])`

卸载事件代理。不带参数时，表示卸载所有事件。


### init `widget.init()`

提供给子类覆盖的初始化方法。可以在此处理更多初始化信息，比如

```js
var TabView = Widget.extend({

    ...

    init: function() {
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


### uniqueClass `widget.uniqueClass(element)`

获取 `element` 上具有唯一性的 className，如果没有则添加。经常用在 events 的声明函数中。

```js
var MyWidget = Widget.extend({

    events: function() {
        var hash = {
            'click p': 'light'
        };

        hash['click ' + this.uniqueClass(this.title)] = 'toggle';
        return hash;
    },

    ...
});
```


### destroy `widget.destroy()`

销毁实例。


### on `widget.on(event, callback, [context])`

这是从 Events 中自动混入进来的方法。还包括 `off` 和 `trigger`。

具体使用请参考 [events 使用文档](events/README.md)。


### Templatable

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


## 演示页面

 - <http://aralejs.org/lib/widget/examples/widget.html>
 - <http://aralejs.org/lib/widget/examples/simple-tabview.html>


## 测试用例

 - <http://aralejs.org/lib/widget/tests/runner.html>


## 交流讨论

欢迎创建
[GitHub Issue](https://github.com/alipay/arale/issues/new)
来提交反馈。
