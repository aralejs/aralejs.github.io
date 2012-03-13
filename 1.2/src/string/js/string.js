/**
 * @name arale.string
 * @class
 * @param {String} str 要封装的字符串
 * @returns {CString} 封装后的字符串
 * 字符串操作模块，提供trim、clean等众多对字符串操作的功能函数
 */
define(function(require, exports, module) {

  var arale = require('base');

  var _encodeUriRegExp = /^[a-zA-Z0-9\-_.!~*'()]*$/;
  var _amperRe = /&/g;
  var _ltRe    = /</g;
  var _gtRe    = />/g;
  var _quotRe  = /\"/g;
  var _allRe   = /[&<>\"]/;

  var character = {
    '<':'&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;'
  };
  var entity = {
    quot: '"',
    lt:   '<',
    gt:   '>'
  };

  var CString = arale.dblPrototype("",function(strr){
    this.str = strr;
    this.length = strr.length;
  });

  arale.augment(CString,
      /** @lends arale.string.prototype */
      {

        /**
         * 去除前后空格
         * @code
         * $S("   I love mac  ").trim(); // return "I love mac"
         * @returns {String}
         */
        trim: function(){
          var str = this.str.replace(/^\s+/,'');
          for(var i= str.length - 1; i >= 0; i--){
            if(/\S/.test(str.charAt(i))){
              str = str.substring(0,i+1);
              break;
            }
          }
          return str;
        },

        /**
         * 去除前后无相干的空白符如:\n \t引起的空行
         * @example
         * $S('   I love mac  \n\n).clean(); // return "I love mac"
         * @returns {String}
         */
        clean: function(){
          return this.trim(this.str.replace(/\s+/g, ' '));
        },

        /**
         * 合并用横杠分隔的字符串并驼峰风格
         * @example
         * $S("i-love-you").camelCase(); // return "ILoveYou"
         * @returns {String}
         */
        camelCase: function(){
          var str = this.str.replace(/-\D/g, function(match){
            return match.charAt(1).toUpperCase();
          });
          return str;
        },

        /**
         * 将驼峰风格的支付串用"-"分隔
         * @example
         * $("iLoveYou").hyphenate(); // return "I-love-you"
         * @returns {String}
         */
        hyphenate: function(){
          var str = this.str.replace(/[A-Z]/g, function(match){
            return ('-' + match.charAt(0).toLowerCase());
          });
          return str;
        },

        /**
         * 将字符串转化成正则格式
         * @example
         * $S("animals.sheep[1]").escapeRegExp(); // return "animals\.sheep\[1\]"
         * @returns {String}
         */
        escapeRegExp: function(){
          return this.str.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
        },

        /**
         * 将字符串转化成整数
         * @param {base, 可选, 默认10} base 数字类型
         * @example
         * $S("1em").toInt(); // return 1
         * $S("10px").toInt(); // return 10
         * $S("100.00").toInt(); // return 100
         * @returns {Number}
         */
        toInt: function(base){
          return parseInt(this.str, base || 10);
        },

        /**
         * 将字符串转化成浮点数
         * @example
         * $S("99.9%").toFloat(); // return 99.9
         * $S("100.11").toFloat(); // return 100.11
         * @returns {Number}
         */
        toFloat: function(){
          return parseFloat(this.str);
        },

        /**
         * 将颜色值转换成RGB格式
         * @param {Boolean} array 是否已数组格式返回
         * @example
         * $S("#123").hexToRgb(); // return "rgb(17,34,51)"
         * $S("112233").hexToRgb(); // return "rgb(17,34,51)"
         * $S("#112233").hexToRgb(true); // return [17, 34, 51]
         * @returns {String || Array}
         */
        hexToRgb: function(array){
          var hex = this.str.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
          return (hex) ? $A(hex.slice(1)).hexToRgb(array) : null;
        },

        /**
         * 将RGB转换成对应的颜色值
         * @param {Boolean} array 是否已数组格式返回
         * @example
         * $S("rgb(17,34,51)").rgbToHex(); // return "#112233"
         * $S("rgb(17,34,51)").rgbToHex(true); // return ["11","22","33"];
         * $S("rgba(17,34,51)").rgbToHex(); // return "transparent"
         * @returns {String || Array}
         */
        rgbToHex: function(array){
          var rgb = this.str.match(/\d{1,3}/g);
          return (rgb) ? $A(rgb).rgbToHex(array) : null;
        },

        /**
         * 将rgb 或者 "#xxx" 转换成 "#xxxxxx"
         * @param {String} co 异常情况下返回的值
         * @example
         * $S('#fff').parseColor();  //return '#ffffff'
         * $S('#ff2').parseColor('#ffffff'); //return '#ffffff'
         * @returns {String} 返回自生或者指定值
         */
        parseColor: function(co){
          if (this.str.slice(0,4) == 'rgb('){
            var color = this.rgbToHex();
          }else{
            var color = '#';
            if (this.str.slice(0,1) == '#') {
              if (this.str.length==4) for(var i=1;i<4;i++) color += (this.str.charAt(i) + this.str.charAt(i)).toLowerCase();
              if (this.str.length==7) color = this.str.toLowerCase();
            }
          }
          return (color.length==7 ? color : ($S(co) || this.str));
        },
        /**
         * 过滤script并返回剩余的字符串
         * @param {Function || Boolean, 可选} option 执行script程序，或者返回函数调用
         * @example
         * var str = $S("<script>var a = 1; alert_(1);</script> this is a test");
         * str.stripScripts(); // alert(1) then return "this is a test"
         * str.stripScripts(function(sc,txt){
         *    alert(sc) //return "var a = 1; alert(a)"
         *    alert(txt) //return "this is a test"
         * });
         * @returns {String}
         */
        stripScripts: function(option, override){
          var scripts = '';
          var text = this.str.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(){
            scripts += arguments[1];
            return '';
          });
          if (option === true){
            arale.exec(scripts);
          }else if (typeof(option) == 'function'){
            option.call(override, scripts, text);
          }
          return text;
        },

        /**
         * 字符串中的占位符替换
         * @param {Object} object 待替换的数据对象
         * @param {Regexp, 可选} regexp 描述占位符的正则表达式 默认"/\?{([^}]+)}/g"
         * @example
         * var myString = $S("{subject} is {property_1} and {property_2}.");
         * var myObject = {subject: 'Jack Bauer', property_1: 'our lord', property_2: 'savior'};
         * myString.substitute(myObject); //Jack Bauer is our lord and savior
         * @returns {String}
         */
        substitute: function(object, regexp){
          var str = this.str.replace(regexp || (/\$\{([^}]+)\}/mg), function(match, name){
            //if (match.charAt(0) == '$') return match.slice(1);
            return (object[name] != undefined) ? object[name] : '';
          });
          return str;
        },

        /**
         * 清除左边空格
         * @example
         * var str = $S("  this is a example");
         * str.trimLeft(); //return "this is a example"
         * @returns {String}
         */
        trimLeft: function(){
          return this.str.replace(/^[\s\xa0]+/, '');
        },

        /**
         * 清除右边空格
         * @example
         * var str = "  this is a example   ";
         * str.trimRight(); //return "  this is a example"
         * @return {String}
         */
        trimRight: function(){
          return this.str.replace(/[\s\xa0]+$/, '');
        },

        /**
         * 对字符串进行urlEncode
         * @example
         * var str = $S(" . 我 this is a example");
         * str.urlEncode(); //return "%20.%20%E6%88%91%20this%20is%20a%20example"
         * @returns {String}
         */
        urlEncode: function(){
          this.str = String(this.str);
          if (!_encodeUriRegExp.test(this.str)) {
            return encodeURIComponent(this.str);
          }
          return this.str;
        },

        /**
         * 对字符串进行urlDecode
         * @example
         * var str = $S("%20.%20%E6%88%91%20this%20is%20a%20example");
         * str.urlDecode(str); //return " . 我 this is a example"
         * @returns {String}
         */
        urlDecode: function() {
          return decodeURIComponent(this.str.replace(/\+/g, ' '));
        },

        /**
         * 对字符串进行html转码
         * @example
         * var str = $S("<html><body>Go Go");
         * str.htmlEscape(str); //return "&lt;html&gt;&lt;body&gt;Go Go"
         * @returns {String}
         */
        escapeHTML: function() {
          if (!_allRe.test(this.str)) return this.str;

          if (this.str.indexOf('&') != -1) {
            this.str = this.str.replace(_amperRe, '&amp;');
          }
          if (this.str.indexOf('<') != -1) {
            this.str = this.str.replace(_ltRe, '&lt;');
          }
          if (this.str.indexOf('>') != -1) {
            this.str = this.str.replace(_gtRe, '&gt;');
          }
          if (this.str.indexOf('"') != -1) {
            this.str = this.str.replace(_quotRe, '&quot;');
          }
          return this.str;
        },

        /**
         * 反转义HTML
         * @param {String} str 需要操作的字符串
         * @example
         * var str = $S("&lt;html&gt;&lt;body&gt;Go Go");
         * str.unescapeHTML(); //return "<html><body>Go Go"
         * @returns {String}
         */
        unescapeHTML: function() {
          if(!this.trim().length) return this.str;
          return this.str.replace(/&([^;]+);/g, function(s, entity) {
            switch (entity) {
              case 'amp':
                return '&';
              case 'lt':
                return '<';
              case 'gt':
                return '>';
              case 'quot':
                return '"';
              default:
                if (entity.charAt(0) == '#') {
                  // Prefix with 0 so that hex entities (e.g. &#x10) parse as hex.
                  var n = Number('0' + entity.substr(1));
                  if (!isNaN(n)) {
                    return String.fromCharCode(n);
                  }
                }
                // For invalid entities we just return the entity
                return s;
            }
          });
        },
        /**
         * 监测是否包含相关字符
         * @param {String} string 需要搜索的字符
         * @param {String|可选} separator 分隔符 (如element中的className用空格分隔)
         * @example
         *
         * @returns {Boolean}
         */
        contains: function(string, separator){
          return (separator) ? (separator + this.str + separator).indexOf(separator + string + separator) > -1 : this.str.indexOf(string) > -1;
        },

        /**
         * 根据指定次数重复字符串
         * @param {Number} num 需要重复的次数
         * @example
         * var str = $S("***");
         * str.rep(str,3); //return "*********"
         * @returns {String}
         */
        rep: function(num, text){
          if(text) this.str=text;
          if(num <= 0 || !this.str){ return ""; }
          var buf = [];
          for(;;){
            if(num & 1){
              buf.push(this.str);
            }
            if(!(num >>= 1)){ break; }
            this.str += this.str;
          }
          return buf.join("");    // String
        },

        /**
         * 通过我们给定的备选字符去填充一个字符串，确保他的长度至少是我们指定的长度，默认是在前面填充
         * @param {Number} times 需要被填充到的长度
         * @param {String||可选} ch  被填充的字符，
         * @param {Boolean||可选} end 如果是后填充，为true
         * @example
         * var str = $S("abc");
         * str.pad(7,"*"); //return "****abc"
         * str.pad(7,"*",true); //return "abc***"
         * @returns {String}
         */
        pad: function(size,ch,end){
          if(!ch){
            ch = '0';
          }
          var out = String(this.str);
          var pad = this.rep(Math.ceil((size-out.length) / ch.length),ch);
          return end ? (out + pad) : (pad + out);
        },

        /**
         * 将每个词的首字母大写
         * @example
         * $S("i like cookies").capitalize(); //return "I Like Cookies"
         * @returns {String}
         */
        capitalize: function(){
          var str = this.str.replace(/\b[a-z]/g, function(match){
            return match.toUpperCase();
          });
          return str;
        },
        /**
         * full- width to half-width
         * @param {String} both, left, right, all;
         * * @example
         * 'ａｂｃ'.ftoh(); //return abc
         * @returns {String}
         */
        ftoh: function(isTrim) {
          var result = "", str, c, isTrim = isTrim || 'both';
          switch(isTrim) {
            case 'all':
            case 'both':
              str = this.trim();
              break;
            case 'left':
              str = this.trimLeft();
              break;
            case 'right':
              str = this.trimRight();
              break;
            default:
              str = this.str;
          }
          for (var i = 0, len = str.length; i < len; i++){
            c = str.charCodeAt(i);
            if (c == 12288) {
              if (isTrim != 'all') {
                result += String.fromCharCode(c - 12256);
              }
              continue;
            }
            if (c > 65280 && c < 65375) {
              result += String.fromCharCode(c - 65248);
            } else {
              if (c == 32 && isTrim == 'all') {
                continue;
              }
              result += String.fromCharCode(str.charCodeAt(i));
            }
          }
          return result;
        }
      });
  CString.prototype['toString'] = function(){
    return this.str;
  };
  var StringFactory = function(strr){
    return new CString(strr);
  }
  StringFactory.fn = CString.prototype;

  module.exports = window.S = StringFactory;

});
