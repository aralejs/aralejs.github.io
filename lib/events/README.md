
# Events

提供基本的事件添加、移除和触发功能。

---


## 模块依赖

依赖 [seajs](seajs/README.md)


## 使用说明

使用 `Events` 有两种方式，一种是直接实例化：

```js
define(function(require) {
    var Events = require('events');

    var object = new Events();
    object.on('expand', function() {
        alert('expanded');
    });

    object.trigger('expand');
});
```

另一种是将 `Events` 混入（mix-in）到其他类中：

```js
define(function(require) {
    var Class = require('class');
    var Events = require('events');

    var Dog = Class.create({
        Implements: Events,
        sleep: function() {
            this.trigger('sleep');
        }
    });

    var dog = new Dog();
    dog.on('sleep', function() {
        alert('狗狗睡得好香呀');
    });

    dog.sleep();
});
```

此外，使用 `Base.extend` 创建的类，会自动添加上 `Events` 提供的方法：

```js
/* post.js */
define(function(require, exports, module) {
    var Base = require('base');

    var Post = Base.extend({
        initialize: function(title, content) {
            this.title = title;
            this.content = content;
        },

        save: function() {
            // 将内容保存好⋯⋯

            // 然后触发事件：
            this.trigger('saved')
        }
    });

    module.exports = Post;
});
```

```js
/* test.js */
define(function(require, exports, module) {
    var Post = require('./post');

    var post = new Post('岁月如歌', '岁月是一首歌⋯⋯');

    // 监听事件
    post.on('saved', function() {
        alert('保存成功');
    });

    post.save();
});
```

上面的例子已经展现了 `on` 和 `trigger` 的基本用法，下面详细阐述所有用法。


### on `object.on(event, callback, [context])`

给对象添加事件回调函数。

可以传入第三个参数 `context` 来改变回调函数调用时的 `this` 值：

```js
post.on('saved', callback, that);
```

**注意**：`event` 参数有个特殊取值：`all`. 对象上触发任何事件时，都会触发 `all`
事件的回调函数，传给回调函数的第一个参数是事件名。例如，下面的代码可以将一个对象上的所有事件代理到另一个对象上：

```js
proxy.on('all', function(eventName) {
    object.trigger(eventName);
});
```


### off `object.off([event], [callback], [context])`

从对象上移除事件回调函数。三个参数都是可选的，当省略某个参数时，表示取该参数的所有值。例子：

```js
// 移除 change 事件上名为 onChange 的回调函数
object.off('change', onChange);

// 移除 change 事件的所有回调函数
object.off('change');

// 移除所有事件上名为 onChange 的回调函数
object.off(null, onChange);

// 移除上下文为 context 的所有事件的所有回调函数
object.off(null, null, context);

// 移除 object 对象上所有事件的所有回调函数
object.off();
```


### trigger `object.trigger(event, [*args])`

触发一个或多个事件（用空格分隔）。`*args` 参数会依次传给回调函数。


## 测试用例

- <http://aralejs.org/lib/events/tests/runner.html>


## 反馈

觉得好、有建议，或想拍砖、吐槽，都可以创建
[GitHub Issue](https://github.com/alipay/arale/issues/new)
来告诉我们。
