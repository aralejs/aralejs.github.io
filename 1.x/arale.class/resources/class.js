/**
 * @name arale.class
 * @class
 * OOP面向对象类封装，在组件开发中可以很好的组织管理代码
 * @author xuning@alipay.com
 * @param {Object} members 函数实体对象集合
 * @example
 * var Person = $Class({
 *      //配置属性
 *      options : {
 *          version : '1.0',
 *          isOpen  : true      
 *      },
 *      //constructs
 *      initialize : function(name){
 *          this.name = name;
 *      },
 *      say : function(){
 *          alert('I am a person');
 *      }
 * });
 * var myfriend = new Person("tom");
 * alert(myfriend.name); //return "tom"
 * myfriend.say(); //alert 'I am a person';
 * @description 该OOP封装事先定义options方法（主要用来设置相关配置属性）, setOptions用来扩展options配置属性
 */
arale.module('arale.class', (function(){

    var construct = function(members) {
        /**
         * 设置this.options变量属性
         * @param {Object} options 配置属性对象
         * @example
         * this.setOptions({name:"shitiven","age":"love"});
         */
        var setOptions = function(options){
            $H(this.options ? this.options : {}).extend(options || {});
            return options;
        };
    
        /** 
         * 构造函数
         * @constructs 
         */
        var initialize = function(){};
        /**
         * @private
         */
        var fn = function() {
            if(typeof(this.initialize) != "undefined" && arguments[0]!="no_init") {
                return this.initialize.apply(this, arguments);
            }
        };
        members.setOptions = setOptions;
        fn.prototype = members;
        $H(fn).extend(construct.prototype);
        return fn;
    };
    
    construct.prototype = 
/** @lends arale.class.prototype */
{
        /**
         * 继承方法
         * @method
         * @param {Object} members 函数实体对象
         * @example
         * var Chinese = Person.extend({
         *      say : function(){
         *          this.parent();
         *          alert('I come from china')
         *      }
         * });
         * var chinese = new ChinesePerson("jack");
         * alert(chinese.name); //return "jack"
         * chinese.say(); //alert 'I am a person' , 'I com from china';
         */
        extend: function(members) {
            var parent = new this('no_init');
            for(k in members) {
                var prev = parent[k];
                var cur = members[k];
                if (prev && prev != cur && typeof cur == 'function') {
                    cur = this._parentize(cur, prev);
                }
                parent[k] = cur;
            }
            return new construct(parent);
        },
        /**
         * 对象扩展
         * @method
         * @param {Object} members 函数实体对象
         * @example
         * Person.implement({
         *      setColor : function(){
         *          this.color = 'white';
         *      }
         * });
         * var person = new Person();
         * person.setColor();
         * alert(person.color); //return "white"
         */
        implement: function(members) {
            arale.implement(this.prototype, members);
        },  
        /**
         * @private
         */
        _parentize: function(cur, prev) {
            return function(){
                this.parent = prev;
                return cur.apply(this, arguments);
            }
        }
    }	
	var ClassFactory = function(members){
		return new construct(members);
	};
	return ClassFactory;
    
}),'$Class');
