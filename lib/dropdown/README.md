>Use the Source, Luke!

>看源码，少年!

# Dropdown

组件类，用于生成下拉浮层。

## 依赖
* 继承 Overlay

## 使用说明

### 一般用法

```
seajs.use(['jquery','dropdown'], function($, Dropdown){
    var example = new Dropdown({
        trigger: '#triggerId',
        element: '#targetId'
    });
});
```

## Demo
更多用法，请看 Demo 中的例子：
* [http://aralejs.org/lib/dropdown/examples/dropdown.html](http://aralejs.org/lib/dropdown/examples/dropdown.html)

## 单元测试

* [http://aralejs.org/lib/dropdown/tests/runner.html](http://aralejs.org/lib/dropdown/tests/runner.html)

## 感谢
* Bootstrap Dropdown
