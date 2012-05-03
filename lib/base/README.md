
# Base

Base 是一个基础类，提供 Class、Events 和 Options 支持。

---


## 模块依赖

依赖 [seajs](seajs/README.md)


## 使用说明


### extend `Base.extend(properties, [classProperties])`

使用 `extend` 方法，可以基于 `Base` 类来创建自己的类。参数 `properties`
是实例属性，`classProperties` 是静态属性，会直接添加到类上。

来看一个简单的例子：

```js
/* pig.js */
define(function(require, exports, module) {
    var Base = require('base');

    var Pig = Base.extend({
        initialize: function(name) {
            this.name = name;
        },

        talk: function() {
            alert('我是' + this.name);
        }
    });

    module.exports = Pig;
});
```

`initialize` 属性，标明实例的初始化方法，会在构建实例时调用。

使用 `extend` 方法创建的类，也拥有 `extend` 方法，可以继续创建子类：

```js
/* red-pig.js */
define(function(require, exports, module) {
    var Pig = require('./pig');

    var RedPig = Pig.extend({
        initialize: function(name) {
            Pig.prototype.initialize.call(this, name);
        },

        color: '红色'
    });

    module.exports = RedPig;
});
```

**注意**：需要在子类方法中，调用父类中的同名方法时，JavaScript 语言自身并没有提供类似 `super`
的方式来轻松实现。用 `extend` 方法来创建类时，可以使用 `Pig.prototype.methodName`
来显式调用父类方法。之所以不提供 `super` 方法，原因有二：

1. 实现起来很麻烦。现有类库的实现方案，都不完美。
2. 在 JavaScript 编程中，调用 `super` 的需求并不多。简单地通过 `SuperClass.prototype`
来调用已经够用，并很灵活、清晰。

`properties` 参数中，除了支持用 `initialize` 来标明初始化方法，还可以用 `Implements`
来标明所创建的类需要从哪些类中混入属性：

```js
/* flyable.js */
define(function(require, exports, module) {
    exports.fly = function() {
        alert('我飞起来了');
    };
});
```

```js
/* flyable-red-pig.js */
define(function(require, exports, module) {
    var RedPig = require('./red-pig');
    var Flyable = require('./flyable');

    var FlyableRedPig = RedPig.extend({
        Implements: Flyable,

        initialize: function(name) {
            RedPig.prototype.initialize.call(this, name);
        }
    });

    module.exports = FlyableRedPig;
});
```

**注意**：`Implements` 采用首字母大写，是因为小写的 `implements` 是 JavaScript
保留字。大写也表示其特殊性，与 MooTools 的方式一致。


### implement `SomeClass.implement(properties)`

该方法与 `Implements` 属性的功能相同。当某个类已存在，需要动态修改时，用 `implement`
方法更便捷。


```js
/* flyable-red-pig-extension.js */
define(function(require, exports, module) {
    var FlyableRedPig = require('./flyable-red-pig');

    FlyableRedPig.implement({
       swim: function() {
           alert('我还会游泳');
       }
    });
});
```

这样，我们得到了会说话、会飞、还会游泳的飞天红猪侠：

```js
/* test.js */
define(function(require, exports, module) {
    var FlyableRedPig = require('./flyable-red-pig');
    require('./flyable-red-pig-extension');

    var pig = new FlyableRedPig('飞天红猪侠');
    pig.talk(); // alerts '我是飞天红猪侠'
    pig.fly();  // alerts '我飞起来了'
    pig.swim(); // alerts '我还会游泳'
});
```


以上是基本使用方法，`Base` 还提供了 Class、Events 和 Options 模块。去喝杯茶吧，休息一下，回来后继续阅读：

- [Events 使用文档](base/docs/events.md)
- [Options 使用文档](base/docs/options.md)
- [Class 使用文档](base/docs/class.md)
- [类与模块](base/docs/meta.md)

还有一个很精彩的：

- [竞争对手分析](base/docs/competitors.md)


## 演示页面

- [examples/base.html](http://alipay.github.com/arale/lib/base/examples/base.html)


## 测试用例

- <http://aralejs.org/lib/base/tests/runner.html>


## 反馈

觉得好、有建议，或想拍砖、吐槽，都可以创建
[GitHub Issue](https://github.com/alipay/arale/issues/new)
来告诉我们。
