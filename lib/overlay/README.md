
# Overlay

基础浮层组件，提供浮层显示隐藏、dom结构自定义、定位和select遮挡等特性。

---

## 模块依赖

 - [seajs](seajs/README.md)
 - [jquery](jquery/README.md)
 - [position](position/README.md)


## 配置说明

* `element` {element} 

    页面dom节点，只读。

* `template` {string}

    浮层容器的模板，如'\<div class="myoverlay">\</div>'，只读。

* `zIndex` {string|number}

    浮层的z-index属性。

* `width` {string|number}

    浮层宽度(px)。

* `height` {string|number}

    浮层高度(px)。

* `id` {string}

    浮层的初始化 id 。

* `className` {string}

    浮层的初始化 className 。

* `style` {object}

    浮层的初始化 style 对象。

* `parentNode` {element}

    浮层的父元素，默认为document.body，只读。

* `position` {object}

    定位对象，形似：

        {
            selfXY: [0, 0],     // element 的定位点，默认为左上角
            baseElement: Position.VIEWPORT,     // 基准定位元素，默认为当前可视区域
            baseXY: [0, 0]      // 基准定位元素的定位点，默认为左上角
        }

    这块的定位原理可参照arale.position组件的pin方法。


## 方法说明

* `render()` 

    生成浮层的dom结构和样式并插入文档流。

* `show()` 

    显示浮层。

* `hide()` 

    隐藏浮层。

* `get(key)` 

    获得属性值。

* `set(key, value)` 

    非只读属性都可以通过set方法修改，并会立刻反映到浮层上。


## 最佳实践

1. 直接使用：

        var overlay = new Overlay({
            template: '<div class="overlay"></div>',
            width: 500,
            height: 200,
            zIndex: 99,
            style: 'border:1px solid red;color:green;',
            parentNode: '#c',
            position: {
                selfXY: ['-100%', 0],
                baseElement: '#a',
                baseXY: [0, 0]
            }
        });
        overlay.render().show();
        // 修改元素样式
        overlay.set('style', {
            backgroundColor: 'red',
            border: '1px solid green'
        });
        // 非只读属性都可以通过 set 方法进行更新
        overlay.set('width', 500);
        overlay.set('className', 'myclass');

2. 继承使用：

        var Overlay = require('overlay');
        var Dialog = Overlay.extend({
            attrs: {
                trigger: null,
                triggerType: 'click',
                comfirmElement: null,
                cancelElement: null,
                closeElement: null,
                hasMask: false,
                onComfirm: function() {},
                onClose: function() {}
            },
            setup: function() {
                
            },
            parseElement: function() {
                
            }
            delegateEvents: function() {
                
            }
        });

3. Mask 组件的使用：

        var mask = require('mask');
        mask.show();
        //mask.hide();

    改变默认配置：

        mask.set({backgroundColor:'red', opacity:0.5}).show();


