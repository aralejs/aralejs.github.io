
# jQuery

jQuery 是一个简洁高效的 JavaScript 类库，可用来简化 HTML 文档的遍历、事件处理、动画和
Ajax 操作。jQuery 的设计目的是：改变你编写 JavaScript 代码的方式。

---


## 使用说明

```js
seajs.config({
    alias: {
        'jquery': 'jquery/1.7.2/jquery'
    }
});

define(function(require, exports) {

    var $ = require('jquery');

    // 快乐使用 $ 吧

});
```

jQuery 官方文档：<http://api.jquery.com/>


## 最佳实践

1. 推荐只把 jQuery 当成工具类库来用，用来简化 DOM, Event, Anim, Ajax 等操作。
2. 禁止直接使用 jQuery 插件，必须提交 Arale 开发团队审核并封装后才能使用。
3. 推荐 jQuery 对象的变量命名加上 $ 前缀，比如：

```js
    var $ = require('jquery');

    var $tds = $('table td');
    // 前缀 $ 可以让大家清晰识别出这是一个 jQuery 对象。
```


## 更新

当 jQuery 有新版本发布，需要更新时，只需运行以下命令就好：

```
$ node update.js
```
