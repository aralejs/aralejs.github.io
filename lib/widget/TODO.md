
 - 组件嵌套时，dataset 的解析，父组件的 dataset 中不应该包含子组件的。

 - 基于模板片段的自动化局部刷新技术方案总结

 - Ember.js 有但 Arale Widget 没有的功能：
   1. firstName 变化时，不光可以触发 firstName 的事件，还可以触发 fullName 的事件
   2. set firstName 和 lastName, 仅触发一次 fullName 的事件
   3. 尽可能保持多次操作时，只有一次 DOM 刷新
