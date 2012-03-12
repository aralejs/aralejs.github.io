//moduleName, namespace, path, requires, assets
/**
 * deps需要解决的问题是,在我们arale中所有的我们可以划分为模块的对象统一管理起来,通过名字等一些关键字来确定一些组件的依赖关系,还有通过模块的名字动态加载.
 * @namespace
 */
arale.deps = (function() {
    //all module
    var all_modules = {
    };

    /**
     * 模块加载状态，常量
     * @memberOf arale.deps
     * @type Object
     * @name LOAD
     */
    var LOAD = {
        /** @lends arale.deps.LOAD */
        /**
         * 没有加载
         * @type Integer
         * @memberOf arale.deps
         */
        unload: 0,

        /**
         * 加载了,但是依赖的组件没有加载完，常量
         * @type Integer
         * @memberOf arale.deps
         */
        loading: 1,

        /**
         * 加载成功，常量
         * @type Integer
         * @memberOf arale.deps
         */
        loaded: 2
    };
    /**
     * Dependency对象无法手动实例化，只能通过arale.deps.getModule()得到
     * @param {Array} path 依赖的各文件的路径
     * @param {String} key 模块的名称
     * @param {Array} deps 依赖的模块集合
     * @memberOf arale.deps
     */
    var Dependency = function(path, key, deps) {
        this.path = path;
        this.key = key;
        this.deps = deps || [];
        this.status = LOAD.unload;
    };
    Dependency.prototype = {
        /**
        * 设置组件状态,获取组件状态
        * @memberOf arale.deps
        * @param {deps.LOAD} [status] 要设置的状态信息，可选值又arale.deps.LOAD.unload, arale.deps.LOAD.loading, arale.deps.LOAD.loaded
        */
        moduleStatus: function(status) {
            if (status) {
                this.status = status;
            }
            return this.status;
        },

        /**
         * 是否加载完毕
         * @memberOf arale.deps
         */
        isLoad: function() {
            return this.status > 0;
        },
        /**
         * fetch all file path of deps<br/>
         * <p>
         * 需要传入版本,然后需要通过版本把文件名凑出来。<br/>
         * TODO 目前先不考虑版本,以后版本需要用来加到文件名中,来形成最终我们需要请求的文件。<br/>
         * 我们获取一个模块的名字后,需要知道这个模块对应的文件路径,从而进行异步加载。<br/>
         * 但是我们可能会有组件依赖的情况,所以我们还需要把组件依赖的其他模块也要去找到依赖的文件，<br/>
         * 因为有可能依赖的已经有加载过了,需要排除,把所有需要的都给加载进来.
         * </p>
         * @memberOf arale.deps
         */
        getDepsPath: function(vers, moduleName) {
            var paths = [], moudleName, module, i, len, tempPath;
            if (this.path.length > 0) {
                paths.unshift(this.path.join(','));
            }
            if (this.deps.length > 0) {
                for (i = 0, len = this.deps.length; i < len; i++) {
                    moduleName = this.deps[i];
                    module = arale.deps.getModule(moduleName);
                    if (!module.isLoad()) {
                        tempPath = module.getDepsPath(vers, moduleName);
                        if (tempPath.length > 0) {
                            paths.unshift(tempPath.join(','));
                        }
                    }
                }
            }
            return paths;
        },

        /**
         * 获取依赖的模块
         * @memberOf arale.deps
         * @returns {Array} 依赖模块的集合
         */
        getDeps: function() {
            return this.deps;
        },

        /**
         * 获取依赖的文件模块
         * @memberOf arale.deps
         * @returns {Array} 依赖文件的集合
         */
        getPath: function() {
            return this.path;
        }
    };

    return {
        /** @lends arale.deps */
        /**
         * 此函数一般在各目录的deps.js中调用，添加依赖关系，供Loader觉得从combo服务上请求哪些文件
         * @param {Array | String} paths 依赖的文件路径
         * @param {String} moduleName 模块索引名称，Loader通过此名称决定加载哪个模块
         * @param {Array} deps moduleName依赖的模块索引名称，Loader通过此名称决定需要依赖加载的内容
         * @example
         * deps.addDependency(['arale/class/declare.js'], 'arale.class', []);
         * deps.addDependency(['arale/lang/aspect.js', 'arale/lang/md5.js','arale/lang/uri.js',
         * 'arale/lang/tmpl.js', 'arale/lang/date.js', 'arale/lang/number.js'], 'arale.lang');
         * deps.addDependency(['arale/http/jsonp.js', 'arale/http/ajax.js'], 'arale.http');
         * deps.addDependency(['arale/event/event-chain.js'], 'arale.event.chain');
         */
        addDependency: function(paths, moduleName, deps) {
            if (!arale.isArray(paths)) {
                paths = [paths];
            }
            all_modules[moduleName] = new Dependency(paths, moduleName, deps);
        },
        /**
         * 目前我们通过Loader.use()用到的模块名字来获取需要加载的文件的path
         * <br/>
         * 这个方法给用户module有2个作用
         * <br/>
         * 1.用来让用户来判断组件是否已经加载
         * <br/>
         * 2.如果没有加载的话,需要自己加载后,在这个模块里面注册自己的状态.
         * @param {String} moduleName 模块名称
         * @returns {Dependency} 模块依赖及加载状态信息
         */
        getModule: function(moduleName) {
            return all_modules[moduleName];
        },
        LOAD: LOAD,
        __getAllModule: function() {
            return all_modules;
        }
    };
})();
