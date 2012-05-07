
# Class

提供简洁的 OO 实现。

---


## 模块依赖

依赖 [seajs](seajs/README.md)


## 使用说明


### create `Class.create([parent], [properties])`

创建一个新类。参数 `parent` 是继承的父类，`properties` 是要混入的实例属性。

来看一个简单的例子：

```js
/* pig.js */
define(function(require, exports, module) {
    var Class = require('class');

    var Pig = Class.create({
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

`initialize` 属性，标明初始化方法，会在构建实例时调用。

使用 `create` 方法创建的类，拥有 `extend` 方法，可以继续创建子类：

```js
/* red-pig.js */
define(function(require, exports, module) {
    var Pig = require('./pig');

    var RedPig = Pig.extend({
        initialize: function(name) {
            RedPig.superclass.initialize.call(this, name);
        },

        color: '红色'
    });

    module.exports = RedPig;
});
```

**注意**：需要在子类方法中，调用父类中的同名方法时，JavaScript 语言自身并没有提供类似 `super`
的方式来轻松实现。用 `create` 或 `extend` 方法创建类时，可以使用 `superclass.methodName`
来显式调用父类方法。之所以不提供 `super` 方法，原因有二：

1. 实现起来较麻烦。现有类库的实现方案，都不完美。
2. 在 JavaScript 编程中，调用 `super` 的需求并不多。简单通过 `superclass.methodName`
来调用已经能够满足需求，并很灵活、清晰。

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
            FlyableRedPig.superclass.initialize.call(this, name);
        }
    });

    module.exports = FlyableRedPig;
});
```

**注意**：`Implements` 采用首字母大写，是因为小写的 `implements` 是 JavaScript
保留字。大写也表示其特殊性，与 MooTools 的方式一致。

除了 `Implements`, 还有两个特殊属性：

1. `Extends` - 用来指定继承的父类，注意只能有一个父类，不支持多继承。
1. `Statics` - 用来指定需要混入的静态属性。


### implement `SomeClass.implement(properties)`

该方法与 `Implements` 属性的功能类似。当某个类已存在，需要动态修改时，用 `implement`
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


### extend `SomeClass.extend(properties)`

由 `Class.create` 创建的类，自动具有 `extend` 方法，功能与 `Class.create`
完全一样，只是继承的父类是 `SomeClass` 自身，前面的例子中已说明，不赘述。


### Class `Class(fn)`

将已经存在的 function 函数转换为 Class 类：

```js
function Animal() {
}
Animal.prototype.talk = function() {};

var Dog = Class(Animal).extend({
    swim: function() {}
});
```


## 测试用例

- <http://aralejs.org/lib/class/tests/runner.html>


## 性能对比

- <http://jsperf.com/class-perfs>


## 调研文档

- [OO 模拟那些事儿](base/docs/competitors.md)
- [类与模块](base/docs/meta.md)


## 交流讨论

欢迎创建
[GitHub Issue](https://github.com/alipay/arale/issues/new)
来提交反馈。
