
# Attrs

提供基本的属性添加、获取、移除等功能。

---


## 使用说明

基于 `Base.extend` 创建的类，会自动添加上 `Attrs` 提供的功能。例子：

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

在 `initialize` 方法中，调用 `setOptions` 方法，就可以自动设置好实例的 `options` 属性。

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

使用 `extend` 创建类时，如果混入了 `Events` 模块，还可以在
`options` 中通过 `change` 等事件来监听属性变化：

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


返回 [Base 使用文档](../README.md)
