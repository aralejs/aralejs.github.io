/**
 * @class
 * jsonp 跨域资源请求
 * @class
 * @example
 * var ok_fn = function(response){
 *      alert(response); // return 服务器返回的内容
 * }
 * var fail_fn = function(){
 *      alert('request fail');
 * }
 * var api = new arale.Jsonp('http://www.alipay.com/', {
 *      success : ok_fn,
 *      failure : fail_fn
 * });
 * api.send({'name':'fackweb'});
 */
var arale = require('arale.base');
var $H = require('arale.hash');
var $S = require('arale.string');
var $A = require('arale.array');
var $ = require('arale.dom').$;
var $$ = require('arale.dom').$$;
var $Ajax = exports.$Ajax;

arale.module('arale.jsonp', (function() {
    arale.cache.callback_num = 1;
    arale.cache.callbacks = arale.cache.callbacks || {};
    var _default = {
        failure: function() {},
        success: function() {},
        timeout: 0,
        //charset: 'UTF-8',
        callparam: '_callback'
    };

    /**
     * 获取jsonp工厂
     * @name JsonpFactory 
     * @constructor
     * @description jsonp封装模块构造函数，方便同步异步跨域请求网络资源 .
     * @param {String} url 请求地址.
     * @param {Object} options 配置属性.
     * @param {Function} options.failure 请求失败后回调函数.
     * @param {Function} options.success 请求成功后回调函数.
     * @param {Number} options.timeout 设置超时时间.
     * @param {String} options.charset 请求时设置的编码，默认"UTF-8".
     * @param {String} options.callparam 回调函数的参数名.
     */
    var JsonpFactory = function(url, options) {
         //配置参数
        this._url = url;
        this._options = options || {};
        //默认参数
        arale.mixin(this._options, _default);
        //回调函数的ID
        this._callback_id = 1;
        //超时回调函数
        this._timeout_error = null;
    };
    arale.augment(JsonpFactory, {
        /**
         * 发送请求
         * @param {Object} data 要发送的数据.
         * @example
         * api.send({'name':'fackweb','age':'28'});
         */
        send: function(data) {
            var that = this;

            if (!document.documentElement.firstChild) {
                return null;
            }
            data = data || {};
            data['r'] = (new Date()).getTime();
            //最少都有一个参数,所以不需要判断object了
            $H(data).each(function(key) {
                var value = data[key];
                if (value) {
                    data[key] = $S(value).urlEncode();
                }
            });

            //设置超时
            if (this._options.timeout > 0) {
                this._timeout_error = setTimeout(this._options.failure, this._options.timeout);
            }
            
            //设置call_back id
            arale.cache.callback_num++;
            this._callback_id = 'jsonp' + arale.cache.callback_num;
            arale.cache.callbacks[this._callback_id] = function() {
                clearTimeout(that._timeout_error);
                that._options.success.apply(this, [].slice.call(arguments, 0));
            };
            //end
            data[this._options['callparam']] = 'arale.cache.callbacks.' + this._callback_id;

            //加载script静态资源
            var script = document.createElement('script');
            //2010-11-22服务器返回的编码是GBK,所以有问题，暂时先不编码
            /*
             * 使用arale.node设置script再ie6下有bug，换成原生的函数
            arale.node(script).setAttributes({
                'type': 'text/javascript',
                'id': this._callback_id,
                //'charset': this._options['charset'],
                'src': $URI.setParams(this._url, data)
            });
            */
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('id', this._callback_id);

            //2011.10.27 增加url装饰功能, 通过对这个方法的扩展来对请求的url进行扩展
            var src = $URI.setParams(this._url, data);
            if ( $Ajax.decorateUrl) {
                var src_old = src;
                src =  $Ajax.decorateUrl(src);
                src = src ? src : src_old;
            }
            script.setAttribute('src', src);
            this._options.charset && script.setAttribute('charset', this._options.charset);

            /*
            script.onloadDone = false;
            script.onload = function() {
                clearTimeout(that._timeout_error);
            }
            script.onreadystatechange = function() {
                if (('loaded' === script.readyState || 'complete' === script.readyState) && !script.onloadDone) {
                    script.onloadDone = true;
                    script.onload();
                }
            }
            */
            document.getElementsByTagName('head')[0].appendChild(script);
        },

        /**
         * 取消请求
         * @example
         * api.cancel();
         */
        cancel: function() {
            var scriptnode = $(this._callback_id).node;
            if (scriptnode && scriptnode.tagName.toUpperCase() == 'SCRIPT') {
                scriptnode.parentNode.removeChild(scriptnode);
                delete arale.cache.callbacks[this._callback_id];
                clearTimeout(this._timeout_error);
            }
        }
    });
    var exportsObject = {
        JsonpFactory: JsonpFactory
    };
    window.Jsonp = exports.$Jsonp = exportsObject;
    return exportsObject;
}()), '$Jsonp');
