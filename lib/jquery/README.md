
# jQuery

jQuery 是一个简洁高效的 JavaScript 类库，可用来简化 HTML 文档的遍历、事件处理、动画和
Ajax 操作。jQuery 的设计目的是：改变你编写 JavaScript 代码的方式。

---


## 使用说明

```js
define(function(require, exports) {

    var $ = require('jquery');

    // 快乐使用 $ 吧

});
```

jQuery 官方文档：<http://api.jquery.com/>


## 最佳实践

1. 推荐只把 jQuery 当成工具类库来用，用来简化 DOM、Event、Anim、Ajax 等操作。
2. 禁止直接使用 jQuery 插件，必须提交 Arale 开发团队审核并封装后才能使用。
3. 如果一个组件里，有原生 DOM 元素，也有 jQuery 对象时，推荐 jQuery 对象的变量命名加上 $ 前缀，比如：

```js
    var $srcNode = $(srcNode);
    // 前缀 $ 可以让大家清晰识别出这是一个 jQuery 对象。
```
