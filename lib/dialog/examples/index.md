# Dialog

## Example

<link rel="stylesheet" href="https://a.alipayobjects.com/u/css/201206/3OW4k7WsaR.css" type="text/css" charset="utf-8">
<style>
    .overlay {
        width: 500px;
        height: 300px;
        background: #7F96C8;
    }
    input {
        display:block;
        margin:10px;
    }
</style>

### BaseDialog: 无样式的抽象对话框组件

<div class="cell">
    <input type="button" id="trigger1" value="点击打开对话框" />
</div>

```javascript
seajs.use(['base-dialog'], function(BaseDialog) {
    var closeDialogTpl = '<div class="overlay"><button id="close">点击关闭</button><p>肯定是房间里萨的看法金克拉束带结发</p></div>';
    var dialogTpl = '<div class="overlay"><div id="dialog-title"></div><div id="dialog-content"></div><button id="confirm">确认按钮</button><button id="close">点击关闭</button></div>';

    var d1 = new BaseDialog({
        trigger: '#trigger1',
        template: dialogTpl,
        width: 300,
        height: 200,
        confirmElement: '#confirm',
        closeElement: '#close',
        titleElement: '#dialog-title',
        title: '我是标题',
        contentElement: '#dialog-content',
        content: '我是内容',
        onConfirm: function() {
            alert('点击了确定按钮');
        },
        onClose: function() {
            alert('点击了关闭按钮');
        },
        align: {
            baseXY: [200, 200]
        },
        hasMask: true
    });
    d1.set('content', '改变的内容');
    d1.set('width', 500);
});
```

### AnimDialog: 动画对话框组件

* 淡入淡出对话框: fade

<div class="cell">
    <input type="button" id="trigger2" value="点击打开对话框" />
</div>

```javascript
seajs.use(['anim-dialog'], function(AnimDialog) {
    var closeDialogTpl = '<div class="overlay"><button id="close">点击关闭</button><p>肯定是房间里萨的看法金克拉束带结发</p></div>';

    var d2 = new AnimDialog({
        trigger: '#trigger2',
        template: closeDialogTpl,
        width: 300,
        height: 200,
        closeElement: '#close',
        align: {
            baseXY: [400, 200]
        },
        effect: {
            type: 'fade'
        }
    });
});
```

* 展开对话框: slide

<div class="cell">
    <input type="button" id="trigger3" value="水平展开对话框" />
    <input type="button" id="trigger4" value="垂直展开对话框" />    
</div>

```javascript
seajs.use(['anim-dialog'], function(AnimDialog) {
    var closeDialogTpl = '<div class="overlay"><button id="close">点击关闭</button><p>肯定是房间里萨的看法金克拉束带结发</p></div>';
    var d3 = new AnimDialog({
        trigger: '#trigger3',
        template: closeDialogTpl,
        width: 300,
        height: 200,
        closeElement: '#close',
        align: {
            baseXY: [400, 200]
        },
        effect: {
            type: 'slide',
            from: 'left'
        }
    });
    var d4 = new AnimDialog({
        trigger: '#trigger4',
        template: closeDialogTpl,
        width: 300,
        height: 200,
        closeElement: '#close',
        align: {
            baseXY: [400, 200]
        },
        effect: {
            type: 'slide',
            from: 'up'
        }
    });
});
```

* 移入移出对话框: move

<div class="cell">
    <input type="button" id="trigger5" value="从左移入对话框" />
    <input type="button" id="trigger6" value="从右移入对话框" />
    <input type="button" id="trigger7" value="从上移入对话框" />
    <input type="button" id="trigger8" value="从下移入对话框" />
</div>

```javascript
seajs.use(['anim-dialog'], function(AnimDialog) {
    var closeDialogTpl = '<div class="overlay"><button id="close">点击关闭</button><p>肯定是房间里萨的看法金克拉束带结发</p></div>';
    var d5 = new AnimDialog({
        trigger: '#trigger5',
        template: closeDialogTpl,
        width: 300,
        height: 200,
        closeElement: '#close',
        align: {
            baseXY: [400, 200]
        },
        effect: {
            type: 'move',
            from: 'left'
        }
    });
    var d6 = new AnimDialog({
        trigger: '#trigger6',
        template: closeDialogTpl,
        width: 300,
        height: 200,
        closeElement: '#close',
        align: {
            baseXY: [400, 200]
        },
        effect: {
            type: 'move',
            from: 'right'
        }
    });
    var d7 = new AnimDialog({
        trigger: '#trigger7',
        template: closeDialogTpl,
        width: 300,
        height: 200,
        closeElement: '#close',
        align: {
            baseXY: [400, 200]
        },
        effect: {
            type: 'move',
            from: 'up'
        }
    });
    var d8 = new AnimDialog({
        trigger: '#trigger8',
        template: closeDialogTpl,
        width: 300,
        height: 200,
        closeElement: '#close',
        align: {
            baseXY: [400, 200]
        },
        effect: {
            type: 'move',
            from: 'down'
        }
    });
});
```

* 混合动画对话框

<div class="cell">
    <input type="button" id="trigger9" value="混合动画对话框一" />
    <input type="button" id="trigger10" value="混合动画对话框二" />
</div>

```javascript
seajs.use(['anim-dialog'], function(AnimDialog) {
    var closeDialogTpl = '<div class="overlay"><button id="close">点击关闭</button><p>肯定是房间里萨的看法金克拉束带结发</p></div>';
    var d9 = new AnimDialog({
        trigger: '#trigger9',
        template: closeDialogTpl,
        width: 300,
        height: 200,
        closeElement: '#close',
        align: {
            baseXY: [400, 200]
        },
        showEffect: {
            type: 'move',
            from: 'down'
        },
        hideEffect: {
            type: 'fade'
        }
    });
    var d10 = new AnimDialog({
        trigger: '#trigger10',
        template: closeDialogTpl,
        width: 300,
        height: 200,
        closeElement: '#close',
        align: {
            baseXY: [400, 200]
        },
        showEffect: {
            type: 'none'
        },
        hideEffect: {
            type: 'move',
            from: 'left'
        }
    });
});
```

### ConfirmBox: 带有默认样式的对话框

<div class="cell">
    <input type="button" id="trigger11" value="默认样式对话框" />
</div>

```javascript
seajs.use(['confirmBox'], function(ConfirmBox) {
    var d11 = new ConfirmBox({
        trigger: '#trigger11',
        title: function() {
            return '我真是标题啊';
        },
        content: '我是内容 我是内容',
        effect: {
            type: 'move',
            from: 'up'
        },
        onConfirm: function() {
            var that = this;
            this.set('title', '三秒后关闭对话框');
            this.set('content', '不要啊！！');            
            setTimeout(function() {
                that.hide();
            }, 3000);
        }
    });
});
```

* ConfirmBox 的静态方法

<div class="cell">
    <input type="button" id="trigger12" value="ConfirmBox.alert()" />    
    <input type="button" id="trigger13" value="ConfirmBox.confirm()" />
    <input type="button" id="trigger14" value="ConfirmBox.message()" />    
</div>

```javascript
seajs.use(['confirmBox', 'jquery'], function(ConfirmBox, $) {
    $('#trigger12').click(function() {
        ConfirmBox.alert('静态方法ConfirmBox.alert');
    });

    $('#trigger13').click(function() {
        ConfirmBox.confirm('静态方法ConfirmBox.confirm', '自定义标题', function() {
            alert('点击了确定按钮');
        }, function() {
            alert('点击了取消按钮');            
        });
    });

    $('#trigger14').click(function() {
        ConfirmBox.message('此消息将在四秒后消失');
    });
});
```
