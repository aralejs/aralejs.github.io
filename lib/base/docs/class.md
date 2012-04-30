
# Class

`Base.Class` 模块，提供了简洁的 OO 实现。

---


## 使用说明


### create `Class.create(properties, [classProperties])`

与 `Base.extend` 类似，用来创建一个新类。不同之处在于，`Class.create`
更基础，可灵活指定继承的父类，以及想混入的原型属性类。看下例子就非常清楚了：

```js
/* flyable-dog.js */
define(function(require, exports, module) {
    var Base = require('base');
    var Class = Base.Class;
    var Events = Base.Events;
    var Animal = require('./animal');
    var Flyable = require('./flyable');

    var FlyableDog = Class.create({
        Extends: Animal,
        Implements: [Events, Flyable],

        initialize: function(name) {
            this.name = name;
        }
    });

    module.exports = FlyableDog;
});
```

`Implements` 和 `initialize` 属性的含义，与 `Base.extend` 中的一致。`Extends`
也是一个特殊属性，用来指定继承的父类，注意只能有一个父类，不支持多继承。

这样就创建了一个 `FlyableDog` 类，继承自 `Animal`, 并具有 `Events` 和 `Flyable` 的方法。


### extend `SomeClass.extend(properties, [classProperties])`

由 `Class.create` 创建的类，也具有 `extend` 方法，功能与 `Base.extend` 完全一样，不多说。


## Base 与 Class 的关系

Base 是使用 `Class` 创建的一个基础类，默认混入了 `Events` 和 `Options` 支持：

```js
/* base.js */
define(function(require) {
    var Class = require('./class');
    var Options = require('./options');
    var Events = require('./events');

    return Class.create({
        Implements: [Options, Events]
    });
});
```
