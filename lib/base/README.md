
## 概要

Base 是一个基础类，提供 OO、Events 和 Options 支持。



## 使用说明


### extend `extend(properties, [classProperties])`

使用 `extend` 方法，可以基于 `Base` 类来创建自己的类。参数 `properties`
是实例属性，`classProperties` 则指明静态属性，会直接添加到类上。

来看一个简单的例子：

```
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

    module.exports = Dog;
});
```

`properties` 的 `initialize` 属性，标明实例的初始化方法，会在构建实例时被调用。

使用 `extend` 方法创建的类，也拥有 `extend` 方法，可以继续创建子类：

```
/* red-pig.js */
define(function(require, exports, module) {
    var Pig = require('./pig');

    var RedPig = Pig.extend({
        initialize: function(name) {
            this.superclass.initialize.call(this, name);
        },

        color: '红色'
    });

    module.exports = RedPig;
});
```

需要在子类方法中，调用同名父类方法时，JavaScript 语言自身没有提供类似 `super`
的方式来轻松实现。用 `extend` 方法来扩展类时，可以通过 `this.superclass.methodName`
来显式调用父类上的方法。

**注意**：之所以不提供 `super` 方法，原因有二：一是实现起来很麻烦。现有类库的实现方案，都不完美。二是因为在
JavaScript 编程中，调用 `super` 的需求并不多。简单地通过 `this.superclass`
来实现已经够用，并足够灵活、清晰。

`properties` 参数中，除了支持用 `initialize` 来标明初始化方法，还可以用 `Implements`
来标明所创建的类需要从哪些类中混入原型属性。来看例子：

```js
/* flyable.js */
define(function(require, exports, module) {
    function Flyable() {
    }

    Flyable.prototype.fly = function() {
        alert('我飞起来了');
    };

    module.exports = Flyable;
});
```

```
/* flyable-red-pig.js */
define(function(require, exports, module) {
    var RedPig = require('./red-pig');
    var Flyable = require('./flyable');

    var FlyableRedPig = RedPig.extend({
        Implements: Flyable,

        initialize: function(name) {
            this.superclass.initialize.call(this, name);
        }
    });

    module.exports = FlyableRedPig;
});
```


### implement `implement(properties)`

该方法与 `Implements` 属性的功能类似，但如果某个类已存在，需要动态修改时，用 `implement`
方法会更便捷。


```
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

最后，我们得到了会说话、会飞、还会游泳的飞天红猪侠：

```
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


## 参考

- http://mootools.net/docs/core/Class/Class
- http://ryanflorence.com/object-oriented-jquery-with-mootools-pigs-take-flight/
