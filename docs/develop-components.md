# 开发一个模块

- order: 4
- category: arale

---

## 相关文档

1. [Base & Widget 入门教程](https://github.com/aralejs/widget/wiki/Base-&-Widget-%E5%85%A5%E9%97%A8%E6%95%99%E7%A8%8B)
2. [基础设施快速 API 参考](https://github.com/aralejs/aralejs.org/issues/314)
3. [测试解决方案](https://github.com/totorojs/totoro/wiki)
4. [开发规范](http://aralejs.org/docs/rules.html)
5. [Develop a pacakge with spm](http://spmjs.io/documentation/develop-a-package)

---

这个教程会简单说明一个模块的开发流程，通过 [一个示例](http://spmjs.io/docs/puzzle/) 让你有切身体会，你也可以跟着一起做哦。

源码地址为：[https://github.com/sorrycc/puzzle](https://github.com/sorrycc/puzzle)

## 安装

请仔细参考 [环境与工具配置](/docs/installation.html) 。


## 初始化模块项目

模块和目录的名称要符合 [a-z\d\-\.]，并以英文字母开头，首选合适的英文单词， **禁止使用驼峰** 。

先来看看整个模块的结构，这样会有一个直观的感受。

```
puzzle
  -- docs                   markdown 文档，除了 README 的其他文档
       -- overlay.md
       -- dialog.md
  -- examples               例子
       -- assets            例子中如果有用到 img 等资源时，存放在该目录
            -- test.png
       -- index.md
       -- dialog.md
  -- src                    存放 js, css 文件
       -- overlay.css
       -- overlay.js
       -- dialog.js
  -- tests                  单元测试
       -- overlay-spec.js
       -- dialog-spec.js
  -- spm_modules            spm install 生成，存放依赖的其他模块
  -- _site                  nico 生成，存放站点
  -- HISTORY.md             版本更新说明
  -- README.md              模块总体说明
  -- package.json           版本等元信息
  -- .gitignore             git 忽略某些文件
  -- .travis.yml            travis 持续集成的配置
```

那我们初始化一个项目看看

```
$ mkdir puzzle
$ cd puzzle
$ spm init
Creating a spm package:
[?] Package name: puzzle
[?] Version: 0.0.0
[?] Description:
[?] Author: chencheng <sorrycc@gmail.com>
Initialize a spm package Succeccfully!
```

初始化完成后会生成一个骨架，在这个基础上进行开发更方便，之后可以提交到版本库了，当然你可以在 github 上建一个库。

```
git init
git add .
git commit -m 'first commit'
git remote add https://github.com/sorrycc/puzzle.git
git push origin master
```

## 进行开发

首先分析模块的依赖，比如 `puzzle` 需要 `jquery` 和 `arale-popup`。

可以使用 `spm install` 下载依赖。

```bash
$ spm install jquery arale-popup --save

        install: jquery@stable
        install: arale-popup@stable
          saved: in dependencies arale-popup@1.2.0
       download: http://spmjs.io/repository/arale-popup/1.2.0/arale-popup-1.2.0.tar.gz
          saved: in dependencies jquery@2.1.1
       download: http://spmjs.io/repository/jquery/2.1.1/jquery-2.1.1.tar.gz
        extract: ~/.spm/cache/arale-popup-1.2.0.tar.gz
      installed: $CWD/spm_modules/arale-popup/1.2.0
        depends: jquery@1.7.2, arale-overlay@1.2.0
        install: jquery@1.7.2
        install: arale-overlay@1.2.0
        ...

```

spm 会自动在 `package.json` 中添加依赖

```js
"spm": {
  "dependencies": {
    "jquery": "1.7.2",
    "arale-popup": "1.2.0"
  }
}
```

并且，所有依赖的模块都会被下载到 spm_modules 下。

修改 `index.js` 进行开发

```js
var popup = require('popup');
var $ = require('jquery');

var puzzle = function(){};
module.exports = puzzle;
```

启动本地服务进行调试。

```bash
$ spm doc
```

通过浏览器访问 [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

## 本地调试

examples 也使用 md 编写，这样写起来非常方便，除了基本的 markdown 语法还支持[额外的特性](https://github.com/aralejs/nico-arale#%E6%96%87%E6%A1%A3%E7%BC%96%E8%BE%91)。

在 `examples/index.md` 添加实例化代码，puzzle 已添加别名，可以直接 use。

````javascript
seajs.use('../index', function(Puzzle) {
  // use Puzzle
});
````

也可以用 require 来调用模块。

````javascript
var Puzzle = require('index');
// use Puzzle
````

通过四个 ```` 所包裹的代码不仅会显示成代码片段，也会插入 HTML 中进行实际运行，这样你调试好代码后，演示页面的文档也同时生成好了。

spm doc 支持 livereload，只要通过 `spm doc` 启动服务，修改文件后都会自动构建和刷新浏览器。

> 更多 Markdown 写文档的技巧请参考 https://github.com/spmjs/nico-cmd#%E6%96%87%E6%A1%A3%E7%BC%96%E8%BE%91 。


## 编写测试用例

Arale 提供 [mocha](https://github.com/totorojs/totoro/wiki/mocha.zh) 作为测试框架，开发者只要关注如何写好测试用例。

工具会到 tests 目录下的通过 **命名 + '-spec.js'** 拼装去找文件。

修改 `tests/puzzle-spec.js` 文件，开始写测试用例，可以直接看[示例](https://github.com/sorrycc/puzzle/blob/master/tests/puzzle-spec.js)。

访问 [http://127.0.0.1:8000/tests/runner.html](http://127.0.0.1:8000/tests/runner.html) 查看是否正确。

运行下面命令可以在命令行里跑测试用例：

```bash
$ spm test
```

Arale 已经配置 travis，只要开通就可以 **持续集成** 。[登录 travis](https://travis-ci.org/profile)，开启 travis。

## 部署文件

修改 `package.json` 配置打包方式

```js
"spm": {
  "main": "index.js"
}
```

这样 `spm build` 将打包 `index.js` 文件，并将这个文件中的本地依赖文件也打包进来。

接下来就可以开始打包，build 后会在 dist 目录生成打包的文件和 -debug 文件。

```bash
$ spm build
```

### 发布到源中

只有发布到源中，你的模块才能被其他模块调用。通过 `spm publish` 命令将会把你的模块发布到默认的源服务器中。（默认为 http://spmjs.io ，这个源服务器需要用户校验，请自行注册账号进行发布）

```bash
$ spm publish
```

## 部署模块文档

模块的文档地址为 http://spmjs.io/docs？{{模块名}}，开发完模块后，只需要运行如下代码就可以把文档部署上线。

```bash
$ spm doc publish
```

## 使用这个模块

我们现在已经写好了这个模块，那么如何使用呢？

### script 引用

使用 spm3 ，我们强烈推荐使用 standalone 的方式进行构建，然后用 script 直接引用。

```
$ spm build --include standalone
```

```html
<!-- use it without loader -->
<script src="build.js"></script>
```

### seajs.use

或者按照传统的 seajs 的方式，首先要把构建后的文件按目录部署到你的 assets 服务器上。

比如 arale 的 position 模块：

```
http://static.alipayobjects.com/position/1.1.0/index.js
```

然后就可以像《5 分钟上手指南》里那样用 seajs.use 来启动模块了。
