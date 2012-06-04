
 - 基于模板片段的自动化局部刷新技术方案总结

 - renderPartial 和 render 方法统一
 - 模板片段 compile 一次，之后使用 compiled template

 - this.dataset 是否有必要？在事件代理中，可以直接用 [data-role=xx] 来选取，而且无动态
   更新问题。目前 dataset 的作用是，快速得到某个 data-xx 下的所有值和所对应的元素，在
   autoRender 时应该能用到，但其他使用场景暂时好像没有。等正式发布时，要考虑 this.dataset
   是不是必要功能，倘若不是的话，去除掉。

 - Ember.js 有但 Arale Widget 没有的功能：
   1. firstName 变化时，不光可以触发 firstName 的事件，还可以触发 fullName 的事件
   2. set firstName 和 lastName, 仅触发一次 fullName 的事件
   3. 尽可能保持多次操作时，只有一次 DOM 刷新
