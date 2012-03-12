/**
 * @name arale
 * @namespace
 * 顶层命名空间，包含在整个arale框架中常用到的功能函数
 */
var arale = window.arale = arale || {
    /**
     * 是否开启debug模式
     * @type Boolean
     */
    debug: araleConfig.debug || false,
    /**
     * 是否依赖的是源文件,方便调试 
     * @type String
     */
	depSrc: araleConfig.depSrc || false,
    /**
     * 临时存储，所有临时存储的数据都应该放入该对象中
     * @type Object
     */
    cache: {},
    /**
     * 配置项
     * @type Object
     */
    env: {
        /**
         * combo服务器地址
         * @memberOf arale
         * @type String
         */
        combo_host: araleConfig.combo_host,
        /**
         * combo服务路径
         * @memberOf arale
         * @type String
         */
		combo_path: araleConfig.combo_path,

		css_combo_path: araleConfig.css_combo_path,
        /**
         * 语言设置
         * @memberOf arale
         * @type Object
         */
        locale: araleConfig.locale
    },
    registerCoboPath: function(comboPath) {
        arale.env.combo_path = comboPath;
    },
    registerComboHost: function(moduleHost) {
        arale.env.combo_host = moduleHost;
    },
    getComboPath: function() {
        return this.getComboHost() + arale.env.combo_path;
	},
	getCssComboPath: function() {
        if(araleConfig.__tmp) {
            if (this.getComboHost().indexOf('assets') > -1) {
                return this.getCssComboHost() + '/??';
            } else {
                return this.getCssComboHost() + '/min/?f=';
            }
        }
        return this.getCssComboHost() + arale.env.css_combo_path;
    },
    /**
     * 获取combo_host
     */
    getComboHost: function() {
        var env = arale.env;
        if (env.combo_host.indexOf('http') == -1) {
            env.combo_host = location.protocol + '//' + env.combo_host;
        }
        return env.combo_host;
    },
    /**
     * 获取当前的css_combo_host    
     * @return string 当前的csscombohost
     */
    getCssComboHost: function() {
        return this.getComboHost();
    },

    /**
     * 获取执行中未抛异常的函数返回值，否则为null
     * @param {Function} arguments fn[, fn, fn, fn, ...].
     * @example
     * var e = arale.$try(function() {
     *      throw('error');
     * }, function() {
     *      return 'pass';
     * }); //return 'pass'
     * @returns {mixed|null}
     */
    $try: function() {
        for (var i = 0, l = arguments.length; i < l; i++) {
            try {
                return arguments[i]();
            } catch (e) {}
        }
        return null;
    },
    /**
     * 对传入的object的prototype进行扩展
     * @example
     * arale.implement(Array,{
     *      test: function() {
     *          alert('test');
     *      }
     * });
     * @return {void}
     */
    implement: function(objects, properties) {
        if (!arale.isArray(objects)) {
            objects = [objects];
        }
        for (var i = 0, l = objects.length; i < l; i++) {
            for (var p in properties) {
                objects[i].prototype[p] = properties[p];
            }
        }
    },
    /**
     * 模块注册方法，
     * 该方法用于注册模块信息
     * @param {string} namespace
     * @param {object} root
     * @return {void}
     */
    namespace: function(namespace, root) {
        var parts = namespace.split('.'),
            current = root || window;
        //创建命名空间
        if (!(parts[0] in window)) {
            window[parts[0]] = {};
        }
        for (var part; parts.length && (part = parts.shift());) {
              if (!current[part]) {
                current[part] = {};
              }
            //因为我们有时候需要混入对象的时候,只有得到父类的才能混入
            current[part]._parentModule || (current[part]._parentModule = current);
            //自己本身module所对应的key
            current = current[part];
            current._moduleName = part;
        }
        return current;
    },
    /**
     * 由命名空间解析为对象
     * @param {string} ns
     * @return {void}
     */
    parseNamespace: function(ns) {
        var arr = ns.split('.'),
            obj;
        for (var i = 0; i < arr.length; i++) {
            obj = arr[i];
        }
    },
    /**
     *生成一个Module
     * @param {String} module 模块的名称
     * @param {Function || Object } obj 一个对象,或者一个可执行的函数,这个函数需要返回一个对象
     * @param {String} alias 别名
     * @return {void}
     * Example
     * 我们传递进来的obj支持三种形式
     * 1.{fn: function() {}}  //对象的字面形式
     * 2.function() {//code  return {fn: function() {}}} //一个可执行并返回一个字面常量的对象
     * 3.function() {//code  return function() {}} //一个可执行并返回一个函数
     */
    module: function(module, obj, alias) {
        var current = this.namespace(module), root = window;
        if (arale.isFunction(obj)) {
            obj = obj.call(arale, obj);
        }
        if (arale.isFunction(obj)) {
            alias && (root[alias] = obj);
            current._parentModule[current._moduleName] = obj;
        }else {
            arale._mixin(current, obj);
            if (!root[alias]) {
                root[alias] = {};
            }
            alias && (arale._mixin(root[alias], obj));
        }
    },
     /**
     * 把一个对象混入到另外一个对象中
     * @name mixin
     * @param {Object} target 要被混入的对象
     * @param {Object } 需要混入的对象
     * @param {boolean} override 是否要覆盖原有存在的属性
     * @return {Object}
     * Example
     * var obj1 = arale._mixin({name:'alipay'},{name:'arale'});
     * //obj1.name == 'alipay'
       * var obj1 = arale._mixin({name:'alipay'},{name:'arale'},true);
     * //obj1.name == 'arale'
     */
    _mixin: function(target, src, override) {
        if (!target) {
            target = {};
        }
        for (var name in src) {
            if (src.hasOwnProperty(name)) {
                if ((target[name] == undefined) || override) {
                    target[name] = src[name];
                }
            }
        }
        return target;
    },
    extend: function(obj) {
        var temp = function() {};
        temp.prototype = obj;
        return new temp();
    },
    inherits: function(childCtor, parentCtor) {
      function tempCtor() {};
      tempCtor.prototype = parentCtor.prototype;
      childCtor.superClass = parentCtor.prototype;
      childCtor.superCouns = parentCtor;
      childCtor.prototype = new tempCtor();
      childCtor.prototype.constructor = childCtor;
    },
    augment: function(receivingClass, obj) {
        for (methodName in obj) {
            if (obj.hasOwnProperty(methodName)) {
                if (!receivingClass.prototype.hasOwnProperty(methodName)) {
                     receivingClass.prototype[methodName] = obj[methodName];
                }
            }
        }
    },
    dblPrototype: function(obj, init) {
        var Middle = function() {
        };
        Middle.prototype = obj;
        var First = function() {
            if (init) {
                init.apply(this, arguments);
            }
            this[0] = arguments[0];
        };
        First.prototype = new Middle();
        return First;
    },
    /**
     * 获取类型值
     * @param {String} value 需要获取的值
     * @example
     * arale.typeof([]) //return Array
     * @returns {String}
     */
    typeOf: function(value) {
      var s = typeof value;
      if (s == 'object') {
        if (value) {
          if (value instanceof Array ||
             (!(value instanceof Object) &&
             (Object.prototype.toString.call((value)) == '[object Array]') ||
             typeof value.length == 'number' &&
             typeof value.splice != 'undefined' &&
             typeof value.propertyIsEnumerable != 'undefined' &&
             !value.propertyIsEnumerable('splice'))) {
                return 'array';
          }
          if (!(value instanceof Object) &&
              (Object.prototype.toString.call((value)) == '[object Function]' ||
              typeof value.call != 'undefined' &&
              typeof value.propertyIsEnumerable != 'undefined' &&
              !value.propertyIsEnumerable('call'))) {
            return 'function';
          }
        } else {
          return 'null';
        }
      } else if (s == 'function' && typeof value.call == 'undefined') {
        return 'object';
      }
      return s;
    },
    /**
     * 判断值是否为undefined
     * @param {*} val 需要测试的值
     * @returns {Boolean}
     */
    isUndefined: function(val) {
        return typeof val === 'undefined';
    },
    /**
     * 判断值是否为null
     * @param {*} val 需要检测的值
     * @returns {Boolean}
     */
    isNull: function(val) {
        return val === null;
    },
    /**
     * 是否为函数类型
     * @param {*} val 任何值
     * @returns {Boolean}
     */
    isFunction: function(val) {
        return arale.typeOf(val) == 'function';
    },
    /**
     * 是否为数组类型
     * @param {*} val 任何值
     * @returns {Boolean}
     */
    isArray: function(val) {
        return arale.typeOf(val) == 'array';
    },
    /**
     * 是否为整型
     * @param {*} val 任何值
     * @returns {Boolean}
     */
    isNumber: function(val) {
        return arale.typeOf(val) == 'number';
    },
    /**
     * 是否为字符串
     * @param {*} val 目标字符串
     * @returns {Boolean}
     */
    isString: function(val) {
        return arale.typeOf(val) == 'string';
    },
    /**
     * 是否为字符串
     * @param {*} val 任何值
     * @returns {Boolean}
     */
    isObject: function(val) {
        var type = arale.typeOf(val);
        return type == 'object' || type == 'array' || type == 'function';
    },
    /**
     * 是否为日期类型
     * @param {*} val 任何值
     * @returns {Boolean}
     */
    isDate: function(val) {
        return arale.isObject(val) && arale.isFunction(val.getMonth);
    },
    /**
     * 判断给定对象是否为原生对象，以避免污染
     * @param {Object} ufo 对象传入
     * @returns {Boolean}
     * @example
     * arale.isNativeObject((new Date)) //return true
     */
    isNativeObject: function(ufo) {
        return (arale.isString(ufo) ||
                arale.isObject(ufo) ||
                arale.isFunction(ufo) ||
                arale.isDate(ufo));
    },
    /**
     * 数组取出重复项
     * @param {array} arr 数组
     * @returns {Array}
     * @example
     * arale.unique([1, 1, 2, 3]); //return [1,2,3]
     */
    unique: function(arr) {
        if (arr.constructor !== Array) {
            arale.error('type error: ' + arr + ' must be an Array!');
        }
        var r = new Array();
        o: for (var i = 0, n = arr.length; i < n; i++)
        {
            for (var x = 0, y = r.length; x < y; x++)
            {
                if (r[x] == arr[i])
                {
                    continue o;
                }
            }
            r[r.length] = arr[i];
        }
        return r;
    },
    /**
     * 生成某一个区间的随机数
     * @param {Number} min 最小数
     * @param {Number} max 最大数
     * @example
     * arale.$random(1, 10);
     * @returns {Number}
     */
    $random: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    error: function(str) {
        arale.log('error:' + str);
    },
    /**
     * 执行script
     * @example
     * arale.exec('this is a example<script>alert(1);</script>')
     * @retruns {String}
     */
    exec: function(text) {
        if (!text) return text;
        if (window.execScript) {
            window.execScript(text);
        } else {
            var script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script[(arale.browser.Engine.webkit && arale.browser.Engine.ver < 420) ? 'innerText' : 'text'] = text;
            document.getElementsByTagName('head')[0].appendChild(script);
            document.getElementsByTagName('head')[0].removeChild(script);
        }
        return text;
    },
    /**
     * 返回一个只能在我们给定scope中执行的函数，这个函数可以让我们方便的使用在和this相关的一些callback,成员函数中
     * @param {Object} scope 函数执行的scope.
     * @param {Function || String} method 一个需要被绑定scope的函数,或者一个对象中某个需要和这个对象绑定的方法.
     * @example
     * arlea.hitch(foo, 'bar')();
     * retuns foo.bar() 返回的这个bar函数，是运行在foo中的
     * var foo = {
     *   name:'alipay'
     * }
     * arlea.hitch(foo,function() {console.log(this.name)})(); //alipay
     * @returns {Function}
     */
    hitch: function(scope, method) {
        if (!method) {
            method = scope;
            scope = null;
        }
        if (arale.isString(method)) {
            scope = scope || window;
            if (!scope[method]) { throw (['arlea.hitch: scope["', method, '"] is null (scope="', scope, '")'].join('')); }
            return function() { return scope[method].apply(scope, arguments || []); }; // Function
        }
        return !scope ? method : function() { return method.apply(scope, arguments || []); }; // Function
    },
    now: function() {
        return (new Date()).getTime();
    },
    /**
     * 到服务器记录错误信息
     * @param {String} sev 错误的级别.
     * @param {String} msg 错误的信息.
     * @example
     * try{
     *        //logic
     *    catch(e) {
     *        arale.logError("error",e.message);
     *    }
     * @returns {String}
     */
    logError: function(sev, msg) {
        var img = new Image();
        //TODO 设置全局error url
        img.src = 'sev=' + encodeURIComponent(sev) + '&msg=' + encodeURIComponent(msg);
    },
    log: function() {
        if (araleConfig.debug && ('console' in window)) {
            console.log.apply(console, arguments);
        }
    },
    getUniqueId: function(str) {
        var id = arale.getUniqueId._id || 1;
        arale.getUniqueId._id = ++id;
        return (str) ? str + id : id;
    },
    getModulePath: function(path) {
        return araleConfig.module_path + '/' + path;
	},
	/**
	 * arale.array
	 */
	each: function(obj, callback, bind){       
        var isObject = arale.typeOf(obj) === 'object', key;
        if(isObject) {
			for(key in obj) {
				if (this.obj.hasOwnProperty(key)){
					callback.call(bind, key, obj[key]);
				}
            }
        } else {
			if (Array.prototype.forEach) {
				return [].forEach.call(obj, callback, bind);
			}
			for (var i = 0, len = obj.length; i < len; i++) {
				callback.call(bind, obj[i], i, obj);
			}
       }
   	},
   	checkVersion: function(version) {
		return;
    	if(version != arale.version) {
        	throw new Error("core version disaccord.[runtime is "+arale.verison + ", dependency is " + version);
   		}
	}
};
/**
 * 通过给定开始值和结束值创建数组
 * @memberOf arale
 * @example
 * range ( 0, 12 ); //return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
 * range( 0, 100, 10 ); //return [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
 * range( 'a', 'i' ); //return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
 * range( 'c', 'a' ); //return ['c', 'b', 'a']
 */
arale.range = function(start, end, step) {
    var matrix = [];
    var inival, endval, plus;
    var walker = step || 1;
    var chars = false;
    if (!isNaN(start) && !isNaN(end)) {
        inival = start;
        endval = end;
    } else if (isNaN(start) && isNaN(end)) {
        chars = true;
        inival = start.charCodeAt(0);
        endval = end.charCodeAt(0);
    } else {
        inival = (isNaN(start) ? 0 : start);
        endval = (isNaN(end) ? 0 : end);
    }
    plus = ((inival > endval) ? false : true);
    if (plus) {
        while (inival <= endval) {
            matrix.push(((chars) ? String.fromCharCode(inival) : inival));
            inival += walker;
        }
    } else {
        while (inival >= endval) {
            matrix.push(((chars) ? String.fromCharCode(inival) : inival));
            inival -= walker;
        }
    }
    return matrix;
};
arale.mixin = arale._mixin;

(function() {
	if(!window['console']){
		window.console = {
			log: function() {},
			info: function() {},
			dir: function() {},
			warn: function() {},
			error: function() {},
			debug: function() {}
		};
	}
}());
