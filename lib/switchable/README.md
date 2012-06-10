# Switchable

Switchable提供了切换的基本操作，并通过参数配置实现了自动播放，循环，切换等操作，并提供不同的特点封装成了Tabs, Slide, Carousel, Accordion模块。用户可以根据自己的需求引用不同的模块。

---


## 模块依赖

 - [seajs](seajs/README.md)
 - [jquery](jquery/README.md)
 - [widget](widget/README.md)


## 配置属性

下面的配置属性适用与全部相关属性

* `contentClass` {String}
    
    panels 所在容器的 class, 默认为 `ui-switchable-content`, 配置这个元素的孩子元素会被作为面板列表。比如下面的例子。
    
    ```
    <div id="J_Slide">  <!-- 容器元素 -->
         <div class="ui-switchable-content">  <!-- 面板列表 -->
            <div>内容 A</div>
            <div style="display: none">内容 B</div>
            <div style="display: none">内容 C</div>
            <div style="display: none">内容 D</div>
        </div>
    </div>
    ```
    
* `navClass` {String}
    
    默认为`null`，用来指定触发器的父元素，如果配置此值会把对应元素的孩子元素作为触发器列表。如果此元素配置了，但是在当前页面并没有发现此元素，程序会自动创建触发器列表，触发器中的内容为数字，数量和面板数量相同。
   
    ```  
     <ul class="ui-switchable-nav">
         <!-- title 争渡读屏器不读-->
         <li aria-labelledby='a_tip' title="读屏器读不出来">
             <span style="display:none" id="a_tip">标题 A，可左右键切换操作</span>
             <a href="http://www.taobao.com">标题 A</a></li>
         <li><a href="http://www.taobao.com">标题 B</a></li>
         <li>标题 D</li>
         <li>标题 E</li>
     </ul>
     
    ```
      
* `triggers` {String|Array}
    
    触发器列表, 支持直接传入选择器，也可以是元素数组。
   
* `panels` {String|Array}

    面板列表，支持直接传入选择器，也可以是元素数组。

* `triggerType` {String}
    
    触发类型，默认`hover`.还可以选择`click`
 
* `delay` {Number}

   默认为`100`， 触发器延迟时间，单位为毫秒。
    
* `activeTriggerClass` {String}
    触发器被选中时的class,默认`ui-active`。

* `activeIndex` {Number}

  初始化时，自动切换到指定面板，默认为`0`，也就是第一个。

* `steps` {Number}

  步长，表示每次切换时需要间隔多少个panels, 默认为`1`。

* `viewSize` {Array}

  可见视图区域的大小. 如果 css 中不设置 panel 的高宽或初始没有 panel , 则需要这里手工指定大小, 默认为 [].
  
  `当 panel 的高宽 css 中不指定时，需要设置 viewSize 为单个 panel 的高宽.`
  
* `autoplay` {Boolean}

  是否自动切换，默认为`false`, 开启后，不需要触发触发器，可以实现自动播放。

*  `interval` {Number}

  自动播放间隔时间, 以毫秒为单位, 默认为 `3000`。

* `pauseOnHover` {Boolean}

  triggerType 为 `hover` 时, 鼠标悬停在 slide 上是否暂停自动播放, 默认为 `true`。

* `circular` {Boolean}

  否循环切换, 默认为 `true`, 是否循环播放, 当切换到最初/最后一个时, 是否切换到最后/最初一个。
 
* `effect` {String}

  动画效果函数, 默认没有特效, 可取 `scrollx`, `scrolly`, `fade` 或者直接传入自定义效果函数.

* `duration` {Number}

  默认为 `500`, 以毫秒为单位， 动画的时长.

* `easing` {String|Function}

  动画效果，目前支持,`easeNode`默认, `easeIn`, `easeOut`, `easeBoth`, `easeInStrong`, `easeOutStrong`, `easeBothStrong`, `elasticIn`, `elasticOut`, `elasticBoth`, `backIn`, `backOut`, `backBoth`, `bounceIn`, `bounceOut`, `bounceBoth`。
  
========


## 具体组件配置属性

有些属性在对应类型的模块可能有不同的默认值，还有一些特有的配置属性。

### Accordion (手风琴)
* `triggerType` {String}

  在此模块中，默认值为`click`

* `multiple` {Boolean}
  
  是否支持多个面板展开，默认为`false`。

### Carousel (旋转木马)

* `circular` {Boolean}

  是否支持循环切换。默认`true`
* `prevButtonClass` {String}
    
  `前一个`触发器class. 默认为`ui-switchable-prev-btn`。
* `nextButtonClass` {String}
  
  `后一个`触发器class. 默认为`ui-switchable-next-btn`。
* `disableButtonClass` {String}
   触发器不可用时的class. 默认为`ui-switchable-disable-btn`。

### Slide
* autoplay {Boolean}

  是否自动切换，默认为`true`。

* circular {Boolean}

  是否循环切换，默认为`true`。

### Tabs (卡盘)
配置和基础类相同


## 实例属性
* `element` {HTMLElement}

  容器元素。
* `triggers` {Array}

  触发器集合， 可能为空。
* `panels` {Array}

  切换面板结合，可以为空值。
* `content` {HTMLElement}

  存放面板的容器元素。
* `length` {Number}

  只读, 触发器或面板的个数。


## 方法详情
* `switchTo`(toIndex, fromIndex, direction)
  切换到某个视图。
      toIndex {Number} 要切换到的项。
      fromInex {Number} 当前项.
      direction {String}(可选)方向, 用于 effect, 可取 ‘forward’, ‘backward’, 或者不设置。
  
* prev

  切换到上一视图。
* next

  切换到下一视图。

* stop

  停止自动切换。只有设置了 autoplay true 时有效。

* start

  开始自动切换
* destroy

  组件销毁

## 组件触发事件
在组件运行中，会触发相关事件，使用者可以根据自己的需要去监听对应的事件

* `beforeSwitch`
  
  面板切换前触发。

* `switch`

  面板切换后触发。

* `change:activeIndex`

  面板改变时触发


## 最佳实践

1. 直接使用：

```
seajs.use(['tabs'], function(Tabs) {
    var t = new Tabs({
        element: '#demo1',
        switchTo: 1,
        effect: 'fade'
    });
});

```

2. 也可以适用自动渲染。详情可以参考[examples/autorender.html](https://github.com/alipay/arale/blob/master/lib/switchable/examples/autorender.html)

      

## 演示页面

 - [examples/autorender.html](http://aralejs.org/lib/switchable/examples/autorender.html)
 - [examples/tabs.html](http://aralejs.org/lib/switchable/examples/tabs.html)
 - [examples/switchable-data-api.html](http://aralejs.org/lib/switchable/examples/switchable-data-api.html)


## 测试用例

* <http://aralejs.org/lib/switchable/tests/runner.html>


## 交流讨论

欢迎创建
[GitHub Issue](https://github.com/alipay/arale/issues/new)
来提交反馈。

