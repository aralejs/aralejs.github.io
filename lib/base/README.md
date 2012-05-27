
# Base

Base 是一个基础类，提供 Class、Events、Attrs 和 Options 支持。

---


## 模块依赖

 - [seajs](seajs/README.md)
 - [class](class/README.md)
 - [events](events/README.md)


## 使用说明


### extend `Base.extend(properties)`

基于 Base 创建子类。例子：

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

具体用法请参考：[Class 使用文档](class/README.md)


### Base 与 Class 的关系

Base 是使用 `Class` 创建的一个基础类，默认混入了 `Events` 和 `Options` 支持：

```js
/* base.js */
define(function(require) {

    var Class = require('class');
    var Events = require('events');
    var Attrs = require('attrs');
    var Options = require('./options');

    return Class.create({
        Implements: [Events, Attrs, Options],

        initialize: function(config) {
            ...
        },

        ...
    });

});
```

具体用法请参考：

- [Events 使用文档](events/README.md)
- [Attrs 使用文档](base/docs/attrs.md)
- [Options 使用文档](base/docs/options.md)


## 测试用例

- <http://aralejs.org/lib/base/tests/runner.html>


## 交流讨论

欢迎创建
[GitHub Issue](https://github.com/alipay/arale/issues/new)
来提交反馈。

已有议题：

- [Base 中默认混入 Events/Options 等是否合适](https://github.com/alipay/arale/issues/24)
