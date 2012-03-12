Overview
=======

`arale.http`主要封装了ajax，jsonp的一些异步请求方法。具体的概念大家应该都很清楚，方法也不多，主要就是一些参数的配置需要大家注意下，具体请参考下面的介绍。

Usage
=====

在`arale.http`定义了一个Ajax全局变量, 大家可以直接用`Ajax.get`，`Ajax.post`，`Ajax.jsonp`这样的请求方式。

源代码示例一

    Ajax.get('your/url', {
        timeout: 5000,
        data: {
            a: 1,
            b: 2
        },
        success: function(data){
            console.log(data.json.age);
        },
        failure: function() {
            //invoke when timeout
        }
    });

源代码示例二

    var handler = Ajax.get('your/url', function() {
        //this is the success callback
    });
    
    setTimeout(function() {
        handler.cancel();
        console.log('timeout');
    }, 5000);

源代码示例三

    //第三个参数设置为true，手动调用send方法。
    var handler = Ajax.get('your/url', function() {
        //this is the success callback
    }, true);
    
    //可以手动控制具体请求的时间。
    handler.send({a: 1, b:2});


AjaxFactory Configuration
===========================

以下配置适用于`Ajax.get`和`Ajax.post`方法中的第二个(options)参数, 这个参数可以是一个object, 在这个里面可以对我们的请求添加更多的选项,大家经常用到的可能就是下面这些选项

*   async - default: true
    是否发送异步请求。

*   method - default:'get'
    请求类型。

*   urlEncoded - default: true
    是否进行urlencode。

*   encoding - default: 'utf-8'
    charset设置。

*   timeout - default: 0
    超时时间设置。

*   success - default: function() {},
    请求成功回调函数。 

*   failure - default: function() {},
    请求失败回调函数。

*   scope - default: window,
    success, failure回调函数执行的context(上下文对象)。

*   dataType - default: 'json'
    返回的数据类型。

JsonpFactory Configuration
===========================

以下配置适用于`Ajax.jsonp`方法中的第二个(options)参数, 这个参数可以是一个object, 在这个里面可以对我们的请求添加更多的选项,大家经常用到的可能就是下面这些选项

*   success - default: function() {},
    请求成功回调函数。 

*   failure - default: function() {},
    请求失败回调函数。

*   timeout - default: 0
    超时时间设置。

*   charset
    jsonp请求的原理是在页面中插入script标签发起请求，这个参数设置script的charset编码，默认不设置。

*   callparam - default: '_callback'
    传输给后台应用的回调函数的参数名，这是跟后台应用的约定。

API  PART-Ajax
==============

*   `Ajax.get(url, options, delay)`
    发起一个ajax的get请求, 对于简单的需求，也可以第二个参数直接传一个callback作为成功的回调，具体请参考API文档。

*   `Ajax.post(url, options, delay)`
    发起一个ajax的post请求, 对于简单的需求，也可以第二个参数直接传一个callback作为成功的回调，具体请参考API文档。

*   `Ajax.jsonp(url, options, delay)`
    发起一个jsonp请求。

*   `Ajax.text(url, options, delay)`
    请求一个文本。（已废弃）


API PART-handler 以上函数调用的返回值对象上也有一些方法
======================================================

以下方法适用于`Ajax.get`，`Ajax.post`，`Ajax.jsonp`三种函数调用的返回值对象：

*   `handler.send(data)`
    发起请求。

*   `handler.cancel()`
    取消请求。

Example
    
    var handler = Ajax.get('your/url', function() {
        //this is the success callback
    });
    
    setTimeout(function() {
        handler.cancel();
        console.log('timeout');
    }, 5000);
