
# Options

可用来自动处理对象实例的 options 选项。

---


## 使用说明

基于 `Base.extend` 创建的类，会自动添加上 `Options` 提供的功能。例子：

```js
/* panel.js */
define(function(require, exports, module) {
    var Base = require('base');
    var $ = require('$');

    var Panel = Base.extend({
        options: {
            classPrefix: 'ui-panel',
            mask: true
        },

        initialize: function(config) {
            Panel.superclass.initialize.call(this, config);
            this.element = $(config.element).eq(0);
        },

        show: function() {
            this.trigger('show');
            this.element.show();
            this.trigger('shown');
        }
    });
});
```

在 `initialize` 方法中，调用 `superclass.initialize` 方法，就可以自动设置好实例的 `options` 属性。

```js
/* test.js */
define(function(require, exports, module) {
    var Panel = require('./panel');

    var panel = new Panel({
        element: '#test',
        classPrefix: 'alice-panel'
    });

    console.log(panel.options.classPrefix); // ==> 'alice-panel'
    console.log(panel.options.mask);  // ==> true
});
```

使用 `extend` 创建类时，如果混入了 `Events` 模块，还可以在
`options` 中通过 `on` 前缀来添加事件回调：

```js
/* test2.js */
define(function(require, exports, module) {
    var Panel = require('./panel');

    var panel = new Panel({
        element: '#test',
        classPrefix: 'alice-panel',
        onShow: function() {
            alert('准备显示');
        },
        onShown: function() {
            alert('显示完毕');
        }
    });

    panel.show(); // 弹出两个 alert
});
```


返回 [Base 使用文档](../README.md)
