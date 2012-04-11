
## 概要

jQuery is a fast and concise JavaScript Library that simplifies HTML document
traversing, event handling, animating, and Ajax interactions for rapid web
development. jQuery is designed to change the way that you write JavaScript.


## 使用说明

````javascript
seajs.config({
  alias: {
    'jquery': 'jquery/1.7.2/jquery'
  }
});

define(function(require, exports) {

  var $ = require('jquery');

  // 快乐使用 $ 吧

});
````

API 文档：http://api.jquery.com/


## 最佳实践

1. 推荐使用 jQuery 来进行 DOM 相关的操作，包括 Event, Ajax, Anim 等等。
2. 禁止直接使用 jQuery 插件，必须提交 Arale 开发团队审核并封装后才能使用。
3. 推荐 jQuery 对象的变量命名加上 $ 前缀，比如：

````javascript
  var $ = require('jquery');

  var $tds = $('table td');
  // 前缀 $ 可以让大家清晰识别出这是一个 jQuery 对象。
````


## 更新方式

````
$ node update.js
````
