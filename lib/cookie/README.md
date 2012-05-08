
# Cookie

提供 Cookie 操作方法。

---


## 模块依赖

 - [seajs](seajs/README.md)



## 使用说明

```js
seajs.config({
    alias: {
        'cookie': 'cookie/1.0.2/cookie'
    }
});


define(function(require, exports) {

    var Cookie = require('cookie');

    // setup
    document.cookie = 'foo=1';
    document.cookie = 'bar=2';

    Cookie.get('foo');
    // returns '1'

    Cookie.set('bar', 4, {
        domain: 'example.com',
        path: '/',
        expires: 30
    });

    Cookie.remove('foo');
});
```


## 测试用例

- <http://aralejs.org/lib/cookie/tests/runner.html>


## 交流讨论

欢迎创建
[GitHub Issue](https://github.com/alipay/arale/issues/new)
来提交反馈。
