
# Options

`Base.Options` 模块，可用来自动处理对象实例的 options.

---


## 使用说明

使用 `extend` 创建的类，会自动添加上 `Options` 提供的功能。

```js
/* panel.js */
define(function(require, exports, module) {
    var Base = require('base');

    var Panel = Base.extend({
        options: {
            color: '#fff',
            size: {
                width: 100,
                height: 100
            }
        },

        initialize: function(id, options) {
            this.srcNode = document.getElementById(id);
            this.setOptions(options);
        },

        show: function() {
            this.trigger('show');
            this.srcNode.style.display = 'block';
            this.trigger('shown');
        }
    });
});
```

在 `initialize` 方法中，调用 `setOptions` 方法，就可以自动设置好实例的 `options` 属性：

```js
/* test.js */
define(function(require, exports, module) {
    var Panel = require('./panel');

    var panel = new Panel('test', {
        color: '#f00',
        size: {
            width: 200
        }
    });

    console.log(panel.options.color); // '#f00'
    console.log(panel.options.size);  // { width: 200, height: 100 }
});
```

使用 `extend` 创建类时，混入的 `Events` 和 `Options` 模块，还可以使得实例化时，直接在
`options` 中通过 `on` 前缀来表示事件回调：

```js
/* test2.js */
define(function(require, exports, module) {
    var Panel = require('./panel');

    var panel = new Panel('test', {
        color: '#f00',
        size: {
            width: 200
        },
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
