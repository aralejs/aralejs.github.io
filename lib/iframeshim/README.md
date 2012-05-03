# iframe shim

工具类，在IE6/7下生成空iframe遮挡select和object。此组件对开发者透明，开发者无需再判断浏览器。

---

## 使用说明

### shim(element)

此方法会根据dom生成一个和dom等宽等高无偏移的iframe，此iframe垫在dom底部。

此方法是一个工厂方法，每次都会生成一个实例，所以如有多个浮层使用遮罩不会互相影响。

`element` 可为 `Element` 或 `$(Element)`。

```
define(function(require, exports, module) {
	var shim = require('iframeshim'),
		$ = require('jquery');
	
	shim($('iframe-shim-dom'));
});
```

### show `shim.show()`

实例方法，显示iframe。

### hide `shim.hide()`

实例方法，隐藏iframe。

### sync `shim.sync()`

实例方法，重新计算iframe的宽高和定位。