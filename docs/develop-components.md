# 开发一个 Arale 模块

- order: 4
- category: arale

---

### 相关文档

1. 基于 widget 开发组件 (TODO)
2. 写好测试用例 (TODO)
3. [开发规范](http://aralejs.org/docs/rules.html)

---

这个教程会简单说明一个组件的开发流程，通过[一个示例](http://puzzle.chuo.me/examples/)让你有切身体会，你也可以跟着一起做哦。

源码地址为：[https://github.com/popomore/puzzle](https://github.com/popomore/puzzle)

## 安装

首先需要[安装 spm](https://github.com/spmjs/spm/wiki/%E5%AE%89%E8%A3%85)。

### git

Arale 代码使用 git 做版本控制工具，下载地址如下

 -  [git for mac](http://code.google.com/p/git-osx-installer/)

 -  [git for windows ](http://code.google.com/p/msysgit/)

对 git 不熟的可以看下这个[简易指南](http://rogerdudler.github.com/git-guide/index.zh.html)

### nico

安装文档工具，如果是 Window 用户查看[其他安装方法](https://github.com/aralejs/nico-arale#3-%E5%AE%89%E8%A3%85-arale-theme)。

```
curl https://raw.github.com/aralejs/nico-arale/master/bootstrap.sh | sudo sh
```
    
## 初始化组件项目

组件和目录的名称要符合 [a-z\d-]，并以英文字母开头，首选合适的英文单词，**禁止使用驼峰**。

先来看看整个组件的结构，这样会有一个直观的感受。

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
  -- sea-modules            spm install 生成，存放依赖的其他组件
  -- _site                  nico 生成，存放站点
  -- HISTORY.md             版本更新说明
  -- README.md              组件总体说明
  -- package.json           版本等元信息
  -- .gitignore             git 忽略某些文件
  -- .travis.yml            travis 持续集成的配置
```

那我们初始化一个项目看看

```
$ mkdir puzzle
$ cd puzzle
$ spm init
prompt: Please select module type:
1: -> arale(arale module template):  1
prompt: Define value for property 'root': :  arale
prompt: Define value for property 'name': :  puzzle
>>> GENERATE /Users/popomore/tmp/overlay/examples/index.md
>>> GENERATE /Users/popomore/tmp/overlay/.gitignore
>>> GENERATE /Users/popomore/tmp/overlay/Makefile
>>> GENERATE /Users/popomore/tmp/overlay/package.json
>>> GENERATE /Users/popomore/tmp/overlay/README.md
>>> GENERATE /Users/popomore/tmp/overlay/src/puzzle.js
>>> GENERATE /Users/popomore/tmp/overlay/tests/puzzle-spec.js
```

初始化的时候需要选择模板，root 为 arale，name 为组件名。初始化完成后会生成一个骨架，在这个基础上进行开发更方便，之后可以提交到版本库了，当然你可以在 github 上建一个。
 
```
git init
git add .
git commit -m 'init'
git remote add origin git@github.com:popomore/puzzle.git
git push origin master
```

## 进行开发

首先分析组件的依赖，比如 `puzzle` 需要 `popup`。

根据 ID 规则要查看 `widget` 的版本，使用 `spm search` 的时候也要加 root 哦。

```
$ spm search arale.popup
popup:
  versions:
    0.9.9:
      - popup.js
    0.9.10:
      - popup.js
    0.9.11:
      - popup.js
```

在 `package.json` 中添加依赖

```
"dependencies": {
    "$": "$",
    "popup": "arale/popup/0.9.11/popup"
}
```

**注意：** `package.json` 为 json 文件，需要用双引号才合法，可以查看[详细配置](https://github.com/spmjs/spm/wiki/package.json)。

使用 `spm install` 下载依赖，会把 dependencies 配置的组件都下载到 sea-modules 下。`jquery` 配置为 $ 是因为使用了别名配置，不需要完整的依赖路径。

```
$ spm install
```

修改 `src/puzzle.js` 进行开发，启服务进行调试

```
$ make debug
```

通过浏览器访问 [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

## 本地调试

examples 也使用 md 编写，这样写起来非常方便，除了基本的 markdown 语法还支持[额外的特性](https://github.com/aralejs/nico-arale#%E6%96%87%E6%A1%A3%E7%BC%96%E8%BE%91)。

在 `examples/index.md` 添加实例化代码，puzzle 已添加别名，可以直接 use。

    ````javascript
    seajs.use('puzzle', function(Puzzle) {
        
    });
    ````

nico 支持 livereload，只要通过 `make debug` 或 `make watch` 启动服务，修改文件后都会自动构建和刷新浏览器。

[查看 Makefile 的配置](https://github.com/aralejs/nico-arale#%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E)

## 编写测试用例

Arale 提供 [mocha](https://github.com/visionmedia/mocha) 作为测试框架，开发者只要关注如何写好测试用例。

修改 `package.json` 配置哪些文件需要测试，通过 **命名 + '-spec.js'** 拼装去找文件。

```
"tests": ["puzzle"]
```

修改 `tests/puzzle-spec.js` 文件，开始写测试用例，可以直接看[示例](https://github.com/popomore/puzzle/blob/master/tests/puzzle-spec.js)。

访问 [http://127.0.0.1:8000/tests/runner.html](http://127.0.0.1:8000/tests/runner.html) 查看是否正确。

Arale 已经配置 travis，只要开通就可以**持续集成**。[登录 travis](https://travis-ci.org/profile)，开启 travis。

## 部署文件

修改 `package.json` 配置打包方式

```
"output": {
    "puzzle.js": "."
}
```

`'.'` 意味着只打包组件内部的文件（包括依赖的文件），由于 puzzle.js 没有依赖所以就相当于 `"puzzle.js": ["puzzle.js"]`。

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




