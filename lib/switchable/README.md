# Switchable

Switchable提供了切换的基本操作，并通过参数配置实现了自动播放，循环，切换等操作，并提供不同的特点封装成了Tabs, Slide, Carousel, Accordion模块。用户可以根据自己的需求引用不同的模块。

---

## 模块依赖

 - [seajs](seajs/README.md)
 - [jquery](jquery/README.md)
 - [widget](widget/README.md)


## 配置属性

* `markupType` {Number} 

	默认为0. 指明 DOM 结构标记的类型, 可取 0, 1, 2.
    当取 0 时, 表示 DOM 是默认结构: 通过 nav 和 content 来获取 triggers 和 panels, 即通过配置以下两个参数获取.
    * `contentCls` {String}
    
    panels 所在容器的 class, 默认为 ‘ar-switchable-content’. 这种方式的 DOM 结构类似于:
    
    ```
    <div id="J_Slide">  <!-- 容器元素 -->
        <ul class="ks-switchable-nav">  <!-- 触发器列表 -->
            <li class="ks-active">标题 A</li>
            <li>标题 B</li>
            <li>标题 C</li>
            <li>标题 D</li>
        </ul>
        <div class="ks-switchable-content">  <!-- 面板列表 -->
            <div>内容 A</div>
            <div style="display: none">内容 B</div>
            <div style="display: none">内容 C</div>
            <div style="display: none">内容 D</div>
        </div>
    </div>
    ```
    当取 1 时, 表示 DOM 结构 可适度灵活：通过 cls 来获取 triggers 和 panels, 即通过配置以下两个参数获取.
    
    * `triggerCls` {String}
    
    默认为 ‘ar-switchable-trigger’, 会在 container 下寻找指定 class 的元素作为触发器。
    
      
    * `panelCls` {String}
    
    默认为 ‘ar-switchable-panel’, 会在 container 下寻找指定 class 的元素作为面板.
    默认的DOM结构类似于：
    
    ```
    <div id="J_Accordion">
        <div class="ks-switchable-trigger ks-active"><i class="ks-icon"></i><h3>标题A</h3></div>
        <div class="ks-switchable-panel">内容A<br/>内容A<br/>内容A</div>
        <div class="ks-switchable-trigger"><i class="ks-icon"></i><h3>标题B</h3></div>
        <div class="ks-switchable-panel" style="display:none;">内容B<br/>内容B<br/>内容B</div>
        <div class="ks-switchable-trigger"><i class="ks-icon"></i><h3>标题C</h3></div>
        <div class="ks-switchable-panel" style="display:none;">内容C<br/>内容C<br/>内容C<br/>内容C<br/>内容C</div>
        <div class="ks-switchable-trigger last-trigger"><i class="ks-icon"></i><h3>标题D</h3></div>
        <div class="ks-switchable-panel last-panel" style="display:none;">内容D<br/>内容D<br/>内容D</div>
    </div>
    ```
    当取 2 时, 表示 DOM 结构 完全自由: 直接传入 triggers 和 panels, 即通过配置以下两个参数获取. 这种方式下, DOM 结构就非常自由了, 传入什么内容有你自己定, 只需要 triggers 和 panels 的数量保持一致就好.
    * `triggers` {Array<HTMLElement>} 默认为[], 触发器数组
    
    * `panels` {Array<HTMLElement>} 默认为[], 面板数组

* `hasTriggers` {Boolean}

   默认为true，组件是否包含触发器。
  
* `triggerType` {String}

   默认为`mouse`, 触发类型，可以选择`mouse` 或 `click`.
   
* `delay` {Number}

   默认为1， 触发器延迟时间，单位为秒。

* `switchTo` {Number}

  初始化时，自动切换到指定面板，默认为0，也就是第一个。

* `steps` {Number}

  步长，表示每次切换时需要间隔多少个panels, 默认为1.

* `viewSize` {Array}

  可见视图区域的大小. 如果 css 中不设置 panel 的高宽或初始没有 panel , 则需要这里手工指定大小, 默认为 [].
  
  `当 panel 的高宽 css 中不指定时，需要设置 viewSize 为单个 panel 的高宽.`
  
* `autoplay` {Boolean}

  是否自动切换，默认为false, 开启后，不需要触发触发器，可以实现自动播放。

*  `interval` {Number}

  自动播放间隔时间, 以 s 为单位, 默认为 5.

* `pauseOnHover` {Boolean}

  triggerType 为 mouse 时, 鼠标悬停在 slide 上是否暂停自动播放, 默认为 true。

* `circular` {Boolean}

  否循环切换, 默认为 true, 是否循环播放, 当切换到最初/最后一个时, 是否切换到最后/最初一个。
 
* `effect` {String}

  动画效果函数, 默认没有特效, 可取 scrollx, scrolly, fade 或者直接传入自定义效果函数.

* `duration` {Number}

  默认为 .5, 动画的时长.

* `easing` {String|Function}

  动画效果，目前支持,`easeNode`默认, `easeIn`, `easeOut`, `easeBoth`, `easeInStrong`, `easeOutStrong`, `easeBothStrong`, `elasticIn`, `elasticOut`, `elasticBoth`, `backIn`, `backOut`, `backBoth`, `bounceIn`, `bounceOut`, `bounceBoth`。
  

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
* `activeInde` {Number}

  只读, 当前被激活的触发器序号, 从0 开始。
* `switchTimer` {Object}。

  只读, 切换定时器, 一般作为内部使用。
  
## 方法详情
* `switchTo`(index, direction, ev, callback)
  切换到某个视图。

      index {Number} 切换的项。
      
      direction {String}(可选)方向, 用于 effect, 可取 ‘forward’, ‘backward’, 或者不设置。
      
      ev {EventObject} – (可选) 引起该操作的事件。
      
      callback {Function} – (可选) 运行完回调, 和绑定 switch 事件作用一样。
      
  
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

      

