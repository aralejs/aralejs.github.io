/**
 * @name arale.aspect
 * @namespace
 * 面向切面编程实现，可以方便的外部对某个对象的方法进行增强
 * @author <a href="mail:hui.kang@alipay.com">hui.kang</a> 
 */
var arale = window.arale || require('arale.base');
arale.module("arale.aspect", (function(arale){
    var a = arale, aop = arale.aspect, ap = Array.prototype,
            contextStack = [], context;
        // this class implements a topic-based double-linked list
	var Advice = function(){
		 this.next_before = this.prev_before =
         this.next_around = this.prev_around =
         this.next_afterReturning = this.prev_afterReturning =
         this.next_afterThrowing = this.prev_afterThrowing = this;
         this.counter = 0;
	}
	arale.augment(Advice,{
		add: function(advice){
            var dyn = a.isFunction(advice),
            node = {advice: advice, dynamic: dyn};
            this._add(node, "before", "", dyn, advice);
            this._add(node, "around", "", dyn, advice);
            this._add(node, "after", "Returning", dyn, advice);
            this._add(node, "after", "Throwing", dyn, advice);
            ++this.counter;
            return node;
        },
        _add: function(node, topic, subtopic, dyn, advice){
            var full = topic + subtopic;
            if(dyn || advice[topic] || (subtopic && advice[full])){
                var next = "next_" + full, prev = "prev_" + full;
                (node[prev] = this[prev])[next] = node;
                (node[next] = this)[prev] = node;
            }
        },
        remove: function(node){
            this._remove(node, "before");
            this._remove(node, "around");
            this._remove(node, "afterReturning");
            this._remove(node, "afterThrowing");
            --this.counter;
        },
        _remove: function(node, topic){
            var next = "next_" + topic, prev = "prev_" + topic;
            if(node[next]){
                node[next][prev] = node[prev];
                node[prev][next] = node[next];
            }
        },
        isEmpty: function(){
            return !this.counter;
        }
	});
    var getDispatcher = function(){

        return function(){

            var self = arguments.callee,    // the join point
                advices = self.advices,     // list of advices for this joinpoint
                ret, i, a, e, t;

            // push context
            if(context){ contextStack.push(context); }
            context = {
                instance: this,                 // object instance
                joinPoint: self,                // join point
                depth: contextStack.length,     // current level of depth starting from 0
                around: advices.prev_around,    // pointer to the current around advice
                dynAdvices: [],                 // array of dynamic advices if any
                dynIndex: 0                     // index of a dynamic advice
            };

            try{
                // process before events
                for(i = advices.prev_before; i != advices; i = i.prev_before){
                    if(i.dynamic){
                        // instantiate a dynamic advice
                        context.dynAdvices.push(a = new i.advice(context));
                        if(t = a.before){ // intentional assignment
                            t.apply(a, arguments);
                        }
                    }else{
                        t = i.advice;
                        t.before.apply(t, arguments);
                    }
                }

                // process around and after events
                try{
                    // call the around advice or the original method
                    ret = (advices.prev_around == advices ? self.target : arale.aspect.proceed).apply(this, arguments);
                }catch(e){
                    // process after throwing and after events
                    context.dynIndex = context.dynAdvices.length;
                    for(i = advices.next_afterThrowing; i != advices; i = i.next_afterThrowing){
                        a = i.dynamic ? context.dynAdvices[--context.dynIndex] : i.advice;
                        if(t = a.afterThrowing){ // intentional assignment
                            t.call(a, e);
                        }
                        if(t = a.after){ // intentional assignment
                            t.call(a);
                        }
                    }
                    // continue the exception processing
                    throw e;
                }
                // process after returning and after events
                context.dynIndex = context.dynAdvices.length;
                for(i = advices.next_afterReturning; i != advices; i = i.next_afterReturning){
                    a = i.dynamic ? context.dynAdvices[--context.dynIndex] : i.advice;
                    if(t = a.afterReturning){ // intentional assignment
                        t.call(a, ret);
                    }
                    if(t = a.after){ // intentional assignment
                        t.apply(a,arguments);
                    }
                }
                // process dojo.connect() listeners
                var ls = self._listeners;
                for(i in ls){
                    if(!(i in ap)){
                        ls[i].apply(this, arguments);
                    }
                }
            }finally{
                // destroy dynamic advices
                for(i = 0; i < context.dynAdvices.length; ++i){
                    a = context.dynAdvices[i];
                    if(a.destroy){
                        a.destroy();
                    }
                }
                // pop context
                context = contextStack.length ? contextStack.pop() : null;
            }

            return ret;
        };
    };
    var exportsObject =  {
        /** @lends arale.aspect */
            /**
             * 添加一个advice到指定的方法
             *我们一次可以添加多个adivce到一个对象的多个方法，其这哦姑娘第二个参数可以是正则,数组,只要满足了条件都可以被advice,这个函数将返回一个handler
             *这个主要是为了我们unadvise用的
             * @param {Object} obj 需要advise的对象,这个不能是dom元素，如果这个对象是构造函数,那么它的prototype将被advised   
             * @param {String||RegExp||Array}   method 一个对象中字符串的名称,也可以是一个正则,只要对象中的方法名被匹配就会advised
             * @param {Object||Function||Array} advice 这个接收的类型比较多,详情参看test,基本的用法就是下面的那个
             * @example
             * var advice = {
             *      before: function(){
             *          console.log('before');      
             *      },
             *      after: function(){
             *          console.log('after');   
             *      }
             * }
             * var obj = {
             *      fn1: function(){},
             *      fn2: function(){},
             *      fn3: function(){}
             *}
             * arale.aspect.advise(obj,/^fn/,advice);
             *      advice:
             *      An object, which defines advises, or a function, which
             *      returns such object, or an array of previous items.
             *      The advice object can define following member functions:
             *      before, around, afterReturning, afterThrowing, after.
             *      If the function is supplied, it is called with a context
             *      object once per call to create a temporary advice object, which
             *      is destroyed after the processing. The temporary advice object
             *      can implement a destroy() method, if it wants to be called when
             *      not needed.     
             * @returns {Object}
             */
            advise: function(obj,method,advice){
                if(typeof obj != "object"){
                    obj = obj.prototype;
                }

                var methods = [];
                if(!(method instanceof Array)){
                    method = [method];
                }

                // identify advised methods
                for(var j = 0; j < method.length; ++j){
                    var t = method[j];
                    if(t instanceof RegExp){
                        for(var i in obj){
                            if(a.isFunction(obj[i]) && t.test(i)){
                                methods.push(i);
                            }
                        }
                    }else{
                        if(a.isFunction(obj[t])){
                            methods.push(t);
                        }
                    }
                }
                if(!a.isArray(advice)){ advice = [advice]; }
                return arale.aspect.adviseRaw(obj, methods, advice);    // Object
            },
            /**
             * 添加一个advice到指定的方法,这个和上面的比较类似,这个给上面的方法提供服务
             * @param {Object} obj 需要advise的对象,这个不能是dom元素，如果这个对象是构造函数,那么它的prototype将被advised   
             * @param {Array}   method 一个需要advise对象的方法名称数组
             * @param {Array} advice advice数组
             * @example
             * var advice = {
             *      before: function(){
             *          console.log('before');      
             *      },
             *      after: function(){
             *          console.log('after');   
             *      }
             * }
             * var obj = {
             *      fn1: function(){},
             *      fn2: function(){},
             *      fn3: function(){}
             *}
             * arale.aspect.advise(obj,['fn1','fn2'],[advice]);
             * @returns {Object}
            */
            adviseRaw: function(obj,methods,advices){
                if(!methods.length || !advices.length){ return null; }
                // attach advices
                var m = {}, al = advices.length;
                for(var i = methods.length - 1; i >= 0; --i){
                    var name = methods[i], o = obj[name], ao = new Array(al), t = o.advices;
                    // 如果这个方法还没有被advice过,create a stub
                    if(!t){
                        var x = obj[name] = getDispatcher();
                        x.target = o.target || o;
                        x.targetName = name;
                        x._listeners = o._listeners || [];
                        x.advices = new Advice;
                        t = x.advices;
                    }
                    // attach advices
                    for(var j = 0; j < al; ++j){
                        ao[j] = t.add(advices[j]);
                    }
                    m[name] = ao;
                }

                return [obj, m];    // Object
            },
            /**
             * 移除我们先前绑定的advices
             * @param {Object} obj 就是在我们的advise的时候,返回的对象   
             * @example
             * var advice = {
             *      before: function(){
             *          console.log('before');      
             *      },
             *      after: function(){
             *          console.log('after');   
             *      }
             * }
             * var obj = {
             *      fn1: function(){},
             *      fn2: function(){},
             *      fn3: function(){}
             *}
             * var d = arale.aspect.advise(obj,['fn1','fn2'],[advice]);
             * arale.aspect.unadvise(d);
             * @returns {void}
            */
            unadvise: function(handle){
                if(!handle){ return; }
                var obj = handle[0], methods = handle[1];
                for(var name in methods){
                    var o = obj[name], t = o.advices, ao = methods[name];
                    for(var i = ao.length - 1; i >= 0; --i){
                        t.remove(ao[i]);
                    }
                    if(t.isEmpty()){
                        // check if we can remove all stubs
                        var empty = true, ls = o._listeners;
                        if(ls.length){
                            for(i in ls){
                                if(!(i in ap)){
                                    empty = false;
                                    break;
                                }
                            }
                        }
                        if(empty){
                            // revert to the original method
                            obj[name] = o.target;
                        }else{
                            // replace with the dojo.connect() stub
                            var x = obj[name] = d._listener.getDispatcher();
                            x.target = o.target;
                            x._listeners = ls;
                        }
                    }
                }
            },
            /**
             * 返回正在进行advice时候的context，里面主要包括当前正在被advice的obj,还有被advice的方法等信息
             * @param {Object} obj 就是在我们的advise的时候,返回的对象   
             * @returns {Object}
            */
            getContext: function(){
                return context; // Object
            },
            /**
             * 
             * @example
             * @returns {Array}
            */
            getContextStack: function(){
                // summary:
                //      Returns the context stack, which reflects executing advices
                //      up to this point. The array is ordered from oldest to newest.
                //      In order to get the active context use dojox.lang.aspect.getContext().
                return contextStack;    // Array
            },
            /**
             * 调用原始的方法,或者也可能触发下一层级的around的advice,这个方法可以接收任何数量的参数,并且把这个函数掉用值返回，这个方法只有在advice
             * 为around的时候才有效
             * @example
             * var advice = {
             *  
             * }
             * var obj = {
             *      fn1: function(){},
             *      fn2: function(){},
             *      fn3: function(){}
             *}
             * var d = arale.aspect.advise(obj,['fn1','fn2'],[advice]);
             * arale.aspect.unadvise(d);
             * @returns {Object}
            */
            proceed: function(){
                var joinPoint = context.joinPoint, advices = joinPoint.advices;
                for(var c = context.around; c != advices; c = context.around){
                    context.around = c.prev_around; // advance the pointer
                    if(c.dynamic){
                        var a = context.dynAdvices[context.dynIndex++], t = a.around;
                        if(t){
                            return t.apply(a, arguments);
                        }
                    }else{
                        return c.advice.around.apply(c.advice, arguments);
                    }
                }
                return joinPoint.target.apply(context.instance, arguments);
            }
        };
    for (var eKey in exportsObject) {
        exports[eKey] = exportsObject[eKey];
    }
    window.Aspect = exportsObject;
    return exportsObject;
})(arale), "$Aspect");
