/**
 * @name araleConfig
 * @namespace
 * Arale页面全局配置项
 */
//TODO这样有问题就是araleConfig不能只设置其中的部分,要么全提供,要么不提供
var _baseAraleConfig =
/** @lends araleConfig */
{
    /**
     * 是否开启debug模式
     * @type Boolean
     */
    debug: false,
    /**
     * combo 服务路径
     * @type String
     */
    combo_path: '/min/?b=ar&f=',
    css_combo_path: '/min/?b=al&f=',
    /**
     * combo 服务器地址
     * @type String
     */
    combo_host: 'localhost',
    /**
     * 静态js存放路径
     * @type String
     */
    module_path: '/arale-trunk',
    /**
     * 多语言设置
     * @type String
     */
    locale: 'zh-cn',
    /**
     * combo服务等待js队列的时间
     * @type String
     */
    waitTime: 100,
    /**
     * 在初始化的时候是否默认加载arale.corex
     * @type String
     */
    corex: false,
    /**
     * 是否依赖的是源文件,方便调试 
     * @type String
     */
	depSrc: false
};
if (window['araleConfig']) {
    //mixin
    (function() {
        for (var _name in _baseAraleConfig) {
            if (_baseAraleConfig.hasOwnProperty(_name) && !araleConfig.hasOwnProperty(_name)) {
                araleConfig[_name] = _baseAraleConfig[_name];
            }
        }
    }());
} else {
    var araleConfig = _baseAraleConfig;
}
