
# Widget 

Widget 是 UI 组件的基础类，约定了组件的基本生命周期，实现了一些通用功能。基于 Widget
可以构建出任何你想要的 Web 界面。

---


## 模块依赖

 - [seajs](seajs/README.md)
 - [base](base/README.md)
 - [jquery](jquery/README.md) / [zepto](zepto/README.md)
 - TemplateWidget 还依赖 [handlebars](handlebars/README.md)


## 使用说明


### extend `Widget.extend(properties)`

使用 `extend` 方法，可以基于 `Widget` 来构建 UI 组件。

```js
/* switchable.js */
define(function(require, exports, module) {
    var Widget = require('widget');

    module.exports = Widget.extend({
        options: {
            prev: '.prev',
            next: '.next'
        },

        beforeCreate: function() {
            //view已经处理完毕， 可以在这个方法对view进一步处理。
            
            this.prevElement = find(this.getElement(), options.prev); 
            this.nextElement = find(this.getElement(), options.next);
        },

        bindAction: function() {
            
            this.onElement('click', options.prev, function(e) {
                e.stopPropagation();
                that.prev();
            });
            this.onElement('click', options.next, function(e) {
                e.stopPropagation();
                that.next();
            });

            this.on('next', function() {
                console.log('next--->');
            });

        },
        next: function() {
            this.trigger('next1'); 
        },
        prev: function() {
        
        }
    });
});

var sw = new Switchable({element: '#switchable', next: '.nextClass'});
sw.on('next', function() {
    console.log('next2');
});

```


## Widget 实例方法

如果一个组件通过 `Widget.extend` 来创建，会自动继承下面这些方法：


### `on`, `trigger`, `off` 继承自 Event，具体使用请参考 [events 使用文档](events/README.md)。


### `beforeCreate()`

在组件 View 渲染完毕后，会自动调用此方法。


### `bindAction()`

在 `beforeCreate` 处理完毕后，会调用此方法。这个方法主要是负责组件事件的绑定。


### `postCreate()`

当事件绑定完毕后，会调用此方法。在这个方法调用之前，组件基本已经初始化完毕，子类可以在这里做些收尾工作。


### onElement `this.onElement(type [, selector] [, data], handler(eventObject))`

给组件对应的 DOM 元素进行事件绑定。


### aroundFn `this.aroundFn(methodName [, before] [, after])`

给组件中指定的函数增加函数调用之前和之后的事件发布功能。



## 测试用例



## 性能对比



## 调研文档



## 交流讨论

欢迎创建
[GitHub Issue](https://github.com/alipay/arale/issues/new)
来提交反馈。


