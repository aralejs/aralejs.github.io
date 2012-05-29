
# Overlay

对话框组件，提供对话框显示隐藏、dom结构自定义、定位、select遮挡、确定取消关闭等功能特性。

继承自arale.overlay组件。

---


## 模块依赖

 - [seajs](seajs/README.md)
 - [jquery](jquery/README.md)
 - [overlay](overlay/README.md)


## 配置说明

* `trigger` : {element}

    对话框触发点。

* `triggerType` : {string}

    对话框触发方式，可选 click|hover|focus ，默认为click。

* `confirmElement` : {element|$}

    确定或提交按钮。

* `cancelElement` : {element|$}

    取消按钮。

* `closeElement` : {element|$}

    关闭按钮。

* `titleElement` : {string}

    指定标题元素。

* `titleText` : {string}

    指定标题内容。

* `contentElement` : {string}

    指定内容元素。

* `content` : {string}

    指定内容的html。

* `onConfirm` : {function}

    确定时的操作，可在函数内使用this.activeTrigger得到触发节点，下同。

* `onClose` : {function}

    关闭时的操作。

* `hasMask` : {boolean}

    是否有背景遮罩层。

* `iframeUrl` : {string|function}

    内嵌iframe的url。

* `ajaxUrl` : {string|function}

    内容是ajax取得时，指定其来源地址。

* `showEffect` : {object}

    显示的动画效果，形式 { type: 'fade', duration: '200', easing: 'easeOut' } , 目前只支持淡入效果。 

* `hideEffect` : {object}

    隐藏时的动画效果，形式 { type: 'fade', duration: '200', easing: 'easeOut' } 


其他配置参照[overlay](overlay/README.md)。


## 实例方法

参照[overlay](overlay/README.md)。

## 最佳实践

    var o = new Dialog({
        trigger: '#trigger',
        template: '<div class="overlay"><button id="close">点击关闭</button></div>',
        width: 300,
        height: 200,
        closeElement: '#close',
        position: {
            baseXY: [100, 100]
        },
        hasMask: true
    });


