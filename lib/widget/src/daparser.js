//TODO 1。 我们可以模拟 emberjs 通过把标注 action 的元素上面生成一个特殊的 data-attribute。 然后
// 通过delegate我们的srcNode。 然后针对这个属性进行事件绑定。
//
//TODO 2。在模板中， 我们是否学习Ember支持这种写法
//<a href="#" {{action "edit" target="parentView"}}>Edit</a> ， 通过正则去解析。
//并支持用户在初始化组件的时候传入一个 Action, 然后通过上面这种方式进行关联。

define(function(require, exports, module) {
    var Class = require('class');

    module.exports = {
        parse: function() {
        }
    };
});

