# 开发一个 Arale 模块

- order: 3

---

这个教程会简单说明一个组件的开发流程，通过一个 [example](http://git.alipay.im/other_example/master/tree) 的示例让你有切身体会，你也可以跟着一起做哦。

## Installation

为了更方便的写 arale2 的组件，我们提供了一些工具帮助我们打包部署，生成文档以及本地开发。

### 安装 node 和 npm

进入 [http://nodejs.org/#download](http://nodejs.org/#download)下载并安装

spm 使用的 `node >0.8.0`，如通过包管理工具安装需要注意。 

### 安装 git

代码是用 git 做版本控制工具的，下载地址如下

 -  [git for mac](http://code.google.com/p/git-osx-installer/)
 -  [git for windows ](http://code.google.com/p/msysgit/)
 
对 git 不熟的可以看下这个[简易指南](http://rogerdudler.github.com/git-guide/index.zh.html)

### 安装 spm

[spm](https://github.com/seajs/spm/wiki) 为 arale2 的打包部署工具，可通过以下两种方式安装

1.  通过 npm 安装

    ```
    $ sudo npm install spm -g
    ```

2.  通过源码安装可获得最新的功能

    ```
    $ git clone https://github.com/seajs/spm.git
    $ cd spm
    $ sudo npm install -g
    ```
 
配置成公司内部源，修改 ~/.spm/config.json 文件

```
{"sources": ["arale.alipay.im:8000"]}
```

### 安装 nico

[nico](https://github.com/alipay/liquidluck-theme-arale) 为 arale2 的文档生成工具，一键安装

```
sudo curl https://raw.github.com/alipay/liquidluck-theme-arale/master/nico -o /usr/bin/nico && sudo chmod +x /usr/bin/nico && nico upgrade
```
    
## 初始化项目

先想好组件的命名，这里有[命名规范](naming-convention.html)，我们的示例就叫 `example`。然后在 gitlab 中创建一个库，这里有[教程](gitlab.html)。

创建的地址为 `git@git.alipay.im:other_example.git`

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
|  |- runner.html      <- 单元测试页面
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
git remote add origin git@git.alipay.im:other_example.git
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


修改 `package.json`，添加 description，业务组件要修改 root

    "name": "example",
    "version": "1.0.0",
    "root": "alipay",
    "description": "这是 arale2 的一个示例，点击某处浮层能滑到那个位置"

**注意：** `package.json` 为 json 文件，需要用双引号才合法，可以查看[详细配置](https://github.com/seajs/spm/wiki/package.json)。

生成文档，详情可查看[文档教程](liquidluck-document.html)

```
$ nico build
$ nico server
```

通过浏览器访问 [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

## 进行开发

分析组件的依赖，`example` 组件需要 `jquery` 和 `overlay`，查看现有版本

```
$ spm search overlay
overlay:
  0.9.10: [overlay.js,mask.js]
  0.9.9: [mask.js,overlay.js]
```

配置 `package.json`

```
"dependencies": {
    "$": "$",
    "overlay": "0.9.10"
},
```

**注意：**

 -  `jquery` 是全局引用的，所以不需要指定版本，引用的时候写成 `require('$')`
 
 -  组件配置版本有两种方式，如果前后命名相同可直接写版本号，**alipay 不可省略**
 
    ```
    "overlay": "overlay/0.9.10/overlay",
    "xbox": "alipay/xbox/0.9.10/xbox"
    ```
    
修改 `src/example.js` 进行开发

TODO: 如何开发

## 本地调试

demo 也使用 md 编写，这样写起来非常方便，除了基本的 markdown 预发还支持[额外的特性](https://github.com/alipay/liquidluck-theme-arale#%E7%BC%96%E8%BE%91)。

在 `examples/index.md` 添加实例化代码，demo 引用的为源码，修改即展示。

    ````javascript
    seajs.use('../src/example', function(Example) {
        new Example({
            initPos: ['50%', '50%'],
            alignPos: ['50%', '50%']
        }).show();
    });
    ````

执行 `nico build`，访问 [http://127.0.0.1:8000/examples/](http://127.0.0.1:8000/examples/)

nico 支持 livereload，修改文件后会动态刷新浏览器。

详情可看[文档](liquidluck-example.html)。

## 编写测试用例

arale2 提供 jasmine 作为测试框架，开发者只要关注如何写好测试用例，可以来读读[这篇文章]()。

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

最常用的是三种，具体配置的参数可查看[文档](https://github.com/seajs/spm/wiki/SPM-%E9%85%8D%E7%BD%AE%E8%AF%A6%E8%A7%A3%E4%B9%8Boutput%E7%AF%87)。

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

开始部署，deploy 会把文件发布到 assets.dev.alipay.net 上，deploy 时也会执行 build。

```
$ spm deploy
```

这里要注意下 `package.json` 的 root 属性

 -  如果 root 为 # 或不存在，则会发布到 arale 目录下
 -  如果 root 为 alipay， 则会发布到 alipay 目录下

## 发布文件

发布文件需要生成 zip 包

```
$ spm build --zip
```

将这个文件上传到 udcenter 上，这里注意生成的包是没有 root 的，所以上传时要在 arale 或 alipay 目录下。

上传完后需要手工切 tag，example 切的是 1.0.0 版本

```
$ git tag 1.0.0
```

如果需要在原来版本修改，可以先删除 tag，再重新切 tag，**不过不建议这样操作**。

```
$ git tag -d 1.0.0
$ git tag 1.0.0
```

