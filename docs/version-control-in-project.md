# 代码组织实践

- order: 5
- category: arale

---

SeaJS 提供了新的代码书写和组织方式，带来模块化开发的同时，向我们提出了新的挑战。

首先来看一下使用 SeaJS 开发项目时我们遇到的问题：

SeaJS 体系下衍生出数量巨大的各种 JS 模块，每个模块包括不同的版本，应该怎样选择？

一个具体的使用场景中，假设页面中使用

```js
seajs.use('arale/xxx/0.9.0/xxx')
```

调用模块，这时我决定使用新开发的 1.0.0 版本。上面的代码一共出现了 3 次，修改的时候只把两个地方修改成了

```js
seajs.use('arale/xxx/1.0.0/xxx')
```

结果造成同一页面中加载了同一组件的两个版本。这个时候我应该如何解决？

> 有时候会想，是否存在一种合理的代码组织方式，使我们在项目中可以合理调用版本化的模块？

答案是肯定的。总结起来，上面所有都指向了同一个问题——版本管理策略。只要我们的代码组织能够将这件事做好就可以解决上面的问题，也只有这样才能充分享受到 SeaJS 社区为我们带来的所有乐趣。

> SeaJS 选择了模块版本化策略来保障稳健的产品演进，这就要求开发者对开发时和运行时选择合理的版本管理策略。那么，我们应该怎样根据产品和团队的具体情况做出合理选择？

此文回答上面的问题，帮助大家了解代码组织的不同方式，并根据项目自身的需要做出选择。

## 准备工作

在这里假设你已经了解了包括但不限于 SeaJS 模块标识、版本策略等内容。如果不了解，可以先阅读：

* [SeaJS 模块标识](https://github.com/seajs/seajs/issues/258)


## 最简单直接

也许这正是你现在使用的方式：

> 直接 use 需要的组件，除 jQuery 外都需要完整的 id。

### Example:

```js
seajs.use(['$', 'alipay/xbox/0.9.8/xbox', 'arale/validator/0.8.9/validator'], function($, Xbox, Validator) {
    // biz logic
    $(function() {
        var x = new Xbox({...});
        var v = new Validator({...})
    });
});
```

### 分析

这样做的好处显而易见：简单。

不过在某些场景存在一些问题。来看一个例子：

对于稍微大型点的网站，一个页面的导航（例如 foot 和 head）通常是单独维护的。而页面的其他部分由另外的人维护，也就是说，同一个页面可能隶属于不同的产品或由不同的人（团队）维护，这时很容易出现本文开始处提到的问题：升级版本号的时候一旦有遗漏会造成同一页面中存在加载同一模块的不同版本，从而带来不必要的页面性能开销。

### 小结

方案

> 直接 use 需要的组件，除 jQuery 外都需要完整的 id。

优点

> 使用简单，无需额外配置，学习成本低

缺点

> 如果一个页面有多人维护，可能 use 不同版本，导致冗余加载。

适用范围

> 小型应用（页面），单人维护的场景。

## 配置 alias

也许你已经注意到 SeaJS 提供了一个功能，通过 `seajs.config` 配置 alias。([了解SeaJS 配置](https://github.com/seajs/seajs/issues/262))

alias，顾名思义，就是别名，可以用来做短命名。这里我们利用这个特性来约束版本管理，做如下约定：

> 所有用到的模块必须配置成 alias，换言之，只可以 use alias 别名，不直接 use 模块 id。

### Example

```js
// 页头配置
seajs.config({
    alias: {
        '$': 'gallery/jquery/1.8.2/jquery',
        'xbox': 'alipay/xbox/0.9.8/xbox',
        'validator': 'arale/validator/0.8.9/validator'
    }
});

// 页面中调用
seajs.use(['$', 'xbox', 'validator'], function($, Xbox, Validator) {
    $(function() {
        var x = new Xbox({...});
        var v = new Validator({...});
    });
});
```

### 分析

这种方式比直接 use 模块 id 的第一个方案更进了一步，将页面中的模块版本放在一起统一进行配置。这样即便是多人维护的页面，有一个地方进行统一管理，上面遇到的加载多版本的问题就不会存在。

这里的 `seajs.config` 不仅可以作为页面级别的配置，也可以作为产品级别的配置。一个产品中有多个页面，可以公用这个配置。

### 小结

方案

> 配置 alias 进行统一的版本管理。

优点

> 配置 alias 后，不需要写完整模块 id，用起来方便。
> 版本统一维护，升级组件只需要修改一处。

缺点

> 比直接 use 模块 id 稍复杂
> 所有版本集中控制，需要对整个页面的模块调用都有了解并负责模块版本的变更

适用范围

> 多人协作，多页面大中型产品维护

## 封装 SDK

首先思考一个问题，JS 在 WEB 应用中应该扮演什么角色，或者说应该承担哪些？

现代浏览器中 JS 可以做很多事情，所以出现了各式各样的使用方法。有人拿它来做交互，有人拿它来做展示，有人拿它来做业务逻辑。我们认为，JS 应该尽量少碰触业务逻辑，少做展示性的功能，应该把重心放在结构、样式和行为中行为的一部分。我们相信，JS 是用来做交互的。否则是对 JS 的滥用，必带来维护性问题。在大型网站的维护中尤其如此。

基于以上考虑，有了更进一步的 SeaJS 使用方式。

> 封装以产品为粒度的交互 SDK。

简单的说，就是提取页面中的交互形式，相对应封装出需要的 JS API，供页面中调用。

### Example

创建 SDK 模块，可以以产品命名模块。以支付宝的消费纪录产品为例，命名为 record。

1.  record/package.json 中配置所有用到的模块：

    ```js
    "dependencies": {
        "$": "$",
        "xbox": "alipay/xbox/0.9.8/xbox",
        "validator": "arale/validator/0.8.9/validator"
    }
    ```

2.  创建模块入口文件record/src/main.js：

    ```js
    define(function(require, exports, module) {
        module.exports = {
            $: require('$'),

            arale: {
                validator: require('validator')
            },

            alipay: {
                xbox: require('xbox')
            },

            biz: {
                // 这是产品中独立研发的模块，使用相对路径
                someOtheAPI: require('./biz/some-other-api.js')
            }
        }
    });
    ```

    这里 API 的命名空间可根据需要进行组织。

3.  record/package.json 中配置 output，打包 main.js 模块：

    ```js
    "output": [
        "main.js"
    ]
    ```

4.  spm build 后生成 /personal/record/1.0.0/main.js

5.  页面中调用：

    ```js
    seajs.use('personal/record/1.0.0/main', function(Record) {
        var xbox = Record.xbox;
        var validator = Record.validator;
        // ...
    });
    ```

6.  更进一步，可以通过变量或 alias 维护 SDK 的模块 id。例如

    1) 使用 js 全局变量：

      ```
      // global variable
      var SDK = 'personal/record/1.0.0/main';

      // 调用
      seajs.use(SDK, function(Record) {...});
      ```

    2) 使用服务器变量

      ```
      // 以 java velocity 模板引擎为例
      #set($SDK = "personal/record/1.0.0/main")
      // 调用
      seajs.use('$SDK', function() {...})

      // 在支付宝是通过配置
      <vars>
          <js_record>personal/record/1.0.0/main</js_record>
      </vars>
      // 调用
      seajs.use('$js_record', function() {...})
      ```

### 分析

通过上面的例子可以看到，页面中所有模块通过一个 SDK 包进行管理，最终变成只需要维护 SDK 就可以了。页面中 API 都是从 SDK 包作为入口，所有模块的版本配置在 SDK 模块的 package.json 中，统一管理。

回到刚才提到的问题，JS 应该扮演交互的实现者角色。使用 SDK 封装这种方式，不仅可以满足需求，而且可以达到额外的好处。例如，产品规划上有利于形成复用的交互包，同时可以在大型团队中形成可量化的交付产品，也就是这个 SDK 包。

这种使用方式是一个新思路，尝试后或许会发现很实用。

### 小结

方案

> 为产品封装 SDK 交互包。

优点

> 1. 清晰
> 2. 可以在 SPM 编译期间发现并解决版本冲突(依赖冲突)
> 3. 版本统一管理目标达成的同时，可以带来额外好处。

缺点

> 每次都要下载所有组件，不能只下载用到的组件。

适用范围

> 大型项目。

## 方案总结

一共有三种主要的使用方式：

* 直接 use 需要的组件
* 配置 alias
* 封装 SDK

以上方案没有优劣之分，需要开发者根据自己产品的实际情况做具体的决策。适合项目的，才是最好的。

