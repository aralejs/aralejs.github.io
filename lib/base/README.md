
# Base

Base 是一个基础类，提供 Class, Events 和 Options 支持。

---


## 模块依赖

依赖 [seajs](seajs/README.md)


## 使用说明

基于 Base,


### extend `Base.extend(properties)`

使用 `extend` 方法，可以很方便地创建具有 Events 和 Options 功能的新类。来看例子：

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

具体请参考：[Class 使用文档](base/docs/class.md)。


### 更多细节

`Base.extend` 是基本使用方法，`Base` 还提供了 Class、Events 和 Options 模块。去喝杯茶吧，休息一下，回来后继续阅读：

- [Events 使用文档](base/docs/events.md)
- [Options 使用文档](base/docs/options.md)


还有一个很精彩的：

- [竞争对手分析](base/docs/competitors.md)


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


## 测试用例

- <http://aralejs.org/lib/base/tests/runner.html>


## 反馈

觉得好、有建议，或想拍砖、吐槽，都可以创建
[GitHub Issue](https://github.com/alipay/arale/issues/new)
来告诉我们。
