
# 类与模块

在 SeaJS 倡导的模块体系里，推荐一个文件一个模块。这样，我们经常会如下组织代码：

```js
/* animal.js */
define(function(require, exports, module) {
    ...
    var Animal = Base.extend(...);
    ...
});
```

```js
/* dog.js */
define(function(require, exports, module) {
    ...
    var Dog = Animal.extend(...);
    ...
});
```

```js
/* collie.js */
define(function(require, exports, module) {
    ...
    var Collie = Dog.extend(...);
    ...
});
```

我们在调试代码时，经常会使用 `console.dir` 来查看某个实例的来龙去脉：

```js
/* test.js */
define(function(require, exports, module) {
    var Collie = require('./collie');

    var collie = new Collie(...);
    console.dir(collie);
});
```

大部分类库的 OO 实现方式，上面的代码在 `console` 中的输出都很难直接看出 `collie`
的继承关系。比如使用 MooTools 时，输出如下：

![mootools-collie.png](assets/mootools-collie.png?raw=true)

在 SeaJS 环境下，通过 `Class.create` 或 `Base.extend` 创建类时，可以通过
`seajs.getActiveModule` 方法将类与模块关联起来，这样，可以得到下面的输出：

```
> console.dir(collie)
  ▼ Object
     ▼ __proto__: Object
       __meta__: 'path/to/collie.js'
       ▼ __proto__: Object
         __meta__: 'path/to/dog.js'
         ▼ __proto__: Object
           __meta__: 'path/to/animal.js'
```

这样可以比较清晰地看到 `collie` 的父类关系，并能直接定位到相应的文件，方便调试。

将 SeaJS 提供的信息，与 `Class.create` 方法打通，还可以进一步提供更多元信息，不仅方便调试，也能利用这些元信息，生成模块关系图等。


## 感谢

- 李牧对该问题的研究：[扩展 SeaJS 模块定义中的 module 参数的应用示例](http://limu.iteye.com/blog/1136712)
