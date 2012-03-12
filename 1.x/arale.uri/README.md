Overview
========
`arale.uri` 是一个uri处理模块，其中包括等同Location相关的处理函数(hostname,pathname等)，可通过arale.uri，URI或$URI变量访问。

Configuration
=============

没有什么额外的配置, 直接使用即可

Usage
=====
示例一:

var url = 'http://www.alipay.com?buyid=123&product_id=321';
var params = {'pname':'shoues','pice':334};
url = arale.uri.setParams(url,params);
console.log(url); //输出 http://www.alipay.com/?buyid=123&product_id=321&pname=shoues&pice=334


var url  = 'http://www.alipay.com/user/getUser.json';
var path = arale.uri.getPath(url);
console.log(path) // 输出 /user/getUser.json

var url  = 'http://www.alipay.com:8080';
var path = arale.uri.getPort(url); 
console.log(path) // 输出 8080

var url  = 'http://www.alipay.com:8080';
var port = arale.uri.getHost(url); 
console.log(port); // 输出 'www.alipay.com:8080'

var url  = 'http://www.alipay.com';
var protocol = arale.uri.getProtocol(url); // return 'http'
console.log(protocol); // 输出 http

var url  = 'http://www.alipay.com';
var hostname = arale.uri.getHostName(url); 
console.log(hostname); //输出 www.alipay.com
         
var url  = 'http://www.alipay.com?name=fackweb&live=hangzhou';
var p1 = arale.uri.getParams(url); // return 'name=fackweb&live=hangzhou'
var p2 = arale.uri.getParams(url, true);
console.log(p1); //输出 name=fackweb&live=hangzhou
console.log(p2); //输出 { name="fackweb", live="hangzhou"}

var url = 'http://www.alipay.com?name=fackweb&live=hangzhou#abcd';
console.log(arale.uri.getHash(url)) ; // 输出 'abcd'
         

上面的方法都比较直观, 大家可以复制相应的代码去测试.

API 
=====

*   setParams(url, data)
    设置url请求参数, url 需要处理的url. data 需要设置的url参数。
    
*   getPath(url).
    获取url中path部分, url 需要处理的url

*   getPort(url).
    获取url端口, url 需要处理的url

*   getHost(url, nonedefaultport).
    设置或返回当前 URL 的主机名和端口, url 处理的url.  nonedefaultport 是否需要返回80端口

*   getProtocol(url).
    获取协议类型, url 需要处理的url

*   getHostName(url).
    设置或返回当前 URL 的主机名, url 处理的url

*   getParams(url, isobject)
    获取url的请求参数, url 处理的url. [isobject] 是否以object的格式返回

*   getHash(url){
    获取当前url的hash, url 要处理的url

常见问题
=====



