
玉伯负责


## oo选型

oo选择类似mootools的风格，oo为独立模块`arale.class`

* 接口名：Class.create(prop)
* prop：`Extends`   继承 Object
* prop：`Implements`     混入 Object/Array
* prop：`initialize`        构造函数 Function
* 返回：Function
	* 方法：superclass     父类的引用 Object
	* 方法：implement     混入 Object/Array
* 规范化初始化参数的方式


### 例子:

     var Class = require('class')
     var klass = Class.create({
          Extends: a,
          Implements: [b, c],
          initialize: function(args){
               this.attrs = $.extend({},klass.defaults, args);
               this.superclass.initialize();
          },
          method: function(){}
     });

     klass.implement([d, e]);

     klass.defaults = {
          param1 : 1
     };
