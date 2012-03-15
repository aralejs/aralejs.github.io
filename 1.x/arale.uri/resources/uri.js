/**
 * @name arale.uri
 * @namespace
 * uri处理模块，其中包括等同Location相关的处理函数(hostname,pathname等)
 */
var arale = require('arale.base');
arale.module("arale.uri", (function(){
    
    var _re_search = /\?(.*)/,
        _re_hostptc   = /(https|http)\:\/\/((\w+|\.)+)/,
        _re_hostnoptc = /(\w+|\.)+/,
        _re_portnoptc = /^https|^http\:\/\/(\w+|\.)+(\:\d+)/,
        _re_portptc   = /(\w+|\.)+(\:\d+)/;
    
    var exportsObject = {
        /** @lends arale.uri */
        
        /**
         * 设置url请求参数
         * @param {String} url 处理的url
         * @param {Object} data 设置的url参数
         * @example
         * var url = 'http://www.alipay.com?buyid=123&product_id=321';
         * var params = {'pname':'shoues','pice':334};
         * url = arale.uri.setParams(url,params);
         * @return {String}
         */
        setParams : function(url, data){
            var params_readay = arale.uri.getParams(url);
            var params = null;
            if(data){
                params = typeof(data) == 'object' ? $H(data).toQueryString() : data;
            } 
            
            if(arale.uri.getProtocol(url)){
                var protocol = arale.uri.getProtocol(url) + '://';
            }else{
                var protocol = '';
            }
            
            url = protocol +  arale.uri.getHost(url, true) + arale.uri.getPath(url);
            if(params_readay){  
                url += '?' + params_readay;         
                url = params ? url + '&' + params : url;
            }else{
                url = params ? url += '?' + params : url;
            }
            return url;
        },
        
        /**
         * 获取url中path部分
         * @param {String} url 处理的url
         * @example
         * var url  = 'http://www.alipay.com/user/getUser.json';
         * var path = arale.uri.getPath(url); // return /user/getUser.json
         * @return {String}
         */
        getPath : function(url){    
            var path = '';
            if(/(.*)\?/.test(url)){
                url = /(.*)\?/.exec(url)[1];
            }
            url = url.replace(/(http|https)\:\/\//,'');
            var index = url.indexOf('/');
            if(index > -1){
                return url.substring(index,url.length);
            }
            return '';
        },
        
        /**
         * 获取url端口
         * @param {String} url 处理的url
         * @example
         * var url  = 'http://www.alipay.com:8080';
         * var path = arale.uri.getPort(url); // return '8080'
         * @return {String}
         */
        getPort : function(url){
            if(/\:(\d+)/.test(url)){
                return /\:(\d+)/.exec(url)[1];
            }
            return '80';
        },
        
        /**
         * 设置或返回当前 URL 的主机名和端口
         * @param {String} url 处理的url
         * @param {Boolean|可选} nonedefaultport 是否需要返回80端口
         * @example
         * var url  = 'http://www.alipay.com:8080';
         * var port = arale.uri.getHost(url); // return 'www.alipay.com:8080'
         * var url  = 'http://www.alipay.com';
         * var port = arale.uri.getHost(url); // return 'www.alipay.com:80'
         * @return {String}
         */
        getHost : function(url, nonedefaultport){
            var hostname = arale.uri.getHostName(url);
            var port = arale.uri.getPort(url);
            if(nonedefaultport && port=="80"){
                return hostname;
            }else{
                return  hostname + ':' + port;
            }
        },
        
        /**
         * 获取协议类型
         * @param {String} url 处理的url
         * @param {Boolean|可选} nonedefaultport 是否需要返回80端口
         * @example
         * var url  = 'http://www.alipay.com';
         * var protocol = arale.uri.getProtocol(url); // return 'http'
         * var url  = 'https://www.alipay.com';
         * var protocol = arale.uri.getProtocol(url); // return 'https'
         * @return {String}
         */
        getProtocol : function(url){
			var reg1 = /^http|^https/, reg2 = /^http\:|^https\:/;
            if(reg1.test(url)){
                return reg2.exec(url)[0].replace(':','');
            }
            return null;
        },
        
        /**
         * 设置或返回当前 URL 的主机名
         * @param {String} url 处理的url
         * @example
         * var url  = 'http://www.alipay.com';
         * var hostname = arale.uri.getProtocol(url); // return 'www.alipay.com'
         * @return {String}
         */
        getHostName : function(url){
            if(_re_hostptc.test(url)){
                return _re_hostptc.exec(url)[2];
            }
            if(_re_hostnoptc.test(url)){
                return _re_hostnoptc.exec(url)[0];
            }
            return null;
        },
        
        /**
         * 获取url的请求参数
         * @param {String} url 处理的url
         * @param {Boolean|可选} isobject 是否以object的格式返回
         * @example
         * var url  = 'http://www.alipay.com?name=fackweb&live=hangzhou';
         * arale.uri.getParams(url); // return 'name=fackweb&live=hangzhou'
         * arale.uri.getParams(url); // return {name:'fackweb', live:'hangzhou'}
         * @return {String | Object}
         */
        getParams : function(url, isobject){
            var result = {},
                params = _re_search.exec(url);
            if(!params) return null;
            if(params.length && params.length >= 2){
                params = params[1].split('&');
                for(var p; p = params.shift();){
                    if(p.split("=").length > 1){
                        result[p.split("=")[0]] = p.split("=")[1];
                    }
                }
                if(isobject){
                    return result;
                }else{
                    return $H(result).toQueryString();
                }
                
            }
            return null;
        },
        /**
         * 获取当前url的hash
         * @example
         * 当前url 如果为'http://www.alipay.com?name=fackweb&live=hangzhou#abcd';
         * arale.uri.getHash(); // return 'abcd'
         * @return {String}
         */
        getHash: function(url){
            var h = url || window.location.hash;
            if(h.charAt(0) == "#"){ 
				h = h.substring(1); 
			}else if(h.lastIndexOf('#') > -1){
				h = h.substring(h.lastIndexOf('#')+1); 
			}	
            return arale.browser.Engine.gecko ? h : decodeURIComponent(h);
        }
    };       
    for (var eKey in exportsObject) {
        exports[eKey] = exportsObject[eKey];
    }
    window.URI = exportsObject;
    return exportsObject;
}), '$URI');
