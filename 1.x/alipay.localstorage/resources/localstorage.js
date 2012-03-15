/**
 * Alipay.com Inc.
 * Copyright (c) 2005-2011 All Rights Reserved.
 * 
 * 本地储存，支持所有浏览器,ie67使用userData,其他使用localStorage
 *
 * @author guangao
 * @create 2011-7-19
 */

/**
 * @namespace alipay.localstorage
 */
var arale = require('arale.base');
var $A = require('arale.array');
arale.namespace('alipay.localstorage');

(function(){
	
	/**
	 * MS userData的单例
	 * @private
	 */	
	var userData = {
		
		/**
		 * 是否支持userData
		 * @type Boolean
		 */
		isSupport: arale.isIE() && arale.browser.Browser.ie <= 7,
		
		/**
		 * userData存储的文件名
		 * @type String
		 */
		FILENAME: 'alipayuserdata',
		
		/**
		 * userData索引的数组，保存所有本地存储的key值，不记录非本组件保存的key值
		 * @type Array
		 */
		index: [],

		/**
		 * 是否已经初始化
		 * @type Boolean
		 */
		inited: false,
		
		/**
		 * 过期时间，设置一年
		 * @type String
		 */
		expires: (function(d){
			d.setDate(d.getDate() + 365);
			return d.toUTCString();
		})(new Date()),
		
		/**
		 * userData的初始化函数
		 */
		init: function(){
			//初始化behavior的dom
			this.ele = document.createElement('input');
			this.ele.id = this.FILENAME;
			this.ele.type = "hidden";
			this.ele.style.behavior = 'url(#default#userdata)';
			//this.ele.addBehavior("#default#userData");			
			document.body.appendChild(this.ele);
			
			//已初始化
			this.inited = true;
			
			//初始化索引
			var index = this.get('index_index_index_index');		
			if(typeof index !== 'undefined' && index){
				this.index = index.split(',');
			}
		},
		
		/**
		 * 获取某项
		 * @param {String} key 获取值对应的key
		 * @returns {String} key对应的值，如果为空则为null
		 */
		get: function(key){
			if(!this.inited) this.init();
			
			try{
				this.ele.load(this.FILENAME);
				return this.ele.getAttribute(key);
			}catch(e){
				return null;
			}
		},
		
		/**
		 * 以键值对储存某项
		 * @param {String} key 设置的key
		 * @param {String} value 设置的value
		 * @returns {Void}
		 */
		set: function(key, value){
			if(!this.inited) this.init();
			
			if(typeof key == 'undefined' || !key) return;
			
			if(typeof value != 'undefined'){
				try{
					this.ele.setAttribute(key, value);
					//更新索引
					$A(this.index).include(key);
					this.ele.setAttribute('index_index_index_index', this.index.join(','));
					//保存文件
					this.ele.expires = this.expires;
					this.ele.save(this.FILENAME);
				}catch(err){}			
			}
		},
		
		/**
		 * 删除某项
		 * @param {String} key 删除key的值
		 * @returns {Void}
		 */
		remove : function(key){
			if(!this.inited) this.init();
			
			try{
				this.ele.removeAttribute(key);
				//更新索引
				$A(this.index).erase(key);
				this.ele.setAttribute('index_index_index_index', this.index.join(','));
				//保存文件
				this.ele.expires = this.expires;
				this.ele.save(this.FILENAME);	
			}catch(e){}	
		},
		
		/**
		 * 储存的个数，不记录非本组件保存的个数
		 * @returns {Number} 储存的个数
		 */
		size: function(){
			if(!this.inited) this.init();
			
			return this.index.length;
		},
		
		/**
		 * 获取某个索引对应的key值
		 * @param {Number} i 某项的索引值
		 * @returns {String} 索引对应的key值
		 */
		key: function(i){
			if(!this.inited) this.init();
			
			return this.index[i];
		},
		
		/**
		 * 获取所有的值，以键值对保存
		 * @returns {Object} 所有的值
		 */
		all : function(){
			if(!this.inited) this.init();
			
			var i = 0, k, m={}, l = this.index.length;
			try{
				this.ele.load(this.FILENAME);
				for(i=0; i<l; i++){
					k = this.index[i];
					m[k] = this.ele.getAttribute(k);
				}
				return m;
			}catch(err){
				return {};
			}
		},
		
		/**
		 * 清空所有项
		 * @returns {Void}
		 */
		clear: function(){
			if(!this.inited) this.init();
			
			this.ele.expires =  (function(d){
				d.setDate(d.getDate() - 1);
				return d.toUTCString();
			})(new Date());
			this.ele.save(this.FILENAME);
		}
	};
	
	/**
	 * HTML5 localStorage的单例
	 * @private
	 */	
	var localStorage = {
		
		/**
		 * 是否支持HTML5 localStorage的单例
		 * @type Boolean
		 */
		isSupport:(function(){
			try {
				return 'localStorage' in window && window['localStorage'] !== null;
			} catch (e) {
				return false;
			}
		})(),
		
		/**
		 * localStorage的初始化函数
		 */
		init: function(){
			this.ele = window.localStorage;
		},
		
		/**
		 * 获取某项
		 * @param {String} key 获取值对应的key
		 * @returns {String} key对应的值，如果为空则为null
		 */
		get: function(key){
			if(typeof key != 'undefined' && key){
				return this.ele.getItem(key);
			}
			return null;
		},
		
		/**
		 * 以键值对储存某项
		 * @param {String} key 设置的key
		 * @param {String} value 设置的value
		 * @returns {Void}
		 */
		set: function(key, value){
			if(typeof key == 'undefined' || !key) return;
			
			if(typeof value != 'undefined'){
				this.ele.setItem(key, value);
			}
		},
		
		/**
		 * 删除某项
		 * @param {String} key 删除key的值
		 * @returns {Void}
		 */
		remove: function(key){
			if(typeof key != 'undefined' && key){
				this.ele.removeItem(key);
			}
		},
		
		/**
		 * 储存的个数，不记录非本组件保存的个数
		 * @returns {Number} 储存的个数
		 */
		size: function(){
			return this.ele.length;
		},
		
		/**
		 * 获取某个索引对应的key值
		 * @param {Number} i 某项的索引值
		 * @returns {String} 索引对应的key值
		 */
		key: function(i){
			return this.ele.key(i);
		},
		
		/**
		 * 获取所有的值，以键值对保存
		 * @returns {Object} 所有的值
		 */
		all : function(){
			var i = 0, k, m={};
			for(i=0; i<this.ele.length; i++){
				k = this.key(i);
				m[k] = this.get(k);
			}
			return m;
		},
		
		/**
		 * 清空所有项
		 * @returns {Void}
		 */
		clear: function(){
			this.ele.clear();
		}
	};
	
	/**
	 * 获取localStorage单例
	 * @return {localStorage} localStorage单例
	 */	
    var exportsObject = {};
	exportsObject.getLocalStorage = function(){
		return localStorage.isSupport ? localStorage : null;
	};
	
	/**
	 * 获取userData单例
	 * @return {userData} userData单例
	 */	
	exportsObject.getUserData = function(){
		return userData.isSupport ? userData : null;
	};
	
	/**
	 * 是否支持HTML5的localStorage
	 * @type {Boolean}
	 */
    exportsObject.supportLocalStorage = localStorage.isSupport;
	
	/**
	 * 是否支持M$的userData
	 * @type {Boolean}
	 */
	exportsObject.supportUserData = userData.isSupport;
	
	/**
	 * 是否支持本地存储
	 * @type {Boolean}
	 */
	exportsObject.isSupport = localStorage.isSupport || userData.isSupport;

	
	//初始化alipay.localstorage
	if(userData.isSupport){
		
		arale.mixin(exportsObject,userData);
		
	    arale.domReady(function(){
			if(!exportsObject.inited) exportsObject.init();			
		});
	}else if(localStorage.isSupport){
		arale.mixin(exportsObject, localStorage);
		exportsObject.init();		
	}
	module.exports = alipay.localstorage = exportsObject
})();

