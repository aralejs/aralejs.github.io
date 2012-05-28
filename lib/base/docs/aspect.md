
# Aspect

使用 Aspect，可以允许你在指定方法执行的前后插入特定函数。

---


## 使用说明

基于 `Base.extend` 创建的类，会自动添加上 `Aspect` 提供的功能。


### before `object.before(methodName, callback, [context])`

在 `object[methodName]` 方法执行前，先执行 `callback` 函数。

```js
var Dialog = Base.extend({
    ...

    show: function() {
        console.log(2);
        this.element.show();
    },

    ...
});

var a = new Dialog({ ... });

a.before('show', function() {
    console.log(1);
});

a.after('show', function() {
    console.log(3);
});

a.show(); // ==> 1, 2, 3
```

`callback` 函数在执行时，接收的参数与传给 `object[methodName]` 参数相同。如果传入了
`context` 参数，则 `callback` 里的 `this` 指向 `context`。

**注**：目前不支持用 `return false` 来停止往下执行。


### after `object.after(methodName, callback, [context])`

在 `object[methodName]` 方法执行后，再执行 `callback` 函数。

`callback` 函数在执行时，接收的参数是 `object[methodName]` 执行完成后的返回值。如果传入了
`context` 参数，则 `callback` 里的 `this` 指向 `context`。


返回 [Base 使用文档](../README.md)
