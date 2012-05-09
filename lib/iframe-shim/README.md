# iframe-shim

工具类，在 IE6 下生成 iframe 遮挡 select 和 object。此组件对开发者透明，开发者无需再判断浏览器版本。

---

## 模块依赖

* seajs
* jquery
* position

## 使用说明

### new Shim(target)

此方法会根据目标元素生成一个和目标元素等宽等高无偏移的 iframe，此 iframe 的高度比目标元素低。

此方法是一个工厂方法，每次都会生成一个实例，所以如有多个浮层使用遮罩不会互相影响。

target 可为 `Dom Element` 或 `Selector`。


```
define(function(require, exports, module) {
	var Shim = require('iframe-shim'),
		$ = require('jquery');
	
	new Shim($('iframe-shim-target')[0]);
});
```

**注意**

* 目标元素需要设置 z-index，不然无法保证 iframe 的高度
* iframe 计算的宽高包括 border，例如 width 为100px，border 为1px，iframe 的 width 为102px。
* iframe会插入到 body 中，建议在 domready 后使用


### sync `shim.sync()`

实例方法，此方法会根据目标元素的变化而改变iframe

有以下几种情况 iframe 会改变

* 宽高及 border 改变后 iframe 会相应改变。 
* 目标元素或父级元素 display:none 会隐藏
* 宽和高等于0(包括 border )会隐藏
* 目标元素移动后 iframe 定位会改变

### destroy `shim.sync()`

实例方法，销毁 iframe

## 演示页面

在 ie6 下访问 [demo](http://aralejs.org/lib/iframe-shim/examples/iframe-shim.htm)

## 测试用例

* [http://aralejs.org/lib/iframe-shim/tests/runner.html](http://aralejs.org/lib/iframe-shim/tests/runner.html)
