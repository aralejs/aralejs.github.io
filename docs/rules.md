# 开发规范

- order: 7
- category: arale

---

## 命名规范

1. 文件和目录名只能包含 [a-z\d\-]，并以英文字母开头
2. 首选合适的英文单词 
3. data api 命名为小写并用连字符，如 data-trigger-type
4. 事件名为驼峰，如 .trigger('itemSelected')
5. 符合规范
   - 常量全大写 UPPERCASE_WORD
   - 变量驼峰 camelName
   - 类名驼峰，并且首字母要大写 CamelName

## 目录结构

整体的目录结构，大部分会由 `spm init` 生成

```
overlay
  -- assets                   存放组件用到的 img 等文件
       -- sprite.png
       -- sprite.psd
  -- docs                     markdown 文档，除了 README 的其他文档
       -- overlay.md
       -- dialog.md
  -- examples                 例子
       -- assets              例子中如果有用到 img 等资源时，存放在该目录
            -- test.png
       -- overlay.html
       -- dialog.html
  -- src                      存放 js, css 文件
       -- overlay.css
       -- overlay.js
       -- dialog.js
  -- tests                    单元测试
       -- overlay-spec.js
       -- dialog-spec.js
       -- runner.html         liquidluck 生成
  -- sea-modules              spm install 生成，存放依赖的其他组件
  -- _site                    liquidluck 生成，存放站点
  -- HISTORY.md               版本更新说明
  -- README.md                组件总体说明
  -- package.json             版本等元信息
  -- .gitignore               git 忽略某些文件
  -- .travis.yml              travis 持续集成的配置
```

## 编码风格

需要通过 JSLint，查看具体[编码风格](https://github.com/aralejs/aralejs.org/wiki/JavaScript-%E7%BC%96%E7%A0%81%E9%A3%8E%E6%A0%BC)

## 注释规范

不建议使用 jsdoc，注释的目的是：**提高代码的可读性，从而提高代码的可维护性。**

查看具体[注释规范](https://github.com/aralejs/aralejs.org/wiki/JavaScript-%E6%B3%A8%E9%87%8A%E8%A7%84%E8%8C%83)

## 文档规范

### README.md

每个组件必须有 README 文件，用来描述组件的基本情况。

```
# 模块名称

-----

该模块的概要介绍。

------

## 使用说明

如何使用该模块，可以根据组件的具体特征，合理组织。

## API

需要提供 API 说明，属性、方法、事件等。
```

### docs

如果组件需要写的东西比较多，可以划分好放到 docs 下。比如竞争者分析，多模块的情况。

### HISTORY.md

记录组件的变更，最好和 issue 绑定。请阅读[历史记录书写规范](https://github.com/aralejs/aralejs.org/wiki/%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E4%B9%A6%E5%86%99%E8%A7%84%E8%8C%83)。

```
### 1.1.0

* [tag:fixed] #18 修复了 XXX 问题
* [tag:fixed] #29 修复了 YYY 问题
* [tag:new] #12 增加了 ZZZ 功能
* [tag:improved] #23 优化了 BBB 代码

### 1.0.0

* [tag:new] 第一个发布版本
```


## Reference

 -  [注释规范](https://github.com/aralejs/aralejs.org/wiki/JavaScript-%E6%B3%A8%E9%87%8A%E8%A7%84%E8%8C%83)

 -  [编码风格](https://github.com/aralejs/aralejs.org/wiki/JavaScript-%E7%BC%96%E7%A0%81%E9%A3%8E%E6%A0%BC)

 -  [编码与文档的讨论](https://github.com/aralejs/aralejs.org/issues/36)

 -  [常用词命名统一表](https://github.com/aralejs/aralejs.org/wiki/%E5%B8%B8%E7%94%A8%E8%AF%8D%E5%91%BD%E5%90%8D%E7%BB%9F%E4%B8%80%E8%A1%A8)
