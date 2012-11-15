# Getting Started

- order: 2

---

## 安装

Arale 会使用一些工具帮你完成大部分的自动化工作。

### 安装 node 和 npm

进入 [http://nodejs.org/#download](http://nodejs.org/#download)下载并安装

spm 使用的 `node >0.8.0`，如通过包管理工具安装需要注意。 

### 安装 git

Arale 代码使用 git 做版本控制工具，下载地址如下

 -  [git for mac](http://code.google.com/p/git-osx-installer/)
 -  [git for windows ](http://code.google.com/p/msysgit/)
 
对 git 不熟的可以看下这个[简易指南](http://rogerdudler.github.com/git-guide/index.zh.html)

### 安装 spm

[spm](https://github.com/seajs/spm/wiki) 为 Arale 的打包部署工具，安装如下


```
$ sudo npm install spm -g
```
 
配置 Arale 的源(只读)，修改 ~/.spm/config.json 文件

```
{
  "sources": ["modules.aralejs.org", "modules.seajs.org"]
}
```

## 使用 Arale

可直接使用支付宝的 CDN

    <script charset="utf-8" id="seajsnode" 
       src="http://static.alipayobjects.com/seajs/1.2.1/??sea.js,plugin-combo.js"></script>
    <script>
      seajs.config({
        alias: {
          '$': 'gallery/jquery/1.7.2/jquery'
        }
      });
      seajs.use(['$', 'arale/popup/0.9.8/popup'], function($, Popup){
        // use jQuery and Popup
      });
    </script>

也可以本地部署，通过 spm 下载到本地

```
$ spm install seajs@1.2.1
$ spm install gallery.jquery@1.7.2
$ spm install arale.popup@0.9.8
```

在页面上配置

    <script charset="utf-8" id="seajsnode" 
       src="sea-modules/seajs/1.2.1/sea.js"></script>
    <script>
      seajs.config({
        alias: {
          '$': 'gallery/jquery/1.7.2/jquery'
        }
      });
      seajs.use(['$', 'arale/popup/0.9.8/popup'], function($, Popup){
        // use jQuery and Popup
      });
    </script>

## 找组件

Arale 每个组件都提供使用文档、API 文档、DEMO 以及测试用例。可以访问[首页](http://aralejs.org/)找到你喜欢的组件。

Arale 的组件共分成3类（[怎么划分的?](https://github.com/alipay/arale/wiki/Arale-2.0-%E5%9F%BA%E7%A1%80%E6%9E%B6%E6%9E%84)）

 -  `infrastruture` 基础设施
 -  `utility` 工具类
 -  `widget` UI 组件

## 提问？回答！

如果有问题，欢迎提 issue 沟通，这种方式有很多好处

 -  可以详细描述问题，并且有据可循。
 
 -  可以对版本进行管理，升级的时候能列出所有的改动点，并且改动原因。
 
 -  可以合理安排时间，统一解决问题。
 
如某个组件有问题可以点击页面左边的「讨论」链接。

## 还没完

上面只是简单的介绍，接下来跟我们一起[写个组件](develop-components.html)！


