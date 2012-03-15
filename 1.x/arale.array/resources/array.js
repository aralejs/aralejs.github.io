var arale = require('arale.base');

arale.module('arale.array', function() {
    /**
     * @name CArray
     * @description arale框架中对原生数组的封装类型，调用arale.array()或$A()来把原生数组转换为CArray类型，这样就可以使用我们封装好的很多数组操作了。<br/>CArray类型的数组保存了一个arr属性，是对原生数组的引用。这个类型是私有的，无法直接访问到。
     * @constructor
     * @param {Array} obj 要包装的原生数组，通过arr属性可以访问到
     * @example
     * var arr = arale.array([1, 2, 3]); //arr是CArray类型
     *
     * var total = 0;
     * arr.each(function(v, i) {
     *      total += v;
     * });
     *
     * @example
     * var arr = $A([1, 2, 3]); //同上，$A是arale.array的简单写法
     * var b = arr.some(function(v) {
     *      return v < 0;
     * });
     * //b is false
     */
    var CArray = arale.dblPrototype(Array.prototype, function(obj) {
        this.arr = obj;
    });
    arale.augment(CArray, /**@lends CArray.prototype */ {

        /**
         * 循环数组(对象)
         * @param {function} callback 每一项回调函数, 还两个参数，
         *  第一个为当前项(key)，第二项为序数(value)；.
         * @param {Object|可选} bind 传入的Object用作this对象使用.
         * @example
         * var arr = $A(['apple', 'banana', 'lemon']);
         * arr.each(function(item, index){
         *    alert(index + " = " + item);
         * });
         * var obj = {a:'value1',b:'value2',c:'value3'};
         * $A(obj).each(function(key, value){
         *    alert(key, ' = ', value);
         * }
         * @return {void}
         */
        each: function(callback, bind) {
            var target = this.arr;

            if (Array.prototype.forEach) {
                return [].forEach.call(target, callback, bind);
            }
            for (var length = target.length, i = 0; i < length; i++) {
                callback.call(bind, target[i], i, target);
            }
        },


        /**
         * 测试数组(对象)每一项是否符合所给条件。当callback返回false时立刻停止遍历。
         * @method
         * @param {function} callback 每一项回调函数.
         * @param {Object} [bind] 传入的Object用作this对象使用.
         * @example
         * var arr = $A([10,4,25,100])
         * var areAllBigEnough = arr.every(function(item, index){
         *   return item > 20;
         * }); //return false
         * @return {Boolean}
         */
        every: function(callback, bind) {

            var target = this.arr;

            if (Array.prototype.every) {
                return [].every.call(target, callback, bind);
            }

            for(var i=0,l=target.length; i<l; i++) {
                if(!callback.call(bind, target[i], i, target)) {
                    return false;
                }
            }
            return true;

        },


        /**
         * 过滤出与条件相符的项并返回新数组(对象)
         * @memeberOf arale.array
         * @param {function} callback 每一项回调函数.
         * @param {Object||可选} bind 传入的Object用作this对象使用.
         * @example
         * var arr = $A([10,4,25,100]);
         * arr.filter(function(item, index){
         *   return item > 20;
         * }); //return [25,100];
         * @return {Array}
         */
        filter: function(callback, bind) {
            var result = [];

            this.each(function(item, index) {
                if (callback.call(bind, item, index)) {
                    result.push(item);
                }
            });
            return result;
        },

        /**
         * TODO: 去留
         * 清除所有未定义的变量并返回新数组 (i.e not null or undefined)
         * @memeberOf arale.array
         * @example
         * var arr = $A([null, 1, 0, true, false, "foo", undefined, ""]);
         * arr.clean(); //return [1,0,true,false,"foo",""];
         * @return {Array}
         */
        clean: function() {
            var fn = function(obj) {
                return (obj != undefined);
            }
            return this.filter(fn);
        },

        /**
         * 改变每一项并创建一个新数组
         * @memeberOf arale.array
         * @param {Function} callback 回调函数.
         * @param {Object||可选} bind 传入的Object用作this对象使用.
         * @example
         * var arr = $A([1, 2, 3]);
         * arr.map(function(item,index){
         *  return item * 2;
         * }); // [2,4,6]
         * @return {Array}
         */
        map: function(callback, bind) {
            var result = [],
                i = 0;
            this.each(function(item, index) {
                result[i++] = callback.call(bind, item, index);
            });
            return result;
        },

        /**
         * 至少有一项满足条件则返回true
         * @memeberOf arale.array
         * @param {Function} callback 回调函数.
         * @param {Object||可选} bind 传入的Object用作this对象使用.
         * @example
         * var arr = $A([10, 25, 31]);
         * var isAnyBigEnough = arr.some(function(item,index){
         *  return item > 30;
         * }); // return true
         * @return {Boolean}
         */
        some: function(callback, bind) {
            var target = this.arr;
            if (Array.prototype.some) {
                return [].some.call(target, callback, bind);
            }
            for (var l = target.length, i = 0; i < l; i++) {
                if(callback.call(bind, target[i], i, target)) {
                    return true;
                }
            }
            return false;
        },

        /**
         * 将两个数组合并成key:value Object
         * @memeberOf arale.array
         * @param {Array} vals 用作value的数组.
         * @param {Array} keys 用组key的数组.
         * @example
         * var vals  = $A(['Cow', 'Pig', 'Dog', 'Cat']);
         * var keys = $A(['Moo', 'Oink', 'Woof', 'Miao']);
         * arr.associate(keys); //returns {'Cow': 'Moo', 'Pig': 'Oink', 'Dog': 'Woof', 'Cat': 'Miao'}
         * @return {Array}
         */
        associate: function(keys) {
            keys && (keys = keys.arr || keys);
            var obj = {},
                vals = this;

            vals.each(function(item, index) {

                //$A() 是没有 length 所，所以线上版的有 BUG
                // 2010.01.14
                if (keys[index] && item) {
                    obj[keys[index]] = item;
                }
            });
            return obj;
        },

        /**
         * 返回该值在数组中的下标，如不存在则返回 -1
         * @memeberOf arale.array
         * @param {Object} item 需要查找的项.
         * @param {Number|可选} from 从某个下标开始搜索.
         * @example
         * var arr = $A(['apple', 'lemon', 'banana']);
         * arr.indexOf("lemon"); //return 1
         * arr.indexOf("lemin", 4); //return -1
         * @return {Number}
         */
        indexOf: function(item, from) {
            var arr = this.arr,
                len = arr.length;
            i = (from < 0) ? Math.max(0, len + from) : from || 0;
            for (; i < len; i++) {
                if (arr[i] === item) return i;
            }
            return -1;
        },

        /**
         * 是否包含提供的项
         * @memeberOf arale.array
         * @param {Object} item 匹配的项.
         * @param {Number|可选} from 从改下标开始搜索，默认为0.
         * @example
         * var arr = $A(['a', 'b', 'c']);
         * arr.contains('a'); //return true
         * @return {Boolean}
         */
        contains: function(item, from) {
            return this.indexOf(item, from) !== -1;
        },

        /**
         * 扩展一个数组
         * @memeberOf arale.array
         * @param {Array} array 操作的数组对象.
         * @example
         * var arr = $A(['a', 'b', 'c']);
         * arr.extend(['d','c']); //return ['a', 'b', 'c', 'd', 'c']
         * @return {Array}
         */
        extend: function(array) {
            array = array.arr || array;
            for (var i = 0, j = array.length; i < j; i++) this.arr.push(array[i]);
            return this.arr;
        },

        /**
         * 获取数组最后一项
         * @memeberOf arale.array
         * @example
         * var arr = $A(['a', 'b', 'c']);
         * arr.last(); //return 'c'
         * @return {?mixed}
         */
        last: function() {
            return (this.arr && this.arr[this.arr.length - 1]) || null;
        },

        /**
         * 随机获取一项
         * @memeberOf arale.array
         * @example
         * var arr = $A(['a', 'b', 'c']);
         * arr.random(); //return 其中的某一项
         * @return {?mixed}
         */
        random: function() {
            return (this.arr && this.arr[arale.$random(0, this.arr.length - 1)]) || null;
        },

        /**
         * push一项原由数组没有的项
         * @memeberOf arale.array
         * @param {Object} item 插入的项.
         * @example
         * var arr = $A(['a', 'b', 'c']);
         * arr.include('c'); //return ['a', 'b', 'c']
         * arr.include('d'); //return ['a', 'b', 'c', 'd']
         * @return {Array}
         */
        include: function(item) {
            if (!this.contains(item)) this.arr.push(item);
            return this.arr;
        },

        /**
         * 合并两个数组
         * @memeberOf arale.array
         * @param {Array} array 操作的数组对象.
         * @example
         * var arr = $A(['a', 'b', 'c']);
         * arr.combine(['d','c']); //return ['a', 'b', 'c', 'd']
         * @return {Array}
         */
        combine: function(array) {
            var arr = [],
                that = this;
            $A(array).each(function(item) {
                arr = that.include(item);
            });
            return arr;
        },

        /**
         * 移除等于该值的项
         * @memeberOf arale.array
         * @param {Object} item 需要移除项的值.
         * @example
         * var arr = $(['a', 'b', 'c', 'a']);
         * arr.erase('a'); //return ['b', 'c']
         * @return {Array}
         */
        erase: function(item) {
            var arr = this.arr;
            this.each(function(member, index) {
                if (member === item) {
                    arr.splice(index, 1);
                }
            });
            return arr;
        },

        /**
         * 清空数组
         * @memeberOf arale.array
         * @example
         * var arr = ['a', 'b', 'c', 'a'];
         * arr.empty(); //return []
         * @return {Array}
         */
        empty: function() {
            this.arr.length = 0;
            return this.arr;
        },

        /**
         * 合并成一个单一数组
         * @memeberOf arale.array
         * @example
         * var myArray = $A([1,2,3,[4,5, [6,7]], [[[8]]]]);
         * var newArray = myArray.flatten(); //newArray is [1,2,3,4,5,6,7,8]
         * @return {Array}
         */
        flatten: function() {
            return this.inject([], function(array, item) {
                if (item instanceof Array) return array.concat($A(item).flatten());
                array.push(item);
                return array;
            });
        },

        /**
         * 将hex颜色值转化成RGB格式
         * @param {Boolean} array 是否以数组格式返回，默认为false.
         * @example
         * $A(['11','22','33']).hexToRgb(); //returns "rgb(17,34,51)"
         * $A(['11','22','33']).hexToRgb(true); //returns [17, 34, 51]
         * @return {Array|String}
         */
        hexToRgb: function(array) {
            if (this.arr.length !== 3) return null;
            var rgb = this.map(function(value) {
                if (value.length === 1) value += value;
                return $S(value).toInt(16);
            });
            return (array) ? rgb : 'rgb(' + rgb + ')';
        },

        /**
         * 将rgb颜色值转化成"#12323"类似格式
         * @param {Boolean} array 是否以数组格式返回，默认为false.
         * @example
         * $A([17,34,51]).rgbToHex(); //returns "#112233"
         * $A([17,34,51]).rgbToHex(true); //returns ['11','22','33']
         * $A([17,34,51,0]).rgbToHex(); //returns "transparent"
         * @return {Array|String}
         */
        rgbToHex: function(array) {
            if (this.arr.length < 3) return null;
            if (this.arr.length === 4 && this.arr[3] === 0 && !array) return 'transparent';
            var hex = [];
            for (var i = 0; i < 3; i++) {
                var bit = (this.arr[i] - 0).toString(16);
                hex.push((bit.length == 1) ? '0' + bit : bit);
            }
            return (array) ? hex : '#' + hex.join('');
        },

        /**
         * 根据定义的规则来累计值,该方法常用于构建数组、计数数值总和或平均值等。
         * @param {Anything} memo 初始值.
         * @param {Function} iterator 回调函数.
         * @param {Object} context 作用域.
         * @example
         * $A([1,2,3,4,5,6,7,8,9,10]).inject(0, function(acc, n) {
         return acc + n;
         * }); //return 55 	(1 到 10 的总和)
         * $A([2,3,4,5]).inject(1, function(acc, n) {
         *	return acc * n;
         * });  // return 120 (5 的阶乘)
         * $A(['hello', 'world', 'this', 'is', 'nice']).inject([],
         *	 function(array, value, index) {
         if (0 == index % 2)
         array.push(value);
         return array;
         }
         * ); //return 	['hello', 'this', 'nice']
         * @return {mixed}
         */
        inject: function(memo, iterator, context) {
            this.each(function(value, index) {
                memo = iterator.call(context, memo, value, index);
            });
            return memo;
        },
        /**
         * 删除一个元素,目前支持一个
         * @param {Object} item
         * @example
         * @return {Array|String}
         */
        remove: function(item) {
            var index = this.indexOf(item);
            if (index > -1) {
                this.arr.splice(index, 1);
            }
        }
    });
    CArray.prototype['toString'] = function() {
        return this.arr.toString();
    };
    CArray.prototype['valueOf'] = function() {
        return this.arr.valueOf();
    };
    //return new Temp(node);
    var ArrayFactory = function(arr) {
        //如果是NodeList则不处理，这是为了与以前的代码兼容
        //if(arr.Arr) {return arr;}
        if(arr.arr) {
            return arr;
        }
        return new CArray(arr);
    }
    ArrayFactory.fn = CArray.prototype;

    window.A = module.exports = ArrayFactory;

    return ArrayFactory;
}, '$A');

//TODO,push ,pop 这些原生的方法没有在包装类型中实现.
