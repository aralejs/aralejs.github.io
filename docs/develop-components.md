# 开发一个 Arale 模块

- order: 3

---

这个教程会简单说明一个组件的开发流程，通过一个 [example](https://github.com/aralejs/example) 的示例让你有切身体会，你也可以跟着一起做哦。

## 安装

先遵循 [Getting Started](getting-started.html) 完成安装。

然后安装文档调试工具 liquidluck，更多可查看[文档](https://github.com/aralejs/liquidluck-theme-arale2)

```
$ sudo pip install -U liquidluck
$ sudo pip install -U tornado
$ liquidluck install alipay/arale2 -g
```

    
## 初始化项目

先想好组件的名字，这里有[命名规范](https://github.com/alipay/arale/wiki/%E6%96%87%E4%BB%B6%E5%91%BD%E5%90%8D%E4%B8%8E%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84)，我们的示例就叫 `example`。

那我们开始创建项目

```
$ mkdir example
$ cd example
$ spm init
>>> PROJECT NAME: example
>>> GENERATE /Users/popomore/example/examples/index.md
>>> GENERATE /Users/popomore/example/.gitignore
>>> GENERATE /Users/popomore/example/package.json
>>> GENERATE /Users/popomore/example/README.md
>>> GENERATE /Users/popomore/example/src/example.js
>>> GENERATE /Users/popomore/example/tests/runner.html
>>> GENERATE /Users/popomore/example/tests/example-spec.js
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
git remote add origin git@github.com:aralejs/example.git
git push origin master
```

## 组件设计

假设 `example` 要实现这样一个功能

> 有一个浮层，鼠标点击某个位置，浮层就会滑到那个位置

开始设计 API，修改 RAEDME.md。

    # Example
        
    ---
    
    ## API
    
    ### 属性
    
    #### initPos *Array*
    
    浮层初始化的位置
    
    #### align *Array*
    
    对齐方式，以浮层的某个点为准进行移动
    
     -  [0, 0] 为左上角
     -  ['50%', '50%'] 为中心点
    
    ### 方法
    
    #### moveTo(pos)
    
    移动到某个位置，pos 为坐标

## 进行开发

完善 `package.json` 的信息，添加 description 和 root。

    "name": "example",
    "version": "1.0.0",
    "root": "arale",
    "description": "这是 Arale 的一个示例，点击某处浮层能滑到那个位置"
    
**注意：** `package.json` 为 json 文件，需要用双引号才合法，可以查看[详细配置](https://github.com/seajs/spm/wiki/package.json)。
    
分析组件的依赖，`example` 组件需要 `jquery` 和 `overlay`，查看现有版本

```
$ spm search overlay
overlay:
  0.9.10: [overlay.js,mask.js]
  0.9.9: [mask.js,overlay.js]
```

`package.json` 中添加依赖

```
"dependencies": {
    "$": "$",
    "overlay": "arale/overlay/0.9.10/overlay"
},
```

安装依赖，会把 dependencies 配置的都下载下来

```
$ spm install
```
    
修改 `src/example.js` 进行开发，提服务进行调试

```
$ make debug
```

通过浏览器访问 [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

## 本地调试

demo 也使用 md 编写，这样写起来非常方便，除了基本的 markdown 预发还支持[额外的特性](https://github.com/aralejs/liquidluck-theme-arale2#%E6%96%87%E6%A1%A3%E7%BC%96%E8%BE%91)。

在 `examples/index.md` 添加实例化代码，demo 引用的为源码，修改即展示。

    ````javascript
    seajs.use('../src/example', function(Example) {
        new Example({
            initPos: ['50%', '50%'],
            alignPos: ['50%', '50%']
        }).show();
    });
    ````

liquidluck 支持 livereload，修改文件后会动态刷新浏览器。

详情可看[文档](local-development.html)。

## 编写测试用例

arale2 提供 jasmine 作为测试框架，开发者只要关注如何写好测试用例。

修改 `package.json` 配置测试用例，通过 `命名 + '-spec.js'` 拼装去找文件。

```
"tests": ["example"]
```

修改 `tests/example-spec.js` 文件，开始写测试用例，可以直接看示例。

访问 [http://127.0.0.1:8000/tests/runner.html](http://127.0.0.1:8000/tests/runner.html) 查看是否正确。

## 部署文件

修改 `package.json` 配置打包方式

```
"output": {
    "example.js": "."
}
```

`'.'` 意味着只打包组件内部的文件（包括依赖的文件），由于 example.js 没有依赖所以就相当于 `"example.js": ["examples.js"]`。

最常用的是三种，具体配置的参数可查看[文档](https://github.com/seajs/spm/wiki/package.json-:-output)。

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

查看 [build 参数](https://github.com/seajs/spm/wiki/%E5%91%BD%E4%BB%A4%E8%A1%8C%E5%8F%82%E6%95%B0)进行定制



