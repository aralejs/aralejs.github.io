Overview
=======

`aralex.xbox`封装了日常我们使用的弹窗组件, 根据初始化内容的不同, 我们主要分为三类, IframeXbox, DomXbox, StringXbox. 大家可以根据弹窗内容的不同选择合适的弹窗.
大家在使用的时候可以到我们的http://arale.alipay.net:3000上面查看这个组件的详细信息, 最好每次有新的使用时,选择最新的版本.

Usage
=====

在`aralex.xbox` 是整个弹窗的模块名, 具体初始化需要找到对应的弹窗.下面简单演示下.具体的配置可以参看后面更具体的描述

源代码示例一
======


$Loader.use(['aralex.xbox.Xbox'],function(){

	var x1 =  new aralex.xbox.IframeXbox({
		el: 'fireIFRAME',
		width: 500,
		height: 200,
		value: "inner.html?q=11111",
		xboxClass: {
			MOCK_CLASS: 'test'
		}
	});

	var x2 = new aralex.xbox.DomXbox({
		//el: $$(".J_firedom"),
		el:'fireDOM',
		width: 500,
		beforeHide: function(){	
			alert("hidding...")
		},
		value: function(e) {
			return $('DOMToBeCopy');
		}
	});

	var x3 = new aralex.xbox.StringXbox({
		el: "fireString",
		value: "<div style=\"margin: 10px;padding: 20px;color: red\">big stringbig stringbig stringbig stringbig stringbig stringbig stringbig string</div>"
	});
});


上面分别初始化了3种类型的xbox.大家需要注意的就是el这个元素, 这个元素就是xbox触发点, 如果大家想通过手动触发的话, 就不需要传入这个元素了, 大家可以通过使用xbox的名字来显示xbox, 比如x.show();

Configuration
=============

在xbox的初始化中主要就是参数的配置, 下面就仔细给大家介绍下具体可配置的参数

*   closeLink       default: '<a href="#">关闭</a>'
    弹窗关闭链接的样式, 可以被覆盖.

*   el              default: "",
    触发弹窗的元素

*   value
    xbox中的具体内容, 根据不同类型的xbox,需要不同的内容, iframe就需要一个url, 而dom则需要一个dom元素, string则可以传递进去一个dom字符串.
    需要注意的是这个value可以支持不同的类型. 比如可以传入一个函数, 那么这个函数的返回结果作为value, 如果是dom的话, 则可以传入一个id, 或者css seleect(只会选择匹配的第一个元素)

*   width            default: 600
    默认的宽度

*   height:          default: "",
    默认的高度

*   maxWidth         default: 800,   
    最大宽度
    
*   maxHeight        default: 500,
    最大高度

*   beforeShow
    重要xbox显示前的回调触发函数, 就是显示前会执行此函数

*   afterShow
    重要xbox显示后的回调触发函数, 就是显示后会执行此函数

*   beforeHide
    重要xbox关闭按钮触发后, 在关闭前的回调触发函数, 就是在xbox关闭前执行此函数

*   afterHide
    重要xbox关闭按钮触发后, 在关闭后的回调触发函数, 就是关闭后会执行此函数

*   isOld: false,
    是否兼容老的xbox. 如果兼容的话, 会支持老版的xbox的一些特性, 比如 AP.widget.xBox.hide 这个方法支持, closeLink默认为空

API  PART-xbox
=============

*   xbox.show()
    显示xbox 

*   xbox.hide()
    隐藏xbox

