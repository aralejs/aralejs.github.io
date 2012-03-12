Overview
========
`arale.cookie` 模块提供了简单的cookie读取和设置功能 

API 
=====

*   arale.cookie(name, value, prpos);
    设置或者读取cookie

*   arale.cookie.isSupported()
    检查当前页面是否支持cookie

Configuration
=============

其中主要配置就是在设置cookie的时候, 我们可能需要设置cookie额外的一些属性,比如expires等.

*   expires Date|String|Number  可选
    如果参数是一个数字, 则指定此cookie过期的天数
    如果是是date, 则直接设置传递的日期, 如果是一个过期的时间, 那么将直接删除此cookie
    如果没有传入这个参数, 或者是0, 那当浏览器关闭的时候就会清除此cookie

*   path String 可选 
    cookie的path

*   domain String 可选
    cookie的domain

*   secure Boolean 可选 
    此cookie是否仅在https的请求中传递

Usage
=====
在`arale.cookie` 主要有两个方法, 比较简单 


源代码示例
=====
    var cv = arale.cookie('cname'); //获取指定的cookie值

    arale.cookie("configObj", arale.toJson(config), { expires: 5 }); //设置从现在开始5天后过期的cookie
 
    arale.cookie("configObj", null, {expires: -1}); //删除一个cookie

    var config = JSON.parse(arale.cookie("configObj"));


