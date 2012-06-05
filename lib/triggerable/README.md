
# Triggerable

Triggerable 是可触发 Overlay 型 UI 组件。

---


## 依赖

 - [seajs](seajs/README.md)
 - [position](position/README.md)
 - [overlay](overlay/README.md)


## 使用说明


### Dropdown

```
seajs.use(['jquery','dropdown'], function($, Dropdown){
    var example = new Dropdown({
        trigger: '#triggerId',
        element: '#targetId'
    });
});
```


## 演示页面

更多用法，请看 Demo 中的例子：
* [http://aralejs.org/lib/dropdown/examples/dropdown.html](http://aralejs.org/lib/dropdown/examples/dropdown.html)


## 单元测试

* [tests/runner.html](http://aralejs.org/lib/dropdown/tests/runner.html)


## 感谢

* Bootstrap Dropdown
