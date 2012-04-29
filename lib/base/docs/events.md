
# Events

`Base.Events` 模块，提供了基本的事件监听、卸载和触发等功能。

---


## 使用说明

使用 `extend` 创建的类，会自动添加上 `Events` 提供的方法。

```js
/* post.js */
define(function(require, exports, module) {
    var Base = require('base');

    var Post = Base.extend({
        initialize: function(title, content) {
            this.title = title;
            this.content = content;
        },

        save: function() {
            // 将内容保存好⋯⋯

            // 然后触发事件：
            this.trigger('saved')
        }
    });

    module.exports = Post;
});
```

```js
/* test.js */
define(function(require, exports, module) {
    var Post = require('./post');

    var post = new Post('岁月如歌', '岁月是一首歌⋯⋯');

    // 监听事件
    post.on('saved', function() {
        alert('保存成功');
    });

    post.save();
});
```

上面的例子已经展现了 `on` 和 `trigger` 的基本用法，下面详细阐述所有用法。


### on `object.on(event, callback, [context])`

给对象添加一个事件回调函数。


### off `object.off([event], [callback], [context])`
