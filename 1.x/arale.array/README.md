Overview
=========

`arale.array`是数组处理模块。

Usage
======

使用全局函数`A()`或者`arale.array()`将一个原生的数组转换成封装数组对象，从而获得丰富的操作。

通过arr属性可以访问原生数组对象。

例如

    A([1, 2, 3]).each(function(value, index, arr) {
        //your code here
    });

    A([1, 2, 3, -1]).filter(function(value, index, arr) {
        return value < 0;
    });

    var obj = A([1, 2, 3]);
    console.log(obj.arr) //通过arr属性访问原生数组
