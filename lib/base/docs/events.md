
# Events

`Base.Events` 模块，提供了基本的事件监听、卸载和触发等功能。

---


## 使用说明

使用 `extend` 创建的类，会自动添加上 Events 提供的方法。

```js
/* book.js */
define(function(require, exports, module) {
    var Base = require('base');

    var Book = Base.extend({
        initialize: function(name, author) {
            this.name = name;
            this.author = author;
        }
    });

    module.exports = Book;
});
```

```js
/* test.js */
define(function(require, exports, module) {
    var Book = require('./book');

    var book = new Book('红楼梦', '曹雪芹');


});
```


### on `object.on(event, callback, [context])`

给对象添加一个事件回调函数。


### off `object.off([event], [callback], [context])`


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





