
# Overlay

对话框组件，提供对话框显示隐藏、dom结构自定义、定位、select遮挡、确定取消关闭等功能特性。

继承了arale.overlay组件。

---


## 模块依赖

 - [seajs](seajs/README.md)
 - [jquery](jquery/README.md)
 - [overlay](overlay/README.md)


## API说明

* `trigger` : {element}

    对话框触发点。

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

* `onCancel` : {function}

    取消时的操作。

* `onClose` : {function}

    关闭时的操作。

* `hasMask` : {boolean}

    是否有背景遮罩层。

* `iframeUrl` : {string|function}

    内嵌iframe的url。

* `ajaxUrl` : {string|function}

    内容是ajax取得时，指定其来源地址。


其他API参照[overlay](overlay/README.md)。


## 最佳实践

    var o = new Dialog({
        trigger: '#trigger',
        template: '<div class="overlay"><button id="close">点击关闭</button></div>',
        width: 300,
        height: 200,
        closeElement: '#close',
        baseObject: {
            x: 200,
            y: 100
        },
        hasMask: true
    });


