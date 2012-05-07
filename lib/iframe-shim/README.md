# iframe-shim

工具类，在IE6下生成空iframe遮挡select和object。此组件对开发者透明，开发者无需再判断浏览器版本。

---

## 使用说明

### shim(element)

此方法会根据目标元素生成一个和目标元素等宽等高无偏移的iframe，此iframe的高度比目标元素低。

此方法是一个工厂方法，每次都会生成一个实例，所以如有多个浮层使用遮罩不会互相影响。

`element` 为 `DOM Element`。


```
define(function(require, exports, module) {
	var shim = require('iframe-shim'),
		$ = require('jquery');
	
	shim($('iframe-shim-dom')[0]);
});
```

**注意**

* 目标元素需要设置z-index，不然无法保证iframe的高度
* iframe计算的宽高包括border，例如width为100px，border为1px，iframe的width为102px。

### show `shim.show()`

实例方法，显示iframe。

### hide `shim.hide()`

实例方法，隐藏iframe。

### sync `shim.sync()`

实例方法，重新计算iframe的宽高和定位。

## demo

在ie6下访问[demo](http://aralejs.org/lib/iframe-shim/examples/iframe-shim.htm)
