# Countdown倒计时组件资源及竞争者分析

---

搜寻了一下网上的Countdown组件, 数量不多, 很多功能也简单, 只找到一个相对说的过去的基于jQuery的. [点击跳转](http://www.littlewebthings.com/projects/countdown/example.php?e=omitweeks)

但是查看了它的源码, 发现它从2010年诞生之后就没变化, 并且基于jQuery1.4.1. 而且它只支持动画模式的倒计时, 我希望一个倒计时组件不但能选择绚丽的外表及动画效果, 还能实现文本化的基本功能. 并且代码组织方式也要遵循`alare`的规范, 所以我决定自己开发这个组件.

我还希望在开发过程中尝试在现代浏览器中使用CSS3来实现动画功能. 