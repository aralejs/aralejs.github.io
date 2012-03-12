/**
 * @namespace arale.ajax
 * @name arale.ajax
 * @description ajax请求模块,arale.ajax可以通过全局变量Ajax来代替访问
 */
var arale = window.arale || require('arale.base');
var $H = window.$H || require('arale.hash');
var $S = window.$S || require('arale.string');
var $A = window.$A || require('arale.array');
var $ = window.$ || require('arale.dom').$;
var $$ = window.$$ || require('arale.dom').$$;
var $URI = window.$URI || require('arale.uri');

arale.module('arale.ajax', (function() {
    var getOptions = function() {
        return arale.extend(_options);
    };
    var defaultData = {
        '_input_charset': 'utf-8'
    };
    var getData = function(data) {
        return arale.mixin(data, defaultData);
    };
    var setValue = function(obj, name, value) {
        //summary:对对象中的属性进行设置值,如果已经存在某个属性的值,我们把值添加到对应的数组中
        if (value === null) {
            return;
        }
        var val = obj[name];
        if (typeof val == 'string') { // inline'd type check
            obj[name] = [val, value];
        } else if (arale.isArray(val)) {
            val.push(value);
        } else {
            obj[name] = value;
        }
    };

     /**
     * 构造ajax请求的工厂方法。使用Ajax.getAjaxFactory()方法获取它。<br/>
     * 一般情况下使用Ajax.get(), Ajax.post()方法就可以满足需求，AjaxFactory的参数和方法同样适用于这些函数。如果实在满足不了需求再使用它来构造请求。<br/>
     * @name AjaxFactory
     * @description Ajax封装模块构造函数，方便同步异步请求网络资源 .
     * @constructor
     * @param {string} url 请求地址
     * @param {Object} options 参数设置
     * @param {Object} options.headers http请求头部
     * @param {boolean} [options.async=true] 是否异步请求
     * @param {string} [options.method=get] 请求方式
     * @param {boolean} [options.urlEncoded=true] 是否urlEncode.
     * @param {string} [options.encoding=utf-8] 请求编码
     * @param {boolean} [options.cache=false] 是否缓存
     * @param {Function}  options.success 成功回调函数  .
     * @param {Function}  options.failure 失败回调函数  .
     * @param {Object} [options.scope=window] 指定success、failure回调函数执行的上下文对象(context).
     * @param {number} [options.timeout=0]  设置超时取消时间。默认为0，即没有超时设置。超时后会调用failure回调。
     * @return {AjaxFactory}
     */
    var AjaxFactory = function(url, options) {
        this._options = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
            },
            async: true,
            method: 'get',
            urlEncoded: true,
            encoding: 'utf-8',
            //evalScripts : false,
            //evalReponse : false,
            timeout: 0,
            timeoutTimer: null,
            cache: true,
            success: function() {},
            failure: function() {},
            arguments: null,
            scope: window,
            dataType: 'json'
        };
        this._xhr = arale.browser.Request();
        this._response = {};
        this._url = url;
        this._running = false;
        $H(this._options).extend(options || {});
        this._response['arguments'] = this._options.arguments;
        this._response['scope'] = this._options.scope;
    };

    /**
     * @private
     * 解析JSON字符串
     * @example
     * arale.parseJSON(data)
     * @return {Object}
     */
    var parseJSON = function(data) {
        function validJSON(data) {
            if (typeof data !== 'string' || !data) {
                return false;
            }
            // Make sure leading/trailing whitespace is removed (IE can't handle it)
            data = data.replace(/^\s+|\s+$/g, ''); //去除左右空格
            return (/^[\],:{}\s]*$/.test(data.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                .replace(/(?:^|:|,)(?:\s*\[)+/g, '')));
        }
        function W3CParse(data) {
            if (validJSON(data)) {
                return window.JSON.parse(data);
            } else {
                return null;
                arale.error('Invalid JSON: ' + data);
            }
        }
        function defaultParse(data) {
            if (validJSON(data)) {
                return (new Function('return (' + data + ')'))();
            } else {
                return null;
                arale.error('Invalid JSON: ' + data);
            }
        }
        var ok_wrong_json = function() {
            try { JSON.parse('{ a: 1 }'); return true; } catch (x) { return false; }
        };
        if (window.JSON && window.JSON.parse && ok_wrong_json()) {
            parseJSON = function(data) {
                return W3CParse.call(this, data);
            };
        } else {
            parseJSON = function(data) {
                return defaultParse.call(this, data);
            };
        }
        return parseJSON(data);
    };

    arale.augment(AjaxFactory, {
        /** @lends AjaxFactory.prototype */

        /**
         * @description 设置头部请求信息
         * @method
         * @param {String} name 名称.
         * @param {String} value 内容.
         * @example
         * var request = new arale.Ajax('http://localhost');
         * request.setHeader('User-Agent' : 'Mozilla/5.0');
         */
        setHeader: function(name, value) {
            $H(this._options.headers).set(name, value);
            return this;
        },

        /**
         * @description 获取头部请求信息
         * @method
         * @param {String} name 名称.
         * @example
         * var request = new arale.Ajax('http://localhost');
         * request.getHeader('User-Agent' );
         */
        getHeader: function(name) {
            return arale.$try(function() {
                return this._xhr.getResponseHeader(name);
            });
        },

        /**
         * @private
         */
        onSuccess: function() {
            var scope = this._options.scope;
            this._response.timeout = false;
            //2010-11-12原来有与直接返回response到success中,x现在之需要返回和dataType相关的
            this._options.success.call(scope, this._response[this._options.dataType] || this._response);
        },

        /**
         * @private
         */
        onFailure: function() {
            var scope = this._options.scope;
            this._options.failure.call(scope, this._response);
        },

        /**
         * @description 发送请求
         * @method
         * @param {Object | Stirng} data 需要发送的数据.
         * @example
         * var request = new arale.Ajax('http://localhost');
         * request.send("name=fackweb&live=hangzhou");
         * request.send({name:'fackweb', live : 'hangzhou'});
         */
        send: function(data) {
            var that = this,
                options = this._options;
            this.cancel();
            this._xhr = arale.browser.Request();
            var url = this._url;
            data = getData(data);
            if (this._options.method.toLowerCase() == 'post' && this._options.form) {
                data = arale.mixin(data, this.formToObject($(this._options.form)), true);
            }
            //add timeout check
            if (options.async && options.timeout > 0) {
                options.timeoutTimer = setTimeout( function() {
                    that.cancel();
                    that._response['text'] = null;
                    that._response['xml']  = null;
                    that._response['json'] = null;
                    that._response['timeout'] = true;
                    that.onFailure();
                }, options.timeout);
            }
            //最少都有一个参数,所以不需要判断object了
            if (this._options.urlEncoded) {
                $H(data).each(function(key) {
                    var value = data[key];
                    if (value) {
                        data[key] = $S(value).urlEncode();
                    }
                });
            }
            if (!this._options.cache) {
                data['noCache'] = new Date().getTime();
            }
            data = $H(data).toQueryString();
            this._running = true;
            if (this._options.urlEncoded && this._options.method.toLowerCase() == 'post') {
                $H(this._options.headers).set('Content-Type', 'application/x-www-form-urlencoded; charset=' + this._options.encoding.toLowerCase());
            }
            if (data && this._options.method.toLowerCase() == 'get') {
                //原来是this.url这样不支持连续调用
                if (url.indexOf('?') > 0) {
                    url = url + '&' + data;
                } else {
                    url = url + '?' + data;
                }
                //url = $URI.setParams(this._url, data);
                data = null;
            }
            //2011.10.27 增加url装饰功能, 通过对这个方法的扩展来对请求的url进行扩展
            var url_old = url;
            url = $Ajax.decorateUrl(url);
            url = url ? url : url_old;
            this._xhr.open(this._options.method.toUpperCase(), url, this._options.async);
            $H(this._options.headers).each(function(key, value) {
                try {
                    this._xhr.setRequestHeader(key, value);
                }catch (e) {
                    //pass
                }
            }, this);
            this._xhr.onreadystatechange = arale.hitch(this, this.onStateChange);
            this._xhr.send(data);
            if (!this._options.async) this.onStateChange();
            return this;
        },

        /**
         * 取消请求
         * @method
         * @example
         * var request = new arale.Ajax('http://localhost');
         * request.send("name=fackweb&live=hangzhou");
         * request.cancel();
         */
        cancel: function() {
            if(!this._running) return this;
            this._running = false;
            this._xhr.onreadystatechange = function() {};
            this._xhr.abort();
            this._xhr = arale.browser.Request();
            return this;
        },

        /**
        * @ignore
        */
        onStateChange: function() {
            var that = this,
                options = this._options;
            if (this._xhr.readyState !=4 || !this._running) return;
            this._running = false;
            arale.$try(function() {
                that._status = that._xhr.status;
            });
            this._xhr.onreadystatechange = function() {};
            //clean timeoutTimer
            if (options.timeoutTimer) {
                clearTimeout(options.timeoutTimer);
                options.timeoutTimer = null;
            }
            this._response['status'] = this._xhr.status;
            if (this._xhr.status == 200) {
                this._response['text'] = this._xhr.responseText;
                this._response['xml']  = this._xhr.responseXML;
                if (this._options.dataType == 'json') {
                    try {
                        this._response['json'] = parseJSON(this._xhr.responseText);
                    } catch(e) {
                        this._response['json'] = null;
                    }
                }
                this.onSuccess();
            } else {
                this._response['text'] = null;
                this._response['xml']  = null;
                this._response['json'] = null;
                this.onFailure();
            }
        },

        /**
        *
        * @description 把form表单转换为json对象
        * @param {Node} fromNode 需要转换的form对象
        * @return {Object}
        */
        formToObject: function(formNode) {
            // 把一个form表单序列化成为一个object        
            var ret = {}, that = this;
            var exclude = "file|submit|image|reset|button|";
            $A($$(':input',formNode)).each(function(item) {
                var _in = item.attr('name');
                var type = (item.attr('type')||"").toLowerCase();
                if (_in && type && exclude.indexOf(type) == -1 && !item.node.disabled) {
                    setValue(ret, _in,that.fieldToObject(item));
                    if (type == "image") {
                        ret[_in+".x"] = ret[_in+".y"] = ret[_in].x = ret[_in].y = 0;
                    }
                }
            });
            return ret; // Object
        },

        /**
        * @description 把form表单中的某一项转换为object
        * @param {Node} item 徐转换的dom元素
        * @return {Object}
        */
        fieldToObject: function(item) {
            // 把一个表单项转化成一个object
            var ret = null;
            if (item) {
                var _in = item.attr('name');
                var type = (item.attr('type') || "").toLowerCase();
                if (_in && type && !item.node.disabled) {
                    if (type == "radio" || type == "checkbox") {
                        if(item.node.checked){ ret = item.node.value }
                        }else if(item.node.multiple){
                            ret = [];
                            $A($$("option", item)).each(function(opt) {
                                if (opt.node.selected) {
                                    ret.push(opt.node.value);
                                }
                            });
                    }else {
                        ret = item.node.value;
                    }
                }
            }
            return ret; // Object
        }
    });

    var exportsObject = {
        /** @lends arale.ajax */
        /**
         * @description 返回AjaxFactory 工厂方法
         * @example
         * var callback_fn = {
         *     success : function(res){
         *          console.log(res);
         *     },
         *     failure : function(res){
         *          console.log(res);
         *     }
         * }
         * var AjaxFactory = Ajax.getAjaxFactory();
         * var request = new AjaxFactory('http://localhost',{
         *      success : callback_fn,
         *      method : 'post'
         * });
         * request.send();
         * @return {AjaxFactory}
         */
        getAjaxFactory: function(){
            return AjaxFactory;
        },

        /**
         * 发起一个get方式的ajax请求。
         * @param {string} url 请求的url。
         * @param {Object} options 一些必要的配置信息,具体参数配置参看AjaxFactory中的options的配置。
         * @param {boolean} [delay] 当设置为true，不会自动发送请求，需要手动调用send方法再发送。
         * @return {AjaxFactory} ajax请求对象。
         * @example 
         * Ajax.get('your/url', {
         *     timeout: 5000,
         *     data: {
         *         a: 1,
         *         b: 2
         *     },
         *     success: function(data){
         *         console.log(data.json.age);
         *     },
         *     failure: function() {
         *         //invoke when timeout
         *     }
         * });
         *
         * @example
         * var handler = Ajax.get('your/url', function() {
         *     //this is the success callback
         * });
         *
         * setTimeout(function() {
         *     handler.cancel();
         *     console.log('timeout');
         * }, 5000);
         *
         * @example
         * //第三个参数设置为true，手动调用send方法。
         * var handler = Ajax.get('your/url', function() {
         *     //this is the success callback
         * }, true);
         *
         * handler.send({a: 1, b:2});
         */
        get: function(url, options, delay){
            //目前先提供这个直接callback的写法
            if(arale.isFunction(options)){
                options = {
                    success:options
                }
            }
            var ajax = new AjaxFactory(url, options);
            //2010-11-10 get支持延迟执行
            if(!delay){
                ajax.send(options.data);
            }
            return ajax;
        },

        /**
         * 发起一个post方式的ajax请求。
         * @param {string} url 请求的url.
         * @param {Object} options 一些必要的配置信息,具体参数配置参看AjaxFactory中的options的配置.
         * @param {boolean} [delay] 当设置为true，不会自动发送请求，需要手动调用send方法再发送。
         * @return {AjaxFactory} ajax请求对象。
         * @example 
         * Ajax.post('data.js', {
         *     timeout: 5000,
         *     data: {
         *         a: 1,
         *         b: 2
         *     },
         *     success: function(data) {
         *         console.log(data.json.age);
         *     },
         *     failure: function(data) {
         *         console.log('failure');
         *     }
         * });
         *
         * @example
         * var handler = Ajax.post('your/url', function() {
         *      //this is the success callback
         * });
         *
         * @example
         * //第三个参数设置为true，手动调用send方法。
         * var handler = Ajax.post('your/url', function() {
         *    //this is the success callback
         * }, true);
         * handler.send({a: 1, b:2});
         */
        post: function(url, options, delay) {
            if (arale.isFunction(options)) {
                options = {
                    succuss: options
                };
            }
            options = arale.mixin({method: "post"}, options);
            var ajax = new AjaxFactory(url, options);
            if(!delay){
                ajax.send(options.data);
            }
            return ajax;
        },

        /**
         * 发起一个jsonp请求。
         * @param {string} url 请求的url.
         * @param {Object} options 一些必要的配置信息,具体可配置选项参看JsonpFactory中的options配置.
         * @param {boolean} [delay] 当设置为true，不会自动发送请求，需要手动调用send方法再发送。
         * @return {JsonpFactory}
         * @example 
         * Ajax.jsonp(data, {
         *     timeout: 5000,
         *     data: {
         *         a: 1,
         *         b: 2
         *     },
         *     success: function(obj){
         *         console.log('success');
         *     },
         *     failure: function(data) {
         *         console.log('failure');
         *     }
         * });
         *
         * @example
         * var handler = Ajax.jsonp('your/url', function() {
         *     //this is the success callback
         * });
         *
         * @example
         * //第三个参数设置为true，手动调用send方法。
         * var handler = Ajax.jsonp('your/url', function() {
         *     //this is the success callback
         * }, true);
         *
         * handler.send({a: 1, b:2});
         */
        jsonp: function(url, options, delay){
            if (arale.isFunction(options)) {
                options = {
                    succuss: options
                };
            }
            var jsonp = new $Jsonp.JsonpFactory(url,options);
            var data = options.data || {};
            data['_input_charset'] = 'utf-8';
            if(!delay){
                jsonp.send(data);
            }
            return jsonp;
        },

        /**
         * @deprecated 请求一个文本。这个方法设计时没有充分考虑API的统一性，已被弃用。
         * @param {String} url 请求的url.
         * @param {Object} options 一些必要的配置信息,具体参数配置参看AjaxFactory中的options的配置.
         * @example 
         * var textPath = 'aralex/tmpl/a.html';
         * var text = $Ajax.getText(arale.getModulePath(textPath));
         * console.log(text);
         * var node = D.toDom(text);
         * console.log($$('#tmpl1', node)[0].node.innerHTML);
         */
        text: function(url, options){
            var text = "";
            var ajax = new AjaxFactory(url+"?date="+new Date().getTime(),{
                async:false,
                dataType:'text',
                success: function(data){
                    text = data;
                }
            });
            ajax.send();
            return text;
        }
     };
    window.Ajax = exportsObject;
    exports.$Ajax = exportsObject;
    return exportsObject;
}()), '$Ajax');

