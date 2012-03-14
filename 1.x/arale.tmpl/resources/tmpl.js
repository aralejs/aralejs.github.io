(function(){
  var cache = {};
  
  exports.tmpl = arale.tmpl = function tmpl(str, data, opt_context){
    //获取模版
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        arale.tmpl(document.getElementById(str).innerHTML) :
      
      //生成一个可重复执行的函数来服务与我们的模版引擎,我们将通过缓存来保存它
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
        
        //使用with把我们的data引入到我们的局部scope中
        "with(obj){p.push('" +
        
        // Convert the template into pure JavaScript
		//把模版转换成我们的可执行的javascript代码
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
    
    // 如果用户可能根据数据的不同,反复要用到模版,我们可以给用户提供这样的机会
    return data ? fn.call(opt_context || window, data) : fn;
  };
})();
