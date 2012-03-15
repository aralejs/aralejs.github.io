var arale = require('arale.base');
var http = require('arale.http');
arale.namespace('alipay.http');

(function(arale) {
    var success = function(data, options) {
        if (data) {
            switch (data.stat) {
                case 'ok':
                    options.successCallback(data);
                    break;
                case 'deny':
                    if (alipay.http.core.callfromiframe) {
                        //如果是iframe但非box则刷新付页面
                        self.parent.location.reload();
                    } else {
                        location.href = data.target;
                    }
                    break;
                default:
                    //不知道干什么用
                    //if(options.formObject) options.resetForm();
                    //if(data.input && !options.form_custom)
                    //options.showInputError(data.input);
                    options.failure(data);
                    break;
            }
        }
    };
    /**
    根据alipay的需求封装的一个请求,可以处理jsonp,还有根据数据的状态进行callback的掉用
    */
    //TODO 需要对key做cache
    var defaultData = {
        '_input_charset': 'utf-8'
    };
    var typeSelect = function(type, url, options) {
        if (type == 'json') {
            var ajax = http.$Ajax.getAjaxFactory();
            return new ajax(url, options);
        }else if (type == 'jsonp') {
            return new http.$Jsonp.JsonpFactory(url, options);
        }
    };
	alipay.http.core = function(url, options) {
        var that = this;
        this.url = url;
        this.options = options;
        this.options.data = this.options.data || {};
        this.options.successCallback = this.options.success;
        this.options.success = function(data) {
            data = data.json || data;
            success(data, that.options);
        };
        arale.mixin(this.options.data, defaultData);
        this.cache = {};
        this.request = typeSelect(options.format || 'jsonp', url, options);
    };
	alipay.http.core.prototype.call = function(data) {
        if (data) {
            data = arale.mixin(data, this.options.data);
        } else {
            data = this.options.data;
        }
        this.request.send(data);
    }
    module.exports = alipay.http.core;
}(arale));
