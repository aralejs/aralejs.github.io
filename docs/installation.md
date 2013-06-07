# 环境与工具配置

- order: 3
- category: arale

---

## 环境准备

### 安装 node

作为一个前端，你需要 node 环境，[下载地址](http://nodejs.org/download/)

你也可以[通过包管理工具安装](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)

### 设置 PATH 和 NODE_PATH

**在配置前你要明白自己在做什么。**

`PATH` 是给 bin 文件用的，一般 `PATH` 会有多个目录，以冒号分隔。当输入一个命令的时候，会按照目录的先后顺序查找，找到后执行这个命令。

在配置 `PATH` 的时候要确认 node 安装的位置，找到 bin 文件夹，把他放在 PATH 最前面，如 `/usr/local/bin`。

`NODE_PATH` 在 require 的时候会用到，看看[官方说明](http://nodejs.org/api/modules.html#modules_loading_from_the_global_folders)，require 全局模块的时候会到 `NODE_PATH` 下找。

`NODE_PATH` 的配置一般都是相对于 bin 的，如 `/usr/local/lib/node_modules`。

如果你的 node 文件为 `/usr/local/bin/node`，那

```
export PATH=/usr/local/bin:$PATH
export NODE_PATH=/usr/local/lib/node_modules
```

把他加到你的 `.bash_profile` 或 `.zshrc` 中。

### npm prefix

有时你会发现 npm 的安装目录和 `NODE_PATH` 不是同一个。npm install 会安装到 `/usr/local/share/npm/lib/node_modules`，但 `NODE_PATH` 为 `/usr/local/lib/node_modules`。

这是因为你设置了 prefix (可能是编译的时候加的) 为 `/usr/local/share/npm`。

查看 prefix

```
npm config get prefix
```

修改 prefix

```
npm config set prefix /usr/local
```

### 去除 sudo

使用 npm 安装模块的时候经常要输入 sudo，还要输入密码，这点很让人烦躁。下面你可以简单粗暴的去除 sudo（看看作者的[软文](http://howtonode.org/introduction-to-npm)）

```
sudo chown -R $USER /usr/local
```

也可以使用 [nvm](https://github.com/creationix/nvm/) 来管理 node 的安装目录和版本，你可以安装在任何目录而不是 `/usr/local`

### 安装 git

版本管理工具也是必须的，可以先[了解 git 的相关内容](http://rogerdudler.github.com/git-guide/index.zh.html)

git 下载地址如下

 -  [git for mac](https://code.google.com/p/git-osx-installer/downloads/list?can=3&q=&sort=-uploaded&colspec=Filename+Summary+Uploaded+Size+DownloadCount)

 -  [git for windows ](https://code.google.com/p/msysgit/downloads/list?q=full+installer+official+git)

## 安装工具

### 支付宝套件

支付宝的同学可以略过下面的内容，直接安装一个套件

```
npm install spm -g
npm install spm-alipay-suite -g
```

### 安装 spm

目前存在 [spm1.x](https://github.com/spmjs/spm/wiki) 和 [spm2](http://docs.spmjs.org/) 两个版本

```
npm install spm -g
```

**spm1.x 已经不再更新**，如需要使用可安装 1.7.x 版本

```
npm install spm@1.7.x -g
```

### 安装 spm-build

[spm-build](https://github.com/spmjs/spm-build) 为构建工具

```
npm install spm-build -g
```

### 安装 spm-init

[spm-init](https://github.com/spmjs/spm-init) 为初始化模板工具

```
npm install spm-init -g
```

下载 Arale 和 Alice 模板

```
spm-init -i aralejs/template-arale
spm-init -i aralejs/template-alice
```

### 安装 nico

[nico](https://github.com/lepture/nico) 是文档工具

```
npm install nico -g
```

下载 Arale 和 alice 模板

```
git clone https://github.com/aralejs/nico-arale.git ~/.spm/themes/arale
git clone https://github.com/aliceui/nico-alice.git ~/.spm/themes/alice
```

## windows 环境

推荐使用 windows 的包管理工具 [chocolatey](https://github.com/chocolatey/chocolatey)

安装 nodejs 和 git

```
c:\> cinst git.install
c:\> cinst nodejs.install
```

设置环境变量

```
PATH = C:\Users\{{username}}\AppData\Roaming\npm
NODE_PATH = C:\Users\{{username}}\AppData\Roaming\npm\node_modules
```
