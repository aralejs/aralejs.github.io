
Base 是一个基础类，提供 OO、Events 和 Options 支持。

---


## 使用说明


### Class Method: extend

基于 Base 创建子类。


#### 语法：

```js
var MyClass = Base.extend(properties, classProperties);
```


#### 参数：

1. `properties` - 可选，取值如下：
   * (object) 原型属性对象，其属性会被添加到 MyClass.prototype 上。该对象上可以有一些特殊属性，包括
     `Implements` 和 `initialize`.
     * `Implements` - 混入属性，取值如下：
         * (class) 混入类，该类的原型方法会复制到 MyClass 上。
         * (array) 混入类组成的数组，这些混入类的原型方法都会复制到 MyClass 上。
     * `initialize` - 初始化属性，取值如下：
         * (function) 初始化方法，会在 MyClass 实例化时调用。
   * (function) 初始化方法，含义同 `initialize` 属性。
1. `classProperties` - 可选，取值如下：
   * (object) 类属性对象，其属性会直接添加到 MyClass 上。


#### 返回值：

* (class) 创建的新类。


#### 例子：

pig.js:

```js
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

flyable.js:

```js
define(function(require, exports, module) {
    
    function Flyable() {
    }
    
    Flyable.prototype.fly = function() {
        alert('我飞起来了');
    };
    
    module.exports = Flyable;
});
```

flyable-pig.js:

```js
define(function(require, exports, module) {
    var Pig = require('./pig');
    var Flyable = require('./flyable');

    var FlyablePig = Pig.extend({
        Implements: Flyable,
        
        initialize: function(name) {
            this.superclass.initialize.call(this, name);
        }
    });
    
    module.exports = FlyablePig;
});
```

test.js:

```js
define(function(require, exports, module) {
    var FlyablePig = require('./flyable-pig');
    
    var pig = new FlyablePig('飞天红猪侠');
    pig.talk(); // alerts '我是飞天红猪侠'
    pig.fly();  // alerts '我飞起来了'
});
```

---


### Class Method: implement

将传入的对象属性添加到类的原型上。该方法与 `Implements` 属性的功能相同，但如果某个类已存在，
需要动态修改时，用 `implement` 方法会更方便。


#### 语法：

```js
MyClass.implement(properties);
```


#### 参数：

1. `properties` - 取值如下：
   * (object) 该对象的属性会添加到类的原型上。


#### 例子：

pig-extension.js:

```js
define(function(require, exports, module) {
    var Pig = require('./pig');

    Pig.implement({
       swim: function() {
           alert('我会游泳');
       }
    });
});
```



## 参考

- http://mootools.net/docs/core/Class/Class
- http://ryanflorence.com/object-oriented-jquery-with-mootools-pigs-take-flight/
