/**
 * @name arale.nodelist
 * @class
 * 操作Node类型集合，可以直接对用选择器选择出的Node集合进行添加类绑定事件等。目前的实现是，将Array和Node所有的方法混入
 * @author <a href="mailto:shuai.shao@alipay.com">Shawn</a>
 * @param {Array} arr  需要封装的Node数组对象
 * @example
 * $NodeList([$("a"), $("b")]); 
 * @returns {arale.nodelist} 返回NodeList
 */
arale.module("arale.nodelist", (function(){
    var nodelist = function(list) {
        this.arr = list;
        //this = list;
        this.Arr = $A(list);
    };
    arale.augment(nodelist, {
        item: function(i) {
            return this.arr[i];
        },

        size: function() {
            return this.Arr[0].length;
        }
    });

    var NP = $Node.fn,  //Node prototype
        AP = $A.fn,     //Array prototype
        NLP = nodelist.prototype;   //NodeList prototype

    //把所有的Node的方法混入到NodeList中
    for(var i in NP) {
        if(!arale.isFunction(NP[i])) {continue;}
        NLP[i] = attachToNode(i);
    }

    function attachToNode(i) {
        return function() {
            var args = arguments;
            this.each(function(v){
                NP[i].apply(v, args);
            });
            return this;
        };
    }

    //将所有的CArray的方法混入到NodeList中
    for(var fn in AP) {
        if(arale.isFunction(AP[fn])) {
            NLP[fn] = attachToArray(fn);
        }
    }

    function attachToArray(fn) {
        return function() {
            return this.Arr[fn].apply(this.Arr, arguments);
            //return this;
        };
    }


    var NodeListFactory = function(list) {
        return new nodelist(list);
    };

    NodeListFactory.fn = nodelist.prototype;
    return NodeListFactory;
}), '$NodeList');
//NL=$NodeList;
