//moduleName, namespace, path, requires, assets
//deps需要解决的问题是,在我们arale中所有的我们可以划分为模块的对象统一管理起来,通过名字
//d等一些关键字来确定一些组件的依赖关系,还有通过模块的名字实动态加载.
arale.deps = (function() {
    //all module
    var all_modules = {
    };
    var LOAD = {
        //没有加载
        unload: 0,
        //加载了,但是依赖的组件没有加载完
        loading: 1,
        //加载成功
        loaded: 2
    };
    /**
     * path array
     * key string
     * deps array
     */
    var Dependency = function(key) {
        this.key = key;
        this.fileName = key
        this.status = LOAD.unload;
        //增加代理状态,用来在我们去请求真正的js的时候,代理的module并不会对应真正的js文件
        this.proxy = false;
    };
    Dependency.prototype = {
        /**
        * 设置组件状态
        * ,获取组件状态
        */
        moduleStatus: function(status) {
            if (status) {
                this.status = status;
            }
            return this.status;
        },
        isLoad: function() {
            return this.status > 0;
        },
        getPath: function() {
            return this.fileName;
        },
        isProxy: function() {
        	return this.proxy;
        }
    };

    return{
        /**
         *
         */
		addDependency: function(moduleName, deps) {
			var modules = all_modules;
            if (modules[moduleName]){
            	return;
            }
        	modules[moduleName] = [];
        	//给对应依赖的module,创建对应的子module
        	//需要反转
        	while(deps.length > 0){
        	   var dep = deps.pop();
        	   modules[moduleName].push(dep);
               if(!modules[dep]){
                   modules[dep] = new Dependency(dep);  
               }
        	}
        },
        /**
         * 目前我们通过use用到的模块名字来获取需要加载的文件的paht,来加载
         * 这个方法给用户module有2个作用
         * 1.用来让用户来判断组件是否已经加载
         * 2.如果没有加载的话,需要自己加载后,在这个模块里面注册自己的状态.
         */
        getModule: function(moduleName) {
        	return all_modules[moduleName];
        },
        LOAD: LOAD,
        /**
         * 把自己的依赖转换成一个module
         */
        depsToModule: function(key) {
        	var tempDependency = new Dependency(key);
        	tempDependency.proxy = true;
        	return all_modules[key] = tempDependency;
        },
        /**
         * 是否是我们Dependency的实例
         */
        isDep: function(dep){
        	return dep instanceof Dependency;
        },
        __getAllModule: function() {
            return all_modules;
        }
    };
})();
