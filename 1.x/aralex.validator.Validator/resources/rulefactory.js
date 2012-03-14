var alipayHttpCore = require('alipay.http');
var $E = require('arale.event');
arale.namespace('aralex.validator.RuleFactory');
/**
 * 校验规则工厂，是aralex.validator.Validator组件的辅助类，用来管理校验规则。
 * @author <a href="mailto:shuai.shao@alipay.com">邵帅</a>
 */
aralex.validator.RuleFactory = function() {};

/**
 * 添加验证规则
 * @param {string} name 验证规则的标识符.
 * @param {RegExp | Function | string} rule 具体的验证规则，有两种形式：
 * 1.正则 2.函数判断(必须返回布尔类型值) 3.正则字符串.
 * @param {Boolean=} opt_override 是否覆盖同名的验证规则.
 */
aralex.validator.RuleFactory.setRule = function(name, rule, opt_override) {
    if (arale.isString(rule)) {
        rule = new RegExp(rule);
    }
    var obj = {};
    obj[name] = rule;
    arale.mixin(aralex.validator.RuleFactory.rules_, obj, opt_override);
};

/**
 * 取得验证规则
 * @param {string} name 规则名称.
 * @return {RegExp | Function | Null} 返回function类型或者RegExp类型的校验规则.
 */
aralex.validator.RuleFactory.getRule = function(name) {
    return aralex.validator.RuleFactory.rules_[name];
};

/**
 * 校验规则，私有属性必须通过get,set方法访问
 * @type {Object}
 * @private
 */
aralex.validator.RuleFactory.rules_ = {
    /**
     * 电子邮件校验规则
     * @type RegExp
     */
    email: /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    /**
     * 电话号码校验规则
     * @type RegExp
     */
    cnPhone: /^(\d{3,4}-)\d{7,8}(-\d{1,6})?$/,
    /**
     * 手机号码校验规则
     * @type RegExp
     */
    mobile: /^1[3458]\d{9}$/,
    cnMobile: /^1\d{10}$/, //for Compatible
    /**
     * 日期校验规则
     * @type RegExp
     */
    date: /^\d{4}\-[01]?\d\-[0-3]?\d$|^[01]\d\/[0-3]\d\/\d{4}$|^\d{4}年[01]?\d月[0-3]?\d[日号]$/,
    /*
     * 字符型校验规则
     * @type RegExp
     */
    string: /\d$/,
    /*
     * 整数型校验规则
     * @type RegExp
     */
    integer: /^[1-9][0-9]*$/,
    /*
     * 数值型校验规则
     * @type RegExp
     */
    number: /^[+-]?[1-9][0-9]*(\.[0-9]+)?([eE][+-][1-9][0-9]*)?$|^[+-]?0?\.[0-9]+([eE][+-][1-9][0-9]*)?$/,
    /*
     * 数值型校验规则
     * @type RegExp
     */
    numberWithZero: /^[0-9]+$/,
    /**
     * 金额
     * @type RegExp
     */
    money: /^\d+(\.\d{0,2})?$/,
    /*
     * 英文校验规则，检测是否只有英文
     * @type RegExp
     */
    alpha: /^[a-zA-Z]+$/,

    /*
     * 字符串中是否含有英文字母或者数字
     * @type RegExp
     */
    alphaNum: /^[a-zA-Z0-9_]+$/,
    /*
     * 支持字母数字-_
     * @type RegExp
     */
    betaNum: /^[a-zA-Z0-9-_]+$/,
    /*
     * 身份证
     * @type RegExp
     */
    cnID: /^\d{15}$|^\d{17}[0-9a-zA-Z]$/,
    /*
     * url校验规则
     * @type RegExp
     */
    urls: /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,

    /**
     * url 不带http或者https
     * @type RegExp
     */
    url: /^(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
    /*
     * 中文校验规则
     * @type RegExp
     */
    chinese: /^[\u2E80-\uFE4F]+$/,
    /*
     * 邮政编码校验规则
     * @type RegExp
     */
    postal: /^[0-9]{6}$/,
    /**
     * 月历
     * @type RegExp
     */
    mutiYYYMM: /(20[0-1][0-9]((0[1-9])|(1[0-2]))[\,]?)+$/,
    /**
     * 支付宝账户真实姓名
     * @type RegExp
     */
    name: /^([\u4e00-\u9fa5|A-Z|\s]|\u3007)+([\.\uff0e\u00b7\u30fb]?|\u3007?)+([\u4e00-\u9fa5|A-Z|\s]|\u3007)+$/,
    //name: /^([\u4e00-\u9fa5|A-Z|\s])+([\.\uff0e\u00b7\u30fb]?)+([\u4e00-\u9fa5|A-Z|\s])+$/
    //name: /^([\u4e00-\u9fa5|A-Z|\s])+([\.\uff0e\u00b7\U30FB]?)+([\u4e00-\u9fa5|A-Z|\s])+$/
    //name: /^([\u4e00-\u9fa5|A-Z]+\s*[.\uff0e\ub7]?\s*)+[\u4e00-\u9fa5|A-Z]$/

    /**
     * 最小值
     * @type Function
     * @param {Node} $ele 表单项.
     * @param {Number} min 最小值.
     * @return {Boolean} 是否通过验证.
     */
    minValue: function($ele, min) {
        return parseFloat($ele.attr('value')) >= min;
    },

    /**
     * 最大值
     * @type Function
     * @param {Node} $ele 表单项.
     * @param {Number} min 最大值.
     * @return {Boolean} 是否通过验证.
     */
    maxValue: function($ele, max) {
        return parseFloat($ele.attr('value')) <= max;
    },

    /**
     * 最小长度
     * @type Function
     * @param {Node} $ele 表单项.
     * @param {Number} min 最小长度.
     * @return {Boolean} 是否通过验证.
     */
    minLength: function($ele, min) {
        return $ele.attr('value').length >= min;
    },

    /**
     * 最大长度
     * @type Function
     * @param {Node} $ele 表单项.
     * @param {Number} min 最大长度.
     * @return {Boolean} 是否通过验证.
     */
    maxLength: function($ele, max) {
        return $ele.attr('value').length <= max;
    },

    /**
     * 值区间
     * @type Function
     * @param {Node} $ele 表单项.
     * @param {Number} min 最小值.
     * @param {Number} max 最大值.
     * @return {Boolean} 是否通过验证.
     */
    valueBetween: function($ele, min, max) {
        var val = $ele.attr('value');
        return val >= min && val <= max;
    },

    /**
     * 长度区间
     * @type Function
     * @param {Node} $ele 表单项.
     * @param {Number} min 最小长度.
     * @param {Number} max 最大长度.
     * @return {Boolean} 是否通过验证.
     */
    lengthBetween: function($ele, min, max) {
        var l = $ele.attr('value').length;
        return l >= min && l <= max;
    },

    /**
     * 必填选项
     * @type Function
     * @param {Node} $ele 表单项.
     * @return {Boolean} 是否通过验证.
     */
    required: function($ele) {
        var t = $ele.attr('type');
        switch (t) {
            case 'checkbox':
            case 'radio':
                var n = $ele.attr('name');
                var eles = $$('input[name=' + '"' + n + '"]', this.domNode);
                return $A(eles).some(function(item) {
                    return item.attr('checked');
                });
            default:
                var v = $ele.node.value;
                if (!$S(v).trim()) {return false;}
                return true;
        }
    },

    /**
     * post方式ajax验证
     * @type Function
     * @param {Node} $ele 表单项.
     * @param {string} url 校验请求url.
     * @param {Function} check 使用此函数从请求回来的json中解析出校验通过与否，必须返回布尔类型值。.
     * @param {Function} msg 使用此函数从请求回来的json中解析出错误提示信息。.
     * @param {string} domain 域.
     * @param {Function} makeData 使用此函数生成发送的数据，此函数必须返回object.
     * @return {Boolean} 是否通过验证.
     */
    post: function($ele, url, check, msg, domain, makeData) {
        $E.publish(this._getEventTopic('ajaxValidate', 'before'), [$ele]);
        var data = $ele.node.value;
        if( makeData ) {
            var pobj = makeData($ele);
        } else {
            var pobj = {};
            pobj[$ele.attr('name')] = data;
        }
        var that = this;
        var options = {
            success: function(json) {
                $E.publish(that._getEventTopic('ajaxValidate', 'after'), [$ele, check(json), msg(json), json]);
            },
            failure: function(json) {
                $E.publish(that._getEventTopic('ajaxValidate', 'after'), [$ele, check(json), msg(json), json]);
            },
            method: 'post',
            'format': 'json',
            data: pobj
        };
        domain && (options.api_url = domain);
        var ajax = new alipayHttpCore(url, options);
        ajax.call();
        return true;
    },

    /**
     * get方式ajax验证
     * @type Function
     * @param {Node} $ele 表单项.
     * @param {string} url 校验请求url.
     * @param {Function} check 使用此函数从请求回来的json中解析出校验通过与否，必须返回布尔类型值。.
     * @param {Function} msg 使用此函数从请求回来的json中解析出错误提示信息。.
     * @param {string} domain 域.
     * @param {Function} makeData 使用此函数生成发送的数据，此函数必须返回object.
     * @return {Boolean} 是否通过验证.
     */
    get: function($ele, url, check, msg, domain, makeData) {
        $E.publish(this._getEventTopic('ajaxValidate', 'before'), [$ele]);
        var data = $ele.node.value;

        if( makeData ) {
            var pobj = makeData($ele);
        } else {
            var pobj = {};
            pobj[$ele.attr('name')] = data;
        }
        url = $URI.setParams(url, pobj);
        var that = this;
        var options = {
            success: function(json) {
                $E.publish(that._getEventTopic('ajaxValidate', 'after'), [$ele, check(json), msg(json), json]);
            },
            failure: function(json) {
                $E.publish(that._getEventTopic('ajaxValidate', 'after'), [$ele, check(json), msg(json), json]);
            },
            method: 'get',
            'format': 'json'
        };
        domain && (options.api_url = domain);
        var ajax = new alipayHttpCore(url, options);
        ajax.call();
        return true;
    },

    /**
     * jsonp方式校验
     * @type Function
     * @param {Node} $ele 表单项.
     * @param {string} url 校验请求url.
     * @param {Function} check 使用此函数从请求回来的json中解析出校验通过与否，必须返回布尔类型值。.
     * @param {Function} msg 使用此函数从请求回来的json中解析出错误提示信息。.
     * @param {string} domain 域.
     * @param {Function} makeData 使用此函数生成发送的数据，此函数必须返回object.
     * @return {Boolean} 是否通过验证.
     */
    jsonp: function($ele, url, check, msg, domain, makeData) {
        $E.publish(this._getEventTopic('ajaxValidate', 'before'), [$ele]);
        var data = $ele.node.value;

        if( makeData ) {
            var pobj = makeData($ele);
        } else {
            var pobj = {};
            pobj[$ele.attr('name')] = data;
        }
        url = $URI.setParams(url, pobj);
        var that = this;
        var options = {
            success: function(json) {
                $E.publish(that._getEventTopic('ajaxValidate', 'after'), [$ele, check(json), msg(json), json]);
            },
            failure: function(json) {
                $E.publish(that._getEventTopic('ajaxValidate', 'after'), [$ele, check(json), msg(json), json]);
            },
            'format': 'jsonp'
        };
        domain && (options.api_url = domain);
        var ajax = new alipayHttpCore(url, options);
        ajax.call();
        return true;
    }
};
exports.ruleFactory = aralex.validator.RuleFactory;
