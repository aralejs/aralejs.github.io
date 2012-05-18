

 - 同一个 element 上注册多个 data-action 如何设计？

 - 考虑 widget 嵌套的问题。嵌套时，在解析 template 和 data-api 时，子 widget
   的如果已解析了，不用重复解析。

 - model 类目前有无必要？特别是当 model 内容发生变化时，需不需要如何自动更新对应 dom 节点？
   有无必要引入类似 Ember 或 Knockout 的 bindings 和 auto-updating templates ?

 - 由于是基础组件，需要对关键点的性能进行测试，比如 daparser 的效率。

 - data-action 对参数的支持？比如 `data-action="click move {{title}}"`
   或者 `{{action move title on="click"}}` ?

