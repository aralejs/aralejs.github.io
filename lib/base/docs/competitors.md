
# Base 模块之竞争对手分析

感谢所有老前辈们，感谢所有同类代码。因为有了你们，世界才丰富多采。

---


## OO 模拟那些事儿


### Douglas Crockford 的尝试与悟道

关于类继承，Douglas 有一篇经典文章：

- [Classical Inheritance in JavaScript](http://javascript.crockford.com/inheritance.html)

这篇文章里，老道分析了为什么要在 JavaScript 里模拟类继承：主要目的是复用。老道的实现方式是给
`Function.prototype` 增加 `method` 和 `inherits` 两个方法，并提供了 `uber` 语法糖。

悲催的是，大神实现的 `inherits` 和 `uber` 存在不少缺陷，国内和国外都有不少人剖析过，可以参考
2008 年时的一篇讨论帖子：

- [Crockford uber 方法中的陷阱](http://www.iteye.com/topic/248933)

老道最后悟出了一段经常被引用的话：

> 我编写 JavaScript 已经 8 个年头了，从来没有一次觉得需要使用 uber 方法。在类模式中，super
的概念相当重要；但是在原型和函数式模式中，super 的概念看起来是不必要的。现在回顾起来，我早期在
JavaScript 中支持类模型的尝试是一个错误。

由此，老道又写了一篇经典文章，推崇在 JavaScript 里，直接使用原型继承：

- [Prototypal Inheritance in JavaScript](http://javascript.crockford.com/prototypal.html)

继续悲催的是，老道的实现，依旧有不足之处。可以参考两篇博文：

- [Debunking object\(\)](http://www.nczonline.net/blog/2006/10/14/debunking-object/)
- [Javascript – How Prototypal Inheritance really works](http://blog.vjeux.com/2011/javascript/how-prototypal-inheritance-really-works.html)

老道的代码虽然不尽完美，但老道的尝试和对原型继承的呼吁依旧非常值得我们尊敬和思考。

研究到此，如果大家都能理解原型继承，问题其实已经终结，特别是在 webkit 等支持 `__proto__` 的运行环境下。比如：

```js
function Animal() {}
function Dog() {}

// 要让 Dog 继承 Animal, 只需：
Dog.prototype.__proto__ == Animal.prototype;

// 实例化后
var dog = new Dog();
// dog.__proto__ 指向 Dog.prototype
// dog.__proto__.__proto__ 指向 Animal.prototype
// 原型链已成功建立起来，而且很清晰
```

老道的 `inherits` 和 NCZ 的 `inherit` 本质上都是设置好 `__proto__`
属性。看清楚这一点，一切都很简单。

原型继承的确已经够用，但这需要大家都能理解原型继承的原理，对 `__proto__`, `prototype` 和 `new`
等有清晰的认识。通过 `inherits` 等方法，可以简化部分细节。但用户在使用时，依旧需要面对
`prototype` 等属性，并且很容易写出有隐患的代码，比如：

```js
function Animal() {}
function Dog() {}

util.inherits(Dog, Animal);

Dog.prototype = {
  talk: function() {},
  run: function() {}
};
```

上面的代码，你知道问题在哪吗？请继续阅读。


### YUI 之路

YUI 团队是 Douglas 的铁杆粉丝团。从 YUI2 到 YUI3, 都高度贯彻了 Douglas 的精神。在 YUI
里，提供了 `extend` 方法：

```js
function Animal() {}
function Dog() {}

Y.extend(Dog, Animal, {
    talk: fn,
    run: fn
});
```

YUI 还提供了 `augment`, `mix` 等方法来混入原型和静态方法。理论上足够用了，但对普通使用者来说，依旧存在陷阱：

```js
function Animal() {}
function Dog() {}

Y.extend(Dog, Animal);

Dog.prototype = {
    talk: fn,
    run: fn
};

var dog = new Dog();
alert(dog instanceof Dog); // false
```

上面的写法，破坏了 `Dog.prototype.constructor`, 导致 `instanceof` 不能正常工作。正确的写法是：

```js
Dog.prototype = {
    constructor: Dog,
    talk: fn,
    run: fn
};
```

或

```js
Dog.prototype.talk = fn;
Dog.prototype.run = fn;
```

通过 `extend` 等方式来实现原型继承，写法上很灵活。`constructor` 是个不小不大的问题，
但对于类库来说，任何小问题，都有可能成为大问题。

`extend` 的方式，仅仅是对 JavaScript 语言中原型继承的简单封装，需要有一定 JavaScript
编程经验后才能娴熟使用。（我个人其实蛮喜欢简简单单的 `extend`）。

此外，`extend` 的灵活性也是一种“伤害”。定义一个类时，我们更希望能有一种比较固定的书写模式，
什么东西写在什么地方，都能更简单，更一目了然。

JavaScript 是一门大众语言，在类继承模式当道的今天，直接让用户去面对灵活的原型继承，未必是最好的选择。

世界的进步在于人类的不满足。作为前端的我们，只是想用更简单更舒适的方式来书写代码。JavaScript
新的语言规范里，已经提出了 `class` 概念。但在规范确定和浏览器原生支持前，故事还得继续。

**注**：YUI3 里，除了 `extend` 方式，也提供了 `Base.create`
来创建新类，但是该方法比较重量级了，用起来不轻便。


### Dean Edwards 的 Base.js

Dean Edwards 是前端界的一位老前辈。老前辈做过一个当时很著名的 JavaScript 类库：
Base.js, 其中有一套非常不错的 OO 实现：

- [A Base Class for JavaScript Inheritance](http://dean.edwards.name/weblog/2006/03/base/)

这个方案开辟了一条阳光大道：通过精心构造的 `Base` 基类来实现类继承。同一时期，JavaScript
界 OO 模拟蔚然成风，万马奔腾。让我们继续考考古。


### Prototype 的 Class

作为一名前端，如果没用过 Prototype, 那么恭喜你，说明你还年轻，潜力无限。来看一名老前端的吐槽：

- [Prototype 1.6 的超级符咒](http://hax.iteye.com/blog/167131)

Prototype 目前已经 v1.7 了。从官方文档来看，Class 继承已经很成熟：

- [Defining classes and inheritance](http://prototypejs.org/learn/class-inheritance)

`Class.create` 的写法已经比较优美。然而悲催的是，`$super` 的约定真让人无语。`super`
虽然很难实现，但也不要这样实现呀：代码一压缩就都浮云了。


### John Resig 的实现

jQuery 专注于 DOM 操作，因此无论现在还是以后，应该都不会去模拟类继承。但在风云变幻的年代里，jQuery
作者 John Resig 也忍不住掺合一脚：

- [Simple JavaScript Inheritance](http://ejohn.org/blog/simple-javascript-inheritance/)

与 Base2 和 Prototype 相比，John Resig 的实现无疑更漂亮。`_super`
的实现方案也简单有效，不过在 JavaScript 实现原生的 `class` 之前，所有 `super`
方案都很难完美。比如：

```js
var Animal = Class.extend({
    talk: function() {
        alert('I am talking.');
    },
    sleep: function() {
        alert('I am sleeping.')
    }
});

var Dog = Animal.extend({
    talk: function() {
        this._super();
    }
});

// 在另一个文件里，扩展 Dog 对象：
Dog.prototype.sleep = function() {
    this._super(); // 会报错
};
```

很明显，要使用 `_super`, 必须严格按照固定模式来写。面对灵活的 JavaScript, 所有 `super`
都是美丽的谎言。


### MooTools Class

MooTools 的全称是 My OO Tools, 因此其 OO 模拟必然得出类拔萃，否则愧对名字。来看文档：

- [Class](http://mootools.net/docs/core/Class/Class)

`new Class` 的方式很优美，`Extends` 和 `Implements` 的首字母大写，是为了避免与 JavaScript
的保留字冲突，看习惯了也觉得挺好。

`Class` 和所创建的类上，也都有 `extend` 方法，可以认为是 John Resig 版本的增强版。

`super` 语法糖，MooTools 采用了 `this.parent()` 的形式。原理与 John Resig
的差不多，都是采用 `wrap` 的方式，但 MooTools 利用了非标准属性 `caller` 来实现。

所有 `wrap` 的实现方式，都要求使用者彻底忘记 `prototype`. 以下代码在 MooTools 里也会出问题：

```js
Dog.prototype.sleep = function() {
    this.parent(); // 会报错
};
```

在 MooTools 里，需要这样写：

```js
Dog.implement({
    sleep: function() {
        this.parent();
    }
});
```


### 还有很多很多

JavaScript 的世界里，OO 的实现还有很多很多，比较有名气的还有：

- [Joose](http://joose.it/)
- [JS Class](http://jsclass.jcoglan.com/inheritance.html)
- [Dojo](http://dojotoolkit.org/reference-guide/1.7/dojo/declare.html#dojo-declare)
- [Klass](https://github.com/ded/klass)
- [Backbone.Model.extend](http://documentcloud.github.com/backbone/#Model-extend)

还有一个很有意思的、崇尚组合的：[Traits.js](http://soft.vub.ac.be/~tvcutsem/traitsjs/)

实现方式上都大同小异，有兴趣的可以逐一看看。

写文档比写代码还累呀，终于快接近尾声了 —— 最重要的尾声部分。如果你在家里的话，强烈建议去洗把冷水脸，清爽一下后再来看。


## 我们的选择

Arale 2.0 的核心原则是 KISS：

1. 如无必要，勿增实体 —— 简称 Simple 原则。
2. 一目了然，容易学习 —— 简称 Stupid 原则。

这两个原则是我们选择的权衡点。从 Simple 原则出发，`Y.extend` 就很好了。但从 Stupid
的原则考虑，明显 `Class.create` 的形式更一目了然，同时在功能上也具有 `Y.extend` 的简洁适用性。

权衡考虑后，我们选择 `Class.create`, 一些细节考虑如下：

1. 主要 API 与 MooTools 保持一致，但不用 `new Class`, 而用 `Class.create` 和 `SomeClass.extend`。
1. `Implements` 接收的参数就是普通对象，与 `implement` 方法保持一致。MooTools 中 `Implements` 属性需要是类。
1. 去除 `this.parent()` 语法糖，需要调用时，和 Backbone 类似，推荐直接使用 `SuperClass.prototype.methodName` 来调用。
1. 借鉴 `Y.Base` 和 `Backbone.Model`, 提供 `Base` 基类，默认集成 `Events` 和 `Options` 功能。
1. `Events` 的 API 与 jQuery 保持一致，这与 `Backbone.Events` 也是一样的。
1. `Options` 的想法来自 MooTools 的 Class.Extra, 很简洁方便。对构建组件非常有帮助。


最后形式的 API 文档请阅读：

- [Base 使用文档](../README.md)

欢迎交流反馈。
