version 1.1
===========

*   2011/11 主干道项目中修复jsonp请求中超时设置，不适用onreadystatechange，在回调中重置标记位以标明回调成功。
*   2011/11/28 Ajax.post和Ajax.jsonp也加上和Ajax.get一样的可以第二个参数传入成功回调，第三个参数delay可以延后send函数的执行。
*   2011/11/03 把jsonp里的charset加上，如果在options里传入charset，那么设置script标签的charset，否则不设置。
*   ajax 增加超时设置
*   ajax 增加feature: 当超时时调用failure函数。2011/09/21
*   jsonp 修复无故abort的bug，原因是ie6下Node类型对script设置属性失败。2011/09/21
