
# JSON

为运行环境提供 `JSON` 支持。

---


## 模块依赖

 - [seajs](seajs/README.md)


## 使用说明

在 IE6 等浏览器中，未提供 `JSON` 全局对象。通过该组件，可以补足：

```js
seajs.config({
    alias: {
        'json': 'json/1.0.2/json'
    },
    // 只在需要时进行预加载
    preload: [ this.JSON ? '' : 'json' ]
});


define(function(require, exports) {

    var data = JSON.parse('{ "name": "Frank Wang" }');
    data.age = 80;

    var str = JSON.stringify(data);
    // ==> '{"name":"Frank Wang","age":80}'
});
```

具体用法，请参考 Douglas Crockford 的源码：

- <https://github.com/douglascrockford/JSON-js/blob/master/json2.js>


## 更新

当 JSON 发布新版本，需要更新时，只要运行：

```
$ cd arale/dist
$ spm install json
```
