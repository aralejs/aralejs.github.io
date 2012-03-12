Overview
========

`arale.string`字符串操作模块，封装字符串并提供trim, clean, escapeHTML等方法。

**`arale.string`是arale core的一部分**


Usage
======

源代码示例
    S(' i am arale.string').trim(); // return 'i am arale.string';
API
=======

*   trim()
    清除前后空格

*   trimLeft()
    清除左边空格

*   trimRight()
    清除右边空格

*   clean()
    清除前后无关空白符，如\n,\t

*   camelCase()
    合并横杠字符串并返回驼峰格式

*   hyphenate()
    驼峰字符串转换为“-”连接

*   escapeRegExp()
    转义字符串中的所有正则字符
    
*   toInt(base) base{可选，默认10}
    字符串转化成整数

*   toFloat()
    字符串转化成浮点数

*   stripScripts(option, override) option{Boolean||Function,为true执行script,为function执行override} override{Function,可选,参数[script|text]}
    过滤script并返回字符串。

*   substitute(object, regexp) object{待替换的数据对象} regexp{可选, 描述占位符的正则表达式 默认"/\${([^}]+)}/g"}
    字符串关键字替换。

*   urlEncode()
    对字符串进行urlEncode

*   urlDecode()
    对字符串进行urlDecode

*   escapeHTML()
    对字符串进行html转义
    
*   unescapeHTML()
    对字符串进行html反转义

*   contains(string, separator) string{需要搜索的字符} separator{可选，带分隔符搜索}
    检测是否包含相关字符
    
*   rep(num, text) num{Number, 重复次数} text{可选，需要重复的字符串}
    根据指定次数重复字符串
    
*   pad(size,ch,end) size{Number, 目标长度} ch{可选，被填充的字符} end{可选，true为右填充}
    根据指定字符串填充一个字符串，使其到指定长度

*   capitalize()
    每个词的首字母大写
    
*   pad(size,ch,end) size{Number, 目标长度} ch{可选，被填充的字符} end{可选，true为右填充}
    根据指定字符串填充一个字符串，使其到指定长度。



    
    


