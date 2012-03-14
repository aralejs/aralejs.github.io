Overview
========
`arale.tmpl` 是一个简单的模版替换程序, 可以使我们使用规定的模版语言来写代码, 然后通过提供数据来渲染成我们需要的html片段. 这个模块主要用来我们组件中包含模版的地方. 也可以用于一些简单的场景, 具体看下面的代码使用.


Configuration
=============

没有什么需要配置的地方, 直接使用即可!


Usage
=====

具体的使用我们还是看例子吧!接着上面的那个例子来


源代码示例
=====

示例一:
var tpl1 = "name: <%=name%>, age: <%=this.age%>";
console.log(arale.tmpl(tpl1, {
    name: 'arale'
}, {
    age: 1
}));

示例二:

var tpl2 = "modules: <% for (var i=0;i<items.length;i++) {%> module:<%=items[i]%>  <%}%>";

console.log(arale.tmpl(tpl2, {
    items: ['arale', 'event', 'class', 'dom']
}));


API
=====

*   arale.tmpl(str, data, opt_context);

    str模版字符串, data需要用来渲染模版的数据, opt_context在模版里面的this 
