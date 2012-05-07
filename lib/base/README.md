
# Base

Base 是一个基础类，提供 Class, Events 和 Options 支持。

---


## 模块依赖

依赖 [seajs](seajs/README.md), [class](class/README.md), [events](events/README.md)


## 使用说明

基于 Base,


### extend `Base.extend(properties)`

使用 `extend` 方法，可以很方便地创建具有 Events 和 Options 功能的新类。例子：

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

具体请参考：[Class 使用文档](class/README.md)。


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

去喝杯茶吧，休息一下，回来后继续阅读：

- [Events 使用文档](events/README.md)
- [Options 使用文档](docs/options.md)


## 测试用例

- <http://aralejs.org/lib/base/tests/runner.html>


## 交流讨论

欢迎创建
[GitHub Issue](https://github.com/alipay/arale/issues/new)
来提交反馈。
