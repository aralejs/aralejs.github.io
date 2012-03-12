Overview
========
`arale.event`是对浏览器和自定义事件进行支持的模块。里面定义了对事件的封装, 通过这个模块我们可以很方便的订阅事件, 发布事件等

Usage
=====
在event这个模块里面我们也可以通过E这个命名空间来访问, 比如E.connect等. 具体的参看下面的API介绍, 需要注意的就是我们取消事件绑定的时候需要用绑定事件的返回值,这里需要大家注意下。

请注意，使用事件代理delegate时，由于IE下对于select的change事件不冒泡，所以无法生效。


源代码示例
=====

示例一: 基本的事件绑定和取消

    var handler = $E.connect('div1','onclick',function(e) {
         alert(e)
    });
    //也可以用on来进行事件绑定

    $E.disConnect(handler);
    //也可以用off来进行事件绑定

    //可以直接通过dom元素绑定事件
    $('domId').click( function(e) {
        console.log(e);
    });

    $E.disAllConnect($('domId'), 'click');
    //也可以用这个方法把这个对象上所有注册的click方法移除

示例二: 事件的发布和订阅. 事件的发布和订阅大家应该很清楚, 这个在日常的开发还是很常见的. 这作为程序的解耦是很重要的一部分. 具体使用看下面的例子

    var pay = {
        submit: function(name, value) {
            console.log(name, value);
        }
    };

    //订阅一个'/pay/validata' 这个主题事件, 当收到事件的时候会执行pay.submit这个方法, 第二个参数为执行的context.
    var handler = $E.subscribe('/pay/validata',pay, pay.submit);
    //我们还可以有很多订阅者, 当有人发布这个主题的时候, 订阅者都会收到这个主题.

    //2秒后发布'/pay/validata' 这个主题事件. 主题是['name', 22]. 
    setTimeout(function(
        $E.publish('/pay/validata',['name',22]);
    ),2000);

    $E.unsubscribe(handler); //我们也可以随时取消事件的订阅



示例三: 事件的触发

`$E.trigger($('domId'), 'click', "11");`

//需要注意的是, 这个只能触发通过我们自己方法绑定的事件, 并不能模拟dom的事件.


API -PART0
=====

*   E.connect(/*Object|Node*/ obj, /*String*/ event, /*Object|null*/ context, /*String|Function*/ method);
    在一个对象上绑定事件.
    obj 需要添加事件绑定的对象. event 需要被绑定的事件名称,比如onclick. context 事件触发后执行绑定函数的context. method 事件触发后执行的函数

*   E.on
    同上

*   E.disConnect(handler)
    移除绑定的事件, handler是在connect绑定事件时返回的对象

*   E.off()
    同上

*   E.disAllConnect(object, method); 
    移除对象上绑定的该事件所有的方法.
    object 需要移除绑定事件的对象. method 绑定的方法

*   E.subscribe(topic, context, method);
    订阅一个事件
    topic 事件的主题. context 事件发布后需要执行函数的执行context. 事件触发后需要执行的方法

*   E.unsubscribe(handler)
    取消一个订阅事件, 这个和取消绑定事件类似, 也是需要一个订阅时的返回值

*   E.publish(topic, args);
    发布一个事件, args是数组, 也就是我们需要传递给订阅函数的参数

*   E.connectPublisher(topic, context, event);
    当指定的事件产生的时候发布一个特定的事件, 比如有一个方法,我们想在执行的时候发布一个事件, 就可以用此方法

*   E.trigger(elem, type, data);
    触发指定的事件, 目前只能触发通过arale绑定的事件, 但是并不模拟dom的行为

*   E.delegate(domNode, eventType, handler, selector); 
    事件代理, 如果我们要绑定某一元素下面多个子元素的某一事件,比如ul下面的li, 我们可以用此方法, 遇到类似情况, 强烈推荐使用
    例如 $E.delegate($('domId'), 'click', function(e) {console.log(e)}, 'li .className');

*   E.live(domNode, eventType, handler, selector);
    和delegate类似, 我们通过这个方法可以动态的捕获订阅元素中新创建的元素focus, blur已支持.


API - `arale.event.Object `在订阅事件的时候都会返回一个事件对象, 下面列出的是常用的事件对象中的参数
=====

属性
===
*   e.currentTarget
    绑定事件的对象

*   e.target
    事件触发的对象

*   e.originalEvent
    原生的event对象

*   e.relatedTarget
    事件相关对象

*   e.which
    add which for key events

*   e.metaKey
    add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)



METHOD
======

    
*   e.preventDefault();
    阻止事件原有的行为

*   e.stopPropagation();
    阻止事件冒泡

*   e.stopImmediatePropagation();
    Stops the propagation to the next bubble target and prevents any additional listeners from being exectued on the current target.

*   e.halt(immediate)
    Stops the event propagation and prevents the default event behavior.



