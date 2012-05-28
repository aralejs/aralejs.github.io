
# iframe-shim

工具类，在 IE6 下生成 iframe 遮挡 select 和 object。此组件对开发者透明，开发者无需再判断浏览器版本。

---


## 模块依赖

* [seajs](../seajs/README.md)
* [jquery](../jquery/README.md)
* [position](../position/README.md)


## 使用说明


### `new Shim(target)`

实例化对象，实例化后会生成一个 iframe 插入到 body 中。需要手动调用 `sync` 方法同步。

如果是 ie6 以外的浏览器只会返回一个空实例，什么都不执行。

参数 `target` 是需要被遮挡的目标元素，可以传 `DOM Element` 或 `Selector`。


```js
define(function(require, exports, module) {
	var Shim = require('iframe-shim');
	
	var shim = new Shim('#target');
	shim.sync();
});
```

**注意：**

* 目标元素需要设置 z-index，不然无法保证 iframe 的层级。
* iframe 计算的宽高包括 border，例如 width 为 100px，border 为 1px，iframe 的 width 为 102px。
* iframe 会自动插入到 body 中，建议在 domready 后使用。


### sync `shim.sync()`

实例方法，此方法会根据目标元素的变化而改变 iframe 的样式。

有以下几种情况 iframe 会改变：

1. 目标元素的宽高及 border 改变后 iframe 的宽高也会相应改变。
1. 目标元素或父级元素 `display: none`，iframe 会隐藏。
1. 目标元素宽和高等于 0 （包括 border ），iframe 会隐藏。
1. 目标元素移动后 iframe 定位会改变。

sync 可进行链式操作，上面的例子可直接一行完成：

```js
var shim = new Shim('#target').sync();
```

**注意：**

* 如果目标元素有变化，需要同步 shim 时，需要在目标元素变化之后，再调用 `sync` 方法：

```js
target.show();
shim.sync(); // 在 target 显示之后，再同步 shim 的显示。
```


### destroy `shim.destroy()`

实例方法，销毁 iframe 等。


## 演示页面

在 ie6 下访问 [examples/iframe-shim.html](http://aralejs.org/lib/iframe-shim/examples/iframe-shim.html)


## 测试用例

* <http://aralejs.org/lib/iframe-shim/tests/runner.html>


## 交流讨论

欢迎创建
[GitHub Issue](https://github.com/alipay/arale/issues/new)
来提交反馈。
