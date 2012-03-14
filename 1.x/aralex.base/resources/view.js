/**
 * @name aralex.View
 * @class
 * 这个组件主要是用来对组件的展现进行控制的,目前就先放2个方法,show,hide 
 * @author hui.kang@alipay.com
 * @example
*/
require('arale.base');
require('arale.class');
require('arale.aspect');
require('arale.tmpl');
require('arale.dom');


exports.View = arale.declare('aralex.View',null, {
    /** @lends aralex.View.prototype */
	show: function(){
		this.domNode && $Node(this.domNode).setStyle("display", "block");
	},
	hide: function(){
		this.domNode && $Node(this.domNode).setStyle("display", "none");
	}
});
