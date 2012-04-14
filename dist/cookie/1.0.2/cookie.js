(function(factory) {

  if (typeof define === 'function') {
    define('#cookie/1.0.2/cookie', [], factory);
  }
  else if (typeof exports !== 'undefined') {
    factory(require, exports);
  }
  else {
    factory();
  }

})(function(require, exports) {

/*
 Cookie v1.0.2 | https://github.com/seajs/dew/tree/master/src/cookie | MIT Licensed
*/
(function(){function h(b){return typeof b==="string"}function m(b){if(!(h(b)&&b!==""))throw new TypeError("Cookie name must be a non-empty string");}function n(b){return b}var d;d=typeof exports!=="undefined"?exports:this.Cookie={};d.version="1.0.2";var j=decodeURIComponent,k=encodeURIComponent;d.get=function(b,a){m(b);var a=typeof a==="function"?{converter:a}:a||{},c=document.cookie,l=!a.raw,f={};if(h(c)&&c.length>0)for(var l=l?j:n,c=c.split(/;\s/g),e,d,i,g=0,k=c.length;g<k;g++){i=c[g].match(/([^=]+)=/i);
if(i instanceof Array)try{e=j(i[1]),d=l(c[g].substring(i[1].length+1))}catch(o){}else e=j(c[g]),d="";e&&(f[e]=d)}return(a.converter||n)(f[b])};d.set=function(b,a,c){m(b);var c=c||{},d=c.expires,f=c.domain,e=c.path;c.raw||(a=k(String(a)));b=b+"="+a;a=d;typeof a==="number"&&(a=new Date,a.setDate(a.getDate()+d));a instanceof Date&&(b+="; expires="+a.toUTCString());h(f)&&f!==""&&(b+="; domain="+f);h(e)&&e!==""&&(b+="; path="+e);c.secure&&(b+="; secure");return document.cookie=b};d.remove=function(b,a){a=
a||{};a.expires=new Date(0);return this.set(b,"",a)}})();


});
