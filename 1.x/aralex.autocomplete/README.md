Overview
========

`aralex.autocomplete.AutoComplete`是自动提示组件. 主要功能是用户输入内容, 程序根据用户输入的内容以下拉列表的形返回一系列数据, 用户可以根据提示来选择需要的数据. 
选择的方式支持

1. 键盘上下翻动并回车选择需要的内容
2. 鼠标滑动点击选择需要的内容

Usage
=====


AutoComplete 主要有以下两种使用方式.

一.直接初始化, 这个主要用在数据相对简单, 默认的模版可以胜任的情况下.我们可以按照模版对数据的要求提供数据源即可.

二.继承. 用户需要提供自己的模版, 还有相应的数据源. 还有几个方法可能根据需求需要覆盖, 下面在介绍API的时候会提到.


源代码示例
一. 直接初始化方式

     $Loader.use('aralex.autocomplete', function() {
                
            var autocomplete = new aralex.autocomplete.AutoComplete({
                textInput: $('textinput'),
                datasource: {
                    getData: function(inputValue, callback) {
                        var data = [];
                        if ($S(inputValue).trim().length == 0) {
                            data = [{value: '请输入数据'}];
                        } else {
                            console.log("ds get data---->");
                            for (var i = 0; i < 10; i++) {
                                data[i] = {value: inputValue+i};
                            }
                        }
                        callback.call(null, data);
                    }
                }
            });
    });

二. 继承方式

//@$Loader.css;
arale.declare('staticsys.ModuleSearch', [aralex.autocomplete.AutoComplete], {
    /**
     * 这个是提示容器的className
     */
    scClassName: 'suggest_c',
    /**
     * 这个是选中的className
     */
    ssClassName: 'suggest_s',
    /**
     * 这个是提示条目的className
     */
    soClassName: 'suggest_o',

    templateString: @template('autocomplete.tpl'),

    datasource: datasource, //(可以在后面的代码初始化这个对象)
    selectEvent: function(target) {
    
    },
    change: function(value) {
    
    }
});
    
Configuration
=============

*   datasource - Object 

    autocomplete需要的数据源, 这个对象只需要提供一个getData方法即可, 第一个参数是用户输入的值, 第二个参数是数据获取后的回调函数. 当根据用户输入的数据得到数据后,然后通过这个回调函数和autocomplete进行交互.

*   textInput - Node

    需要触发autocomplete的输入框.

*   scClassName - String

    提示容器的className.

*   ssClassName - String

    选中条目的className.

*   soClassName - String
    
    提示条目的className.

*   templateString - @template
    
    用户自定义的模版, 当继承组件的时候使用, 格式类似与 templateString: @template('autocomplete.tpl').


Methods
=======

*   .getValueByItem(item)
    
    根据用户选中的item返回自己需要的值. 这个使用继承的方式是必须进行覆盖的, 因为根据业务的不同, 从item中提取的内容也不一样

*   .selectEvent(item)

    当用户选中一项时, 会触发此方法.选中值的是回车和点击, 上下和鼠标移动选择并不会触发此事件

*   .change(value)
    
    当用户选择内容改变时, 会触发此方法. 包括键盘上下和回车, 点击, 不包括鼠标滑动
    
*   .createSuggestions(data):
    创建提示框, 用户可以根据不同的情况覆盖此方法, 进行不同的处理
    data 用来渲染suggestion的数据

*   .hideSuggestContainer()
    隐藏suggestion容器

*   .showSuggestContainer()
    显示suggestion容器
