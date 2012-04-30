
# 竞争对手分析

感谢所有老前辈们，感谢所有同类代码。因为有了你们，世界才丰富多采。

---


## 这是一个经典话题


### Douglas Crockford 的尝试与悟道

关于类继承，Douglas 有一篇经典文章：

- [Classical Inheritance in JavaScript](http://javascript.crockford.com/inheritance.html)

这篇文章里，老道分析了为什么要在 JavaScript 里模拟类继承，最主要的目的是复用。老道的实现方式是给
`Function.prototype` 增加 `method` 和 `inherits` 两个方法，并提供了 `uber` 语法糖。

悲催的是，大神实现的 `inherits` 和 `uber` 存在不少缺陷，国内和国外都有不少人剖析过，可以参考
2008 年时的一篇讨论帖子：

- [Crockford uber 方法中的陷阱](http://www.iteye.com/topic/248933)

老道最后悟出了一段经常被引用的话：

> 我写 JavaScript 的年头已经 8 年了，我从来没有一次发现需要使用 `uber` 方法。对类继承模式来说，`uber`
很重要，但在原型和函数式的模式里，`uber` 没有必要。现在看来，我早年想在 JavaScript
中实现类继承模式的尝试是错误的。

由此，老道又写了一篇经典文章，推崇在 JavaScript 里，直接使用原型继承：

- [Prototypal Inheritance in JavaScript](http://javascript.crockford.com/prototypal.html)

继续悲催的是，老道的实现，又成了纯学术研究。前端界的另一位大神发了一篇很直白的博文：

- [Debunking object\(\)](http://www.nczonline.net/blog/2006/10/14/debunking-object/)

老道的代码虽然存在不少缺陷，但老道的尝试和对原型继承的呼吁依旧非常值得我们尊敬和思考。

JavaScript 语言虽然原生不支持类继承，但并不意味着，让大家都去理解原型继承并用原型继承的方式去写代码是最好的选择。世界的进步在于人类的不满足。作为前端的我们，只是想用更简单更舒适的方式来书写代码。JavaScript
新的语言规范里，已经提出了 `class` 概念，在规范确定和浏览器原生支持前，我们还得继续探索。


### Dean Edwards 的 Base.js

这是前端界的另一位老前辈。老前辈做过一个当时很著名的 JavaScript 类库：
Base.js. 其中有一套非常不错的 OO 实现：

- [A Base Class for JavaScript Inheritance](http://dean.edwards.name/weblog/2006/03/base/)




## 我们的选择
