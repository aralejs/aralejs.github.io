
# Cookie

提供 Cookie 操作方法。

---


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

官方文档：https://github.com/seajs/dew/tree/master/src/cookie


## 更新

当 cookie 组件有新版本发布，需要更新时，只需运行以下命令就好：

```
$ node update.js
```
