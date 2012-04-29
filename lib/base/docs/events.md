
# Events

`Base.Events` 模块，提供了基本的事件监听、卸载和触发等功能。

---


## 使用说明


### on `object.on(events, callback, [context])`


### off `object.off([events], [callback], [context])`


* on
* off
* trigger 
* once

### 代码示例一
默认从base继承下来的对象, 已经具有事件监听和发布功能.

```
    var Base = require('base');
    var Foo = base.extend({
        initialize: function() {
        
        }
    });

    var f = new Foo();

    f.on('say', function() {
        console.log("hi");
    });
    var hello = function() {
        console.log('hello');
    };
    f.on('say', hello);
    f.once('say', function() {
        console.log('hi once!');
    });
    f.trigger('say');

    f.off('say', hello);

```
### 代码示例二
我们也可以自己实例化一个Event对象.
```
    var MyEvent = require('base').Events();
    MyEvent.on('say', function() {
    
    });
```





