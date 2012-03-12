/**
 * @name arale.declare
 * @class
 * 更好的声明一个类,可以提供我们更多的选择.
 * @param {String} className 类的名称.
 * @param {Array | Object} parents 父类集合或单个父类.
 * @param {Object} proto 原型对象，此对象的所有方法和属性会混入到生成的类中.
 * @example
 * arale.declare("a.b.c", [aralex.Widget, aralex.View], {
 *      a: 1,
 *      b: 2,
 *      method1: function()
 * });
 */
/*
TOOD
1.namespace,用户声明的class可以是a.b.c这样的形式.
2.多重继承,第一个是我们的父类,如果有多个的话,是混入,目前的混入规则是,只混入当前类不存在的方法,如果当前类存在,则当前类的方法其作用。
3.我们需要给用户提供prototype的机会,也就是我们需要给我们类提供默认的内容
4.支持在子类中调用父类的方法！(可能需要后续完成,目前做的比较不智能,需要手动指定需要调用父类方法的名字)
目标:
1.声明一个类,然后可以指定他的负类,而且支持多重继承,其中后面的会覆盖前面的,默认此类的parent是第一个继承的类,其实后来的那几个可以认为是混入。
2.期望的形式 arale.declare('alipay.pay',[parent,mixind],{
    //本类的prototype
})
*/
var arale = window.arale || require('arale.base');

arale.module('arale.declare', function() {
    var a = arale, contextStack = [];
    var safeMixin = function() {
        var baseClass = arguments[0], clazzs = [].slice.call(arguments, 1);
        for (var i = 0, len = clazzs.length; i < len; i++) {
            var clazz = clazzs[i];
            a._mixin(baseClass.prototype, clazz.prototype);
        }
    };
    var getPpFn = function(couns, fn, fnName) {
        var superCouns = couns.superCouns, superProto = superCouns.prototype;
        if (fn !== superProto[fnName]) {
            return superProto[fnName];
        } else {
            return getPpFn(superCouns, fn, fnName);
        }
    };
    var getFnName = function(couns, fn) {
        if (fn.fnName) {
            return fn.fnName;
        }
        var fnName = $H(couns.prototype).keyOf(fn);
        if (fnName == null) {
            return getFnName(couns.superCouns, fn);
        }
        fn.fnName = fnName;
        return fnName;
    };
    var ConstructorFactory = function(className, parents, proto) {
        var current = a.namespace(className), parent = null;
        var couns = function() {
            this.declaredClass = className;
            this.init && this.init.apply(this, arguments);
            this.create && this.create.apply(this, arguments);
        };
        if (parents && arale.isArray(parents)) {
            parent = parents.shift();
        } else {
            parent = parents;
        }
        parent && a.inherits(couns, parent);
        a.augment(couns, proto);
        couns.prototype.parent = function() {
            var couns = this.constructor;
            var fn = arguments[0].callee;
            var fnName = getFnName(couns, fn);
            fn = getPpFn(couns, fn, fnName);
            return fn.apply(this, arguments[0]);
        };
        if (parents && parents.length > 0) {
            safeMixin.apply(null, [couns].concat(parents));
        }
        current._parentModule[current._moduleName] = couns;
    };
    module.exports = ConstructorFactory;
    return ConstructorFactory;
}, '$Declare');
