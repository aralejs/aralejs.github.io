Overview
========
`arale.base` 是整个arale框架的核心, 里面提供了`arale.loader`, `arale.browser`等一些基本的内容.通过引入这个模块其实就可以开始进行开发了.下面我将详细的介绍其中比较重要的API




Configuration
=============

由于`arale.base`是这个框架的核心, 所以有些全局的配置需要我们注意下.就是`araleConfig`的配置.我们在引入arale.base.js 或者 arale.core.js 之前会配置它。例如：

    araleConfig = {
        combo_host: 'dev.assets.alipay.net',
        combo_path: '/ar/??'
    }

*   debug default: false
    是否添加时间戳. 由于压缩服务存在缓存, 所以在调试的时候, 我们希望不缓存, 通过配置这个为true, 我们就会在请求上加上时间戳

*   depSrc default: false
    是否依赖的是源文件,方便调试。当打开这一开关时，combo服务加载未压缩的源代码文件.

*   combo_host
    我们动态加载js的服务器地址  测试时,我们一般配置为 dev.assets.alipay.net

*   combo_path
    combo服务路径  测试时, 我们一般配置为 '/ar/??' 

*   css_combo_path
    css相关combo服务路径  测试时, 我们一般配置为 '/al/??'



Usage
=====
在`arale.base` 中主要是提供了一些核心API,下面简单的介绍了下具体的API, 更加详细的请参看jsdoc.

首先介绍`arale`命名空间下常用的一些方法

首先看下我们的Loader模块, 这个模块是我们经常接触到的, `arale.loader`模块可以通过Loader直接来访问


源代码示例
=====


    Loader.use(['aralex.xbox', 'alipay.http'], function() {
        var a = new aralex.IframeXbox({}, 'id');
    });

    arale.$try(function() {
        console.log(1/0);
    });

    arale.namespace('a.b.c');

    arale.domReady(function() {
        console.log('domReady!');
    });


API -PART0
=====

*   Loader.use(modules, callback);
    异步加载模块

*   Loader.useCss()
    直接加载某一个模块具体的css文件, 比如 Loader.useCss('alice.base-1.0.css'); 不提供回调

*   Loader.loadScriptByUrl(url, callback)
    加载外部js


API -PART1
=====
*   arale.$try() 
    执行一系列函数，获取执行中未抛异常的函数返回值，否则为null。

*   arale.implement(objects, properties)
    对传入的object的prototype进行扩展。

*   arale.namespace(namespace, root)

    使用此函数声明命名空间。

*   arale.module(module, obj, alias)
    生成一个Module

*   arale.mixin(target, src, override)
    把一个对象混入到另外一个对象中
    
*   arale.inherits(childCtor, parentCtor)
    给定一个子类去继承一个父类
    
*   arale.typeOf(value)
    获取类型值 
    
*   arale.isUndefined(value)
    判断值是否为undefined
    
*   arale.isNull(value)
    判断值是否为null 
    
*   arale.isFunction(fn)
    是否为函数类型

*   arale.isArray(arr)
    是否为数组类型
    
*   arale.isNumber(num)
    是否为整型

*   arale.isString(str)
    是否为字符串

*   arale.isObject(obj)
    是否是对象

*   arale.isDate(date)
    是否为日期类型

*   arale.isNativeObject(obj)
    判断给定对象是否为原生对象，以避免污染

*   arale.unique(arr)
    数组取出重复项
    
*   arale.$random()
    生成某一个区间的随机数

*   arale.exec(text)
    执行script

*   arale.hitch(scope, method)
    返回一个只能在我们给定scope中执行的函数，这个函数可以让我们方便的使用在和this相关的一些callback,成员函数中

*   arale.now()
    返回一个只能在我们给定scope中执行的函数，这个函数可以让我们方便的使用在和this相关的一些callback,成员函数中

*   arale.getUniqueId();
    获取唯一ID

*   arale.range(start, end, step)
    通过给定开始值和结束值创建数组。可设置步幅，可创建字母或者数字组成的数组。


API -PART2
=====
下面关于Browser相关的api

*   arale.isIE()
    是否是IE系列浏览器

*   arale.isIE6()
    是否是IE6浏览器

*   arale.isFF();
    是否是firefox浏览器

*   arale.isChrome();
    是否是chrome浏览器

*   arale.isSafari()
    判断是否是safari浏览器

*   arale.isOpera
    是否是opera浏览器

*   arale.broswer.name
    返回当前浏览器的名称

*   arale.browser.ver()
    返回浏览器当前的版本

*   arale.browser.System
    返回用户操作系统信息

*   arale.broswer.Enginer
    返回浏览器当前引擎信息

API -PART3
=====

*   arale.domReady(callback);
    到dom加载完毕触发
