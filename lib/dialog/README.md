
# baseDialog

基础对话框组件，提供对话框显示隐藏、dom 结构自定义、定位、select 遮挡、确定取消关闭等功能特性。

继承自 arale.overlay 组件。

---


## 模块依赖

 - [seajs](seajs/README.md)
 - [jquery](jquery/README.md)
 - [overlay](overlay/README.md)
 - [easing](easing/README.md)


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


## animDialog 动画对话框

animDialog 对话框组件，提供了对话框弹出的动画效果。目前支持的动画效果有四种：无动画，渐隐，滑动，移动。

继承自 arale.baseDialog 组件。

* `effect` : {object}

    显隐效果配置，形似

        {
            type: 'move',       // 动画种类，可选 none|fade|slide|move
            duration: 400,      // 动画时长
            from: 'up',         // 动画方向，当 type 为 slide|move 时有效
            easing: 'easeOut'   // 支持常用的平滑函数
        }

* `showEffect` : {object}

    显示时的动画效果，若设为 null，则表示动画种类为 none。

* `hideHffect` : {object}

    隐藏时的动画效果，若设为 null，则表示动画种类为 none。


## confirmBox 对话框

confirmBox 是具有默认样式和完善功能的对话框，可直接使用。

继承自 arale.animDialog 组件。

* `hasTitle` : {boolean}

    是否显示标题栏，默认为 true。

* `hasOk` : {boolean}

    是否显示确定按钮，默认为 true。

* `hasCancel` : {boolean}

    是否显示取消按钮，默认为 true。

* `hasCloseX` : {boolean}

    是否显示关闭 X 按钮，默认为 true。

进行如下调用即可在页面中央显示一个对话框。

    new ConfirmBox({
        trigger: '#trigger',
        title: '我是标题',
        content: '我是内容',
        onConfirm: function() {            
            this.hide();
        }
    }).show();

组件还提供下面三个静态方法，方便调用。

* `ConfirmBox.alert(msg, callback)`

    弹出信息确认框。

* `ConfirmBox.confirm(msg, title, confirmCallback, cancelCallback)`

    弹出信息确认取消框。

* `ConfirmBox.message(msg, time)`

    在页面顶部弹出提示条，默认四秒后自动消失。

