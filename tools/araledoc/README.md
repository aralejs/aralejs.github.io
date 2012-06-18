# Arale Doc Generator

## 安装

Mac 用户需要安装 Xcode 的 command line tools。

```
$ python setup.py install
```

如果你使用的是系统级的 PATH，没做什么处理的话，应该都是系统级的。需要

```
$ sudo python setup.py install
```

## 使用

### 目录结构

```
arale/
    lib/
        calendar/                <----- package name
            README.md            <----- package home page
            package.json
            src/
            examples/
                index.md         <----- package examples
```

### package.json

参考 [package.json](http://package.json.nodejitsu.com/)，必填项：

1. name
2. version

### 单个项目文档

在 arale 目录这一层调用 ``araledoc {{name}}``，例如 calendar:

```
$ araledoc calendar
```

将会生成 calendar 的文档与 exmaples ，生成结果位于：

```
arale/
    docs/
        calendar/
            index.html
            examples/
                index.html
```

### 整站文档
