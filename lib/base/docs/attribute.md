
# Attribute

提供基本的属性添加、获取、移除等功能。

---


## 模块依赖

 - [seajs](seajs/README.md)


## 使用说明

使用 `Attribute` 有两种方式，一种是直接实例化：

```js
define(function(require) {
    var Attribute = require('attribute');

    var object = new Attribute();
    object.set('title', 'Arale 2.0');
    object.get('title');
});
```

另一种是将 `Attribute` 混入（mix-in）到其他类中：

```js
define(function(require) {
    var Class = require('class');
    var Attribute = require('attribute');

    var Dog = Class.create({
        Implements: [Attribute],

        attributes: {
            name: {
                value: ''
            },
            age: {
                value: 1,
                validator: function(val) {
                    return typeof val === 'number';
                }
            }
        }
    });

    var dog = new Dog({ name: '旺财' });
    dog.get('name'); // ==> '旺财'
    dog.get('age'); // ==> 1
    dog.set('age', 2);
    dog.get('age'); // ==> 2
});
```

上面的例子已经展现了 `get`, `set` 等方法的基本用法，下面详细阐述所有 API.


### get `object.get(key)`

给对象添加事件回调函数。

可以传入第三个参数 `context` 来改变回调函数调用时的 `this` 值：

```js
post.on('saved', callback, that);
```

**注意**：`event` 参数有个特殊取值：`all`. 对象上触发任何事件，都会触发 `all`
事件的回调函数，传给 `all` 事件回调函数的第一个参数是事件名。例如，下面的代码可以将一个对象上的所有事件代理到另一个对象上：

```js
proxy.on('all', function(eventName) {
    object.trigger(eventName);
});
```


### set `object.set(key, value, options)`

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


### clear `object.clear()`

触发一个或多个事件（用空格分隔）。`*args` 参数会依次传给回调函数。


**注意**：`on` 和 `off` 的 `event` 参数也可以表示多个事件（用空格分隔），比如：

```js
var obj = new Events();

obj.on('x y', fn);

// 等价：
obj.on('x').on('y');
```


### mixTo `Attribute.mixTo(receiver)`

将 `Attribute` 的原型方法混入到指定对象或函数原型中。


## 测试用例

- <http://aralejs.org/lib/attribute/tests/runner.html>


## 交流讨论

欢迎创建
[GitHub Issue](https://github.com/alipay/arale/issues/new)
来提交反馈。
