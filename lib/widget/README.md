
# Widget 

Widget 是一个组件基础类，提供组件的一些基础功能。 比如基本的事件发布机制, 模板处理, 样式加载, 模板分析等功能。
并提供了组件的基本生命周期和一些标准属性配置。 用户可以按照这些基本的配置和覆盖对应的生命周期的方法就可以创建出自己
的组件。

---


## 模块依赖

 - [base](base/README.md)
 - [jquery](jquery/README.md)

## 使用说明


### extend `Widget.extend(properties)`

使用 `extend` 方法，可以基于 `Widget` 类来创建自己的类。参数 `properties`
是实例属性。


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

## Widget实例方法
如果一个组件通过Widget.extend来创建，会自动继承下面这些方法。 

### on, trigger, off 继承于Event，具体的使用可以去 [Event](events/README.md) 参看相关使用说明。

### beforeCreate() 
需要子类去覆盖，在组件View渲染完毕后， 会自动调用此方法。

### bindAction()
需要子类覆盖， 在beforeCreate处理完毕后，会调用此方法。 这个方法主要是负责组件事件的绑定。

### postCreate()
需要子类覆盖，当事件绑定完毕后， 会调用方法。 在这个方法调用之前，组件基本已经初始化完毕。 子类可以在这里做些收尾等工作。

### onElement this.onElement(type [, selector] [, data], handler(eventObject));
给组件对应的dom元素进行事件绑定。

### aroundFn this.aroundFn(methodName [, before] [, after])
给组件中指定的函数增加函数调用之前和之后的事件发布功能。



## 测试用例



## 性能对比


## 调研文档



## 交流讨论

欢迎创建
[GitHub Issue](https://github.com/alipay/arale/issues/new)
来提交反馈。


