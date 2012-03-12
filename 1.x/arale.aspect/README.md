Overview
========
`arale.aspect` 是关于AOP [AOP简介](http://baike.baidu.com/view/73626.htm)的一个js实现. 提供了before, afterReturing, afterThrowing, around几种advice. 大家可以根据自己的需要去使用.

关于aop其实简单来说就是提供一种方式可以使我们在不改变一个方法代码, 而对这个方法的功能进行增强. 举个例子.比如说我们现在有下面这个对象

pay = {
  pay1: function(){},
  pay2: function(){},
  pay3: function(){}
}

如果现在有这么一个需求, 就是在调用pay1, pay2, pay3,方法之前必须检查当前用户是否登陆, 不登陆不能执行方法, 这个时候,按照最简单的方式就是修改代码本身, 然后加上判断, 但是这样我们会发现修改的地方会有很多, 从而就增加了引入bug的可能, 而有了AOP, 面对这种问题就简单了很多. 具体参看后面的代码说明.


Configuration
=============

没有什么需要配置的地方, 直接使用即可!


Usage
=====

具体的使用我们还是看例子吧!接着上面的那个例子来


源代码示例
=====

示例一:

    var pay = {
        pay1: function(){},
        pay2: function(){},
        pay3: function(){},
        hello: function() {}
    };


    var check = function() {
        //
        console.log('checked');
    };

    那现在我们想让调用pay1, pay2, pay3 之前都调用check方法, 而hello这个方法不受影响该怎么做呢?

    var advice = {
        before: check
    };
    
    arale.aspect.advise(pay, /pay\d/, advice);
    
    执行完然后我们再次调用pay系列方法就会发现在pay系列方法调用之前会先调用check方法

示例二:

接着上面的话题, 如果我们现在需要一个更复杂的情况, 如果我们检查失败是否可以阻止我们进行advice的方法呢? 看具体的代码

    var advice = {
        around: function() {
            if (!check()) return false; //在这里可以加入我们的添加判断
            //获取调用此方法时的参数, 并通过,连接起来 
            var args =[].join.call(arguments, ", ");
            //打印正在被advice方法的name
            var methodName =  arale.aspect.getContext().joinPoint.targetName;
            console.log('methodName-->' + methodName);
            //获取被advice的对象的实例
            console.log('instance-->' + arale.aspect.getContext().instance);
            //执行被advice的方法, 并获取返回值
            var retVal = $Aspect.proceed.apply(null, arguments);
            console.log(" <= around " + methodName+ " returns " + retVal);
            return retVal;	// should return a value, if the target returns a value
        }
    };

afterReturning 是在有返回值的情况下被调用
afterThrowing 是在方法有异常的情况下被调用, 使用和上面方法类似. 

需要注意的就是around, 由于这个的特殊性, 只有这个advice才可以控制被advice方法的执行. 其他的advice基本上就是通知形式的.

API
=====

*   arale.advice.advise(obj, method, advice);

    对一个对象进行advice, method支持String||RegExp||Array多种形式, 主要就是为了匹配我们针对与obj中的那个方法进行advice

*   arale.advice.unadvise(handler);

    我们也可以取消对一个对象的advice, 通过我们在advise的时候返回的一个句柄handler来取消

*   arale.advice.getContext();

    返回正在进行advice时候的context，里面主要包括当前正在被advice的obj,还有被advice的方法等信息

*   arale.advice.proceed();

    调用原始的方法,或者也可能触发下一层级的around的advice,这个方法可以接收任何数量的参数,并且把这个函数掉用值返回，这个方法只有在advice
    为around的时候才有效


    到dom加载完毕触发
