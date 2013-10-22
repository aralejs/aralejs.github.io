# 开发一个模块

- order: 4
- category: arale

---

## 相关文档

1. [基于 widget 开发模块](http://aralejs.org/widget/)
2. [测试解决方案](https://github.com/totorojs/totoro/wiki)
3. [开发规范](http://aralejs.org/docs/rules.html)
4. [alipay 模块维护文档(内)](http://site.alipay.im/questions/spm/alipay-group.html)

---

这个教程会简单说明一个模块的开发流程，通过 [一个示例](http://popomore.github.io/puzzle/examples/) 让你有切身体会，你也可以跟着一起做哦。

源码地址为：[https://github.com/popomore/puzzle](https://github.com/popomore/puzzle)

## 安装

请仔细参考 [环境与工具配置](/docs/installation.html) 。


## 初始化模块项目

模块和目录的名称要符合 [a-z\d-]，并以英文字母开头，首选合适的英文单词， **禁止使用驼峰** 。

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
  -- sea-modules            spm install 生成，存放依赖的其他模块
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
$ spm init arale
Please answer the following:
[?] Project name (puzzle) 
[?] your CMD family (arale) 
[?] Version (1.0.0) 
[?] Description (The best project ever.) 
[?] Project git repository (git://github.com/afc163/puzzle.git) 
[?] Project homepage (https://github.com/afc163/puzzle) 
[?] Project issues tracker (https://github.com/afc163/puzzle/issues) 
[?] Licenses (MIT) 
[?] Do you need to make any changes to the above before continuing? (y/N)
```

初始化的时候需要选择 arale 作为模板，family 为 arale，name 为模块名。初始化完成后会生成一个骨架，
在这个基础上进行开发更方便，之后可以提交到版本库了，当然你可以在 github 上建一个。

```
git init
git add .
git commit -m 'first commit'
git remote add origin git@github.com:popomore/puzzle.git
git push origin master
```

## 进行开发

首先分析模块的依赖，比如 `puzzle` 需要 `popup`。

根据 ID 规则要查看 `widget` 的版本，使用 `spm info` 的时候也要加 family 哦。

```
$ spm info arale/popup

  arale/popup
  1.0.2 ~ stable
  vers: 1.0.2  1.0.1
  desc: Popup 是可触发的浮层模块。
  link: http://aralejs.org/popup/
  repo: https://github.com/aralejs/popup.git

```

在 `package.json` 中添加依赖

```
"spm": {
    "alias": {
        "$": "$",
        "popup": "arale/popup/1.0.2/popup"
    }
}
```

**注意：** `package.json` 为 json 文件，需要用双引号才合法，可以查看[详细配置](http://docs.spmjs.org/en/package)。

使用 `spm install` 下载依赖，会把 alias 配置的模块都下载到 sea-modules 下。
`jquery` 配置为 $ 是因为使用了别名配置，不需要完整的依赖路径。

```
$ spm install
```

修改 `src/puzzle.js` 进行开发

```
define(function(require, exports, module) {
  var popup = require('popup'),
    $ = require('$');
  var puzzle = function(){};
  module.exports = puzzle;
});
```

启服务进行调试

```
$ spm doc watch
```

通过浏览器访问 [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

## 本地调试

examples 也使用 md 编写，这样写起来非常方便，除了基本的 markdown 语法还支持[额外的特性](https://github.com/aralejs/nico-arale#%E6%96%87%E6%A1%A3%E7%BC%96%E8%BE%91)。

在 `examples/index.md` 添加实例化代码，puzzle 已添加别名，可以直接 use。

````javascript
seajs.use('puzzle', function(Puzzle) {
    
});
````

通过四个 ``` 所包裹的代码不仅会显示成代码片段，也会插入 HTML 中进行实际运行，这样你调试好代码后，演示页面的文档也同时生成好了。

spm doc 支持 livereload，只要通过 `spm doc watch` 启动服务，修改文件后都会自动构建和刷新浏览器。


## 编写测试用例

Arale 提供 [mocha](https://github.com/totorojs/totoro/wiki/mocha) 作为测试框架，开发者只要关注如何写好测试用例。

工具会到 tests 目录下的通过 **命名 + '-spec.js'** 拼装去找文件。

修改 `tests/puzzle-spec.js` 文件，开始写测试用例，可以直接看[示例](https://github.com/popomore/puzzle/blob/master/tests/puzzle-spec.js)。

[详细文档请看](https://github.com/totorojs/totoro/wiki/unit-testing-quick-start.zh)

访问 [http://127.0.0.1:8000/tests/runner.html](http://127.0.0.1:8000/tests/runner.html) 查看是否正确。

Arale 已经配置 travis，只要开通就可以 **持续集成** 。[登录 travis](https://travis-ci.org/profile)，开启 travis。

## 部署文件

修改 `package.json` 配置打包方式

```
"output": ["puzzle.js"]
```

这样 `spm build` 将打包 src 目录下的 `puzzle.js` 文件，并将这个文件中的本地依赖文件也打包进来。

具体配置的参数可查看[output配置文档](http://docs.spmjs.org/en/package#spm-output)。

接下来就可以开始打包，build 后会在 dist 目录生成打包的文件和 -debug 文件。

```
$ spm build
```

[spm build](https://github.com/spmjs/spm-build) 使用 gruntjs 进行实现，能够打包压缩符合 cmd 规范的 js 和 css 文件。

标准模块的打包流程可见：https://github.com/spmjs/spm-build/blob/master/index.js#L39

在支付宝，我们还添加了一些自定义的 task：https://github.com/spmjs/spm-alipay-suite/blob/master/Gruntfile.js#L97

### 发布到源中

只有发布到源中，你的模块才能被其他模块调用。通过 `spm publish` 命令将会把你的模块发布到默认的源服务器中。
（默认为 https://spmjs.org，这个源服务器需要用户校验以及对应 family 的权限，请自行[注册账号](http://docs.spmjs.org/en/#register-amp-login)进行发布）

```
$ spm publish
```

### 部署到开发服务器

请参见 [spm-deploy](https://github.com/spmjs/spm-deploy)。

```
$ spm deploy
$ spm deploy --target p123  // 发布到 assets.p123.alipay.net
```

## 部署模块文档

Arale 模块的文档地址为 aralejs.org/{{模块名}}，
开发完毕后请 push 到 https://github.com/aralejs 下，发布文档请使用 `spm doc publish` 命令。

其他模块的文档地址在内网：arale.alipay.im/{{模块root}}/{{模块名}}，比如
`alipay.xbox` 的文档地址为 `http://arale.alipay.im/alipay/xbox/` 。

开发完模块后，只需要运行如下代码就可以把文档部署上线。

```
$ spm doc publish 
```

或者

```
$ spm doc publish -s alipay
```

`-s alipay` 这个参数指定了发布文档到哪台源服务器，如果没有指定，则发布到默认的地址中去，
你可以在 `~/.spm/spmrc` 文件中查看配置的默认源是什么。

```
[source:default]
url = http://yuan.alipay.im
```

一般来说，支付宝内部的源地址是 `http://yuan.alipay.im`，公网的源地址是 `https://spmjs.org`。

发布到源中。publish 命令将会把你的模块发布到默认的源服务器中。（例如 spmjs.org，这个源服务器需要用户校验以及对应 family 的权限，请自行[注册账号](http://docs.spmjs.org/en/#register-amp-login)进行发布）
