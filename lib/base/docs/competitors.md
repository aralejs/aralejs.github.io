
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

通过 `extend` 等方式来实现原型继承，写法上很灵活。`constructor` 虽然是个不小不大的问题，
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

这是前端界的另一位老前辈。老前辈做过一个当时很著名的 JavaScript 类库：
Base.js. 其中有一套非常不错的 OO 实现：

- [A Base Class for JavaScript Inheritance](http://dean.edwards.name/weblog/2006/03/base/)




## 我们的选择
