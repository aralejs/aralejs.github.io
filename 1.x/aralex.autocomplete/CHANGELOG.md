Version 1.3
============

*   对原有的Autocomplete进行了重构, 对逻辑, 数据, 显示进行了分离, 具体业务可以通过继承此组建来扩展自己的业务需求!

Version 1.4
============

*   fix如果返回数据为空的处理

*   增加一个选择项, 当用户选择到第一个向上, 最后一个向下的时候会选择到输入框

*	datasource.getData方法的this指向本组件

Version 1.5
============

*	postCreate里初始化_setPosition