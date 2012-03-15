/**
 * @name aralex.View
 * @class
 * 这个组件主要是用来对组件的展现进行控制的,目前就先放2个方法,show,hide 
 * @author hui.kang@alipay.com
 * @example
*/
var arale = require('arale.base');
var declare = require('arale.class');
var $Aspect = require('arale.aspect');
var $A = require('arale.array');
var $Node = require('arale.dom').$Node;
var $E = require('arale.event');

exports.View = arale.declare('aralex.View',null, {
    /** @lends aralex.View.prototype */
	show: function(){
		this.domNode && $Node(this.domNode).setStyle("display", "block");
	},
	hide: function(){
		this.domNode && $Node(this.domNode).setStyle("display", "none");
	}
});
