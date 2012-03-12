/**
 * @name arale.declare
 * @declare
 * 更好的声明一个类,可以提供我们更多的选择
//TOOD
1.namespace,用户声明的class可以是a.b.c这样的形式.
2.多重继承,第一个是我们的父类,如果有多个的话,是混入,目前的混入规则是,只混入当前类不存在的方法,如果当前类存在,则当前类的方法其作用。
3.我们需要给用户提供prototype的机会,也就是我们需要给我们类提供默认的内容
4.支持在子类中调用父类的方法！(可能需要后续完成,目前做的比较不智能,需要手动指定需要调用父类方法的名字)
目标:
1.声明一个类,然后可以指定他的负类,而且支持多重继承,其中后面的会覆盖前面的,默认此类的parent是第一个继承的类,其实后来的那几个可以认为是混入。
2.期望的形式 arale.declare('alipay.pay',[parent,mixind],{
	//本类的prototype
})
*/


arale.module('arale.declare',function(){
	var a = arale, contextStack = [];
	var safeMixin = function(){
		var baseClass = arguments[0],clazzs = [].slice.call(arguments,1);

		for(var i=0,len=clazzs.length;i<len;i++){
			var clazz = clazzs[i];

			a._mixin(baseClass.prototype,clazz.prototype)
		}
	}
    /**
    var getPpFn1 = function(couns,fnName,childFn){
        //现在的思路是当用户第一次调用的时候，我们就把整个继承体系构造好
        if(!childFn || !couns || !couns.superCouns || childFn.parent){
            return;
        }
		var superCouns = couns.superCouns,superProto = superCouns.prototype;
        if(superProto.hasOwnProperty(fnName)){
            childFn.parent = superProto[fnName];
            getPpFn(superCouns,fnName,superProto[fnName]);
		    return superProto[fnName];
	    }else{
            return getPpFn(superCouns,fnName,childFn);
        }
    };
    */
	var getPpFn = function(couns,fn,fnName){
		var superCouns = couns.superCouns,superProto = superCouns.prototype;
		if(fn !== superProto[fnName]){
			return superProto[fnName]
		}else{
			return getPpFn(superCouns,fn,fnName);
		}		
		
	}
	var getFnName = function(couns,fn){
		if(fn.fnName){
			return fn.fnName;
		}
		//return "postCreate";
		var fnName = $H(couns.prototype).keyOf(fn);
		if(fnName == null){
			return getFnName(couns.superCouns,fn);
		}
		fn.fnName = fnName;
		return fnName;
	}
	var ConstructorFactory = function(className,parents,proto){
		var current = a.namespace(className),parent = null;
		var couns = function(){
			this.declaredClass = className;	
			this.init && this.init.apply(this,arguments);
			this.create && this.create.apply(this,arguments);
		}
		if(parents && arale.isArray(parents)){
			parent = parents.shift();			
		}else{
			parent = parents;
		}	
		parent && a.inherits(couns,parent);
		a.augment(couns,proto);
			//调用父类的方法,本来可以直接用inherited(arg),自动来判断是那个方法的
		/**
		couns.prototype.parent = function(){
			//这个方法实现的比较简易
			var fn = arguments[0].callee;
			var fnName = $H(couns.prototype).keyOf(fn)[0];
			if(couns.superClass[fnName]){
				couns.superClass[fnName].apply(this,arguments[0]);
			}
		}
		couns.prototype.parent = function(fnName){		
			var parentFn = arguments[0].callee;	
      			//这个方法实现的比较简易
			//var fn = arguments[0].callee;
			//var fnName = $H(couns.prototype).keyOf(fn)[0];
			//如果一个方法被调用过parent,我们就给这个方法添加一个parent的指向,下次直接调用这个方法
			//这样来避免同一个方法被调用两次
            var parentFn = couns.prototype[fnName].parent;
            if(!parentFn){
               while(!couns.prototype.hasOwnProperty(fnName)){
                    couns = couns.superCouns;
               }
               parentFn = getPpFn(couns,fnName,couns.prototype[fnName]);
            }
 
            if(parentFn){
                if($A(contextStack).indexOf(parentFn) > -1){
                    parentFn = parentFn.parent;                    
                }
                contextStack.push(parentFn);
                parentFn.apply(this,[].slice.call(arguments,1));	
                if(!parentFn.parent){
                    contextStack = [];
                }
            }else{
                contextStack = [];
            }
 		}
		*/
		couns.prototype.parent = function(){
			var couns = this.constructor;
			var fn = arguments[0].callee;
			var fnName = getFnName(couns,fn);
			fn = getPpFn(couns,fn,fnName);
			fn.apply(this,arguments[0]);
		}
		
		if(parents && parents.length > 0){
			safeMixin.apply(null,[couns].concat(parents));
		}
		current._parentModule[current._moduleName] = couns;
		
		//在这里去判断加载的模块是否依赖其他模块,如果没有依赖的话,发布模块加载完成事件,否则又模块依赖的组件来负责.
		//TODO moudleloaded这个变量名应该是常量
		//避免通过loader加载和手动src加载冲突
        //2011-11-7,由于目前所有的依赖关系通过deps文件来进行管理,所以下面的暂时先不用了,测试没有问题需要删除
        /**
		var deps = [].slice.call(arguments,3);
		if(deps.length > 0){
			$Loader.register(className,1);
			$Loader.deps(deps,className);	
		}else{
			$Loader.register(className,2);
		}
        */
	}
	return ConstructorFactory;
},'$Declare');
//Example

/**

arale.declare("a.b.c",null,{
    name:"n1",
    say: function(){
        console.log('c-->'+this.name);
    }
});

arale.declare("a.b.d",null,{
    fn:"f1"
});

arale.declare("a.b.e",[a.b.c,a.b.d],{
    name:"n2",
    say: function(){
        this.inherited('say');
    },
    init: function(){
        console.log('init');
    }
})

var e = new a.b.e();
console.log(e.fn); //f1
e.name; //n2;
e.say; //c-->n2;

*/
