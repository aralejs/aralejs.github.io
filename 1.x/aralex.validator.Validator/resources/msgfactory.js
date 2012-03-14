arale.namespace('aralex.validator.MsgFactory');

/**
 * 校验错误信息工厂，是aralex.validator.Validator组件的辅助类，用来管理校验错误信息。
 * @author <a href="mailto:shuai.shao@alipay.com">邵帅</a>
 */
aralex.validator.MsgFactory = function() {};

/**
 * 获取错误信息
 * @param {string} name 错误信息名称，与校验规则名称一致。.
 * @return {string | Function} 用于生成错误提示信息的字符串或者函数.
 */
aralex.validator.MsgFactory.getMsg = function(name) {
    return aralex.validator.MsgFactory.msgs_[name];
};

/**
 * 设置错误提示信息
 * @param {string} name 错误信息名称，与校验规则名称一致。.
 * @param {string | Function} msg 用于生成错误提示信息的字符串或者函数.
 * @param {boolean=} opt_override 是否覆盖已存在的msg.
 */
aralex.validator.MsgFactory.setMsg = function(name, msg, opt_override) {
    if (aralex.validator.MsgFactory.msgs_[name] == undefined || opt_override) {
        aralex.validator.MsgFactory.msgs_[name] = msg;
    }
};

/**
 * 校验规则错误信息，私有属性，必须通过get,set方法访问
 * @type {Object}
 * @private
 */
aralex.validator.MsgFactory.msgs_ = {
    /**
     * number错误提示信息
     * @type {string}
     * @default '%s必须为数字。'
     */
    number: '%s必须为数字。',
    /**
     * betaNum错误提示信息
     * @type {string}
     * @default '%s只能包含数字、字母、下划线和横杠。'
     */
    betaNum: '%s只能包含数字、字母、下划线和横杠。',
    /**
     * email错误提示信息
     * @type {string}
     * @default '%s格式不正确。'
     */
    email: '%s格式不正确。',
    /**
     * money错误提示信息
     * @type {string}
     * @default '%s必须为整数或小数，小数点后不超过2位。'
     */
    money: '%s必须为整数或小数，小数点后不超过2位。',
    /**
     * numberWithZero错误提示信息
     * @type {string}
     * @default '%s必须为数字。'
     */
    numberWithZero: '%s必须为数字。',
    /**
     * chinese错误提示信息
     * @type {string}
     * @default '%s必须为汉字。'
     */
    chinese: '%s必须为汉字。',
    /**
     * cnMobile错误提示信息
     * @type {string}
     * @default '手机号码格式有误，是11位数字，且是13，15，18开头。'
     */
    cnMobile: '手机号码格式有误，是11位数字，且是以13，14，15，18开头。',
    /**
     * name错误提示信息
     * @type {string}
     * @default '%s只能含汉字、大写字母、符号中的空格和点，且至少两个字。'
     */
    name: '%s只能含汉字、大写字母、符号中的空格和点，且至少两个字。',
    /**
     * maxLength错误提示信息
     * @type {string}
     * @default '%s长度不能超过%s。'
     */
    maxLength: '%s长度不能超过%s。',
    /**
     * minLength错误提示信息
     * @type {string}
     * @default '%s长度不能小于%s。'
     */
    minLength: '%s长度不能小于%s。',
    /**
     * maxValue错误提示信息
     * @type {string}
     * @default '%s数值不能大于%s。'
     */
    maxValue: '%s数值不能大于%s。',
    /**
     * minValue错误提示信息
     * @type {string}
     * @default '%s数值不能小于%s。'
     */
    minValue: '%s数值不能小于%s。',
    /**
     * lengthBetween错误提示信息
     * @type {string}
     * @default '%s长度必须在%s到%s之间'
     */
    lengthBetween: '%s长度必须在%s到%s之间。',
    /**
     * valueBetween错误提示信息
     * @type {string}
     * @default '%s数值必须在%s到%s之间'
     */
    valueBetween: '%s数值必须在%s到%s之间。',
    /**
     * required错误提示信息
     * @type {string}
     * @default '%s不能为空。'
     */
    required: '%s不能为空。',
    /**
     * requiredText错误提示信息
     * @type {string}
     * @default '请填写%s。'
     */
    requiredText: '请填写%s。',
    /**
     * requiredRadio错误提示信息
     * @type {string}
     * @default '请选择%s。'
     */
    requiredRadio: '请选择%s。',
    /**
     * requiredSelect错误提示信息
     * @type {string}
     * @default '请选择%s。'
     */
    requiredSelect: '请选择%s。',
    /**
     * requiredCheckbox错误提示信息
     * @type {string}
     * @default '请选择%s。'
     */
    requiredCheckbox: '请选择%s。'

    /*
     example:function($ele, desc, args1, args2) {
     return "哈哈";
 }
 */
};
exports.MsgFactory = aralex.validator.MsgFactory;
