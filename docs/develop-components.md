# 如何开发一个 Arale 模块

- order: 4

---

这个教程会简单说明一个组件的开发流程，通过 [overlay](https://github.com/aralejs/overlay) 的示例让你有切身体会，你也可以跟着一起做哦。

## 安装

先遵循 [Getting Started](getting-started.html) 完成安装。

### git

Arale 代码使用 git 做版本控制工具，下载地址如下

 -  [git for mac](http://code.google.com/p/git-osx-installer/)

 -  [git for windows ](http://code.google.com/p/msysgit/)

对 git 不熟的可以看下这个[简易指南](http://rogerdudler.github.com/git-guide/index.zh.html)

### liquidluck

安装文档调试工具 [liquidluck](https://github.com/lepture/liquidluck)，更多可查看[文档](https://github.com/aralejs/liquidluck-theme-arale2)

```
$ sudo pip install -U liquidluck
$ sudo pip install -U tornado
$ liquidluck install aralejs/arale2 -g
```

    
## 初始化项目

组件的名称遵循[命名规范](https://github.com/alipay/arale/wiki/%E6%96%87%E4%BB%B6%E5%91%BD%E5%90%8D%E4%B8%8E%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84)。

那我们开始创建项目

```
$ mkdir overlay
$ cd overlay
$ spm init
prompt: Please select module type:
1: -> arale(arale module template):  1
prompt: Define value for property 'root': :  arale
prompt: Define value for property 'name': :  overlay
>>> GENERATE /Users/popomore/tmp/overlay/examples/index.md
>>> GENERATE /Users/popomore/tmp/overlay/.gitignore
>>> GENERATE /Users/popomore/tmp/overlay/Makefile
>>> GENERATE /Users/popomore/tmp/overlay/package.json
>>> GENERATE /Users/popomore/tmp/overlay/README.md
>>> GENERATE /Users/popomore/tmp/overlay/src/overlay.js
>>> GENERATE /Users/popomore/tmp/overlay/tests/overlay-spec.js
```

先简单介绍一下每个目录和文件的作用

```
|- dist                <- build 后的文件
|  |- example.js
|  `- example-debug.js
|- src
|  `- example.js       <- 源文件
|- tests
|  `- example-spec.js  <- 单元测试文件
|- examples            <- demo
|  `- index.md
|- README.md           <- 文档首页
|- HISTORY.md          <- 版本记录
`- package.json        <- 配置文件
```

提交到版本库中
 
```
git init
git add .
git commit -m 'init'
git remote add origin git@github.com:aralejs/overlay.git
git push origin master
```

## 进行开发

完善 `package.json` 的信息，添加 description 和 root。

    "name": "overlay",
    "version": "1.0.0",
    "root": "arale",
    "description": "基础浮层组件，提供浮层显示隐藏、定位和 select 遮挡等特性。"
    
**注意：** `package.json` 为 json 文件，需要用双引号才合法，可以查看[详细配置](https://github.com/spmjs/spm/wiki/package.json)。
    
分析组件的依赖，比如 `overlay` 需要 `widget`，先查看 `widget` 的版本

```
$ spm search widget
widget:
  versions:
    1.0.2:
      - templatable.js
      - widget.js
```

`package.json` 中添加依赖

```
"dependencies": {
    "$":"$",
    "widget": "arale/widget/1.0.2/widget",
    "position": "arale/position/1.0.0/position",
    "iframe-shim": "arale/iframe-shim/1.0.0/iframe-shim"
},
```

安装依赖，会把 dependencies 配置的都下载下来，`seajs` 和 `jquery` 是依赖线上的，所以不用下载。

```
$ spm install
```
    
修改 `src/overlay.js` 进行开发，起服务进行调试

```
$ make debug
```

通过浏览器访问 [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

## 本地调试

demo 也使用 md 编写，这样写起来非常方便，除了基本的 markdown 语法还支持[额外的特性](https://github.com/aralejs/liquidluck-theme-arale2#%E6%96%87%E6%A1%A3%E7%BC%96%E8%BE%91)。

在 `examples/index.md` 添加实例化代码，demo 引用的为源码，修改即展示。

    ````javascript
    seajs.use('../src/overlay', function(Example) {
        var o2 = new Overlay({
            element: '#b',
            width: 100,
            align: {
                baseXY: [200, 0]
            }
        });
        o2.show();
    });
    ````

liquidluck 支持 livereload，修改文件后会动态刷新浏览器。

详情可看[文档](local-development.html)。

## 编写测试用例

Arale 提供 mocha 作为测试框架，开发者只要关注如何写好测试用例。

修改 `package.json` 配置测试用例，通过 `命名 + '-spec.js'` 拼装去找文件。

```
"tests": ["example"]
```

修改 `tests/overlay-spec.js` 文件，开始写测试用例，可以直接看示例。

访问 [http://127.0.0.1:8000/tests/runner.html](http://127.0.0.1:8000/tests/runner.html) 查看是否正确。

## 部署文件

修改 `package.json` 配置打包方式

```
"output": {
    "example.js": "."
}
```

`'.'` 意味着只打包组件内部的文件（包括依赖的文件），由于 example.js 没有依赖所以就相当于 `"example.js": ["examples.js"]`。

最常用的为以下三种，具体配置的参数可查看[文档](https://github.com/spmjs/spm/wiki/package.json-:-output)。

```
{
    "a.js": ".",  // 将依赖组件内部的文件打包成一个文件
    "b.js": "*",  // 将所有依赖的文件打包成一个文件
    "c.js": ["c.js", "d.js"]  // 将指定文件打包成一个
}
```

开始打包，build 后会在 dist 目录生成打包的文件和 -debug 文件。

```
$ spm build
```

查看 [build 参数](https://github.com/spmjs/spm/wiki/%E5%91%BD%E4%BB%A4%E8%A1%8C%E5%8F%82%E6%95%B0)进行定制

上传到源

```
$ spm upload
```




