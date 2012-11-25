# Getting Started

- order: 2

---

## 快速上手

通过下面的代码可直接使用组件，此处使用支付宝的 CDN。

```html
<script charset="utf-8" id="seajsnode" 
   src="http://static.alipayobjects.com/seajs/1.2.1/??sea.js,plugin-combo.js"></script>
<script>
  seajs.config({
    alias: {
      '$': 'gallery/jquery/1.7.2/jquery',
      'popup': 'arale/popup/0.9.9/popup'
    }
  });
  seajs.use(['$', 'popup'], function($, Popup){
    // use jQuery and Popup
  });
</script>
```

如果想把静态文件部署到自己的服务器，可继续

## 安装

Arale 会使用一些工具帮你完成大部分的自动化工作。

### 安装 node 和 npm

进入 [http://nodejs.org/#download](http://nodejs.org/#download) 下载并安装

spm 使用的 `node >0.8.0`，如通过包管理工具安装需要注意。 

### 安装 spm

[spm](https://github.com/seajs/spm/wiki) 为 Arale 的打包部署工具，安装如下

```
$ sudo npm install spm -g
```
 
配置 Arale 的源(只读)，修改 ~/.spm/config.json 文件

```
{"sources": ["modules.spmjs.org"]}
```

## 下载依赖

如上面的例子，我们需要 seajs、jquery、popup，可以通过 spm 直接下载。

```
$ spm install seajs@1.3.0
$ spm install gallery.jquery@1.7.2
$ spm install arale.popup@0.9.9
```

如不加 `@版本号` 会下载最新版本。所有的组件都会下载到 sea-modules 目录下，目录结构为

```
sea-modules
  | - seajs
  |  ` - 1.3.0
  |     ` - sea.js
  | - gallery
  |  ` - jquery
  |     ` - 1.7.2
  |        ` - jquery.js
  | - arale
     ` - popup
        ` - 0.9.9
           ` - popup.js
```



## 使用 Arale

在当前目录新建页面（与 sea-modules 并列），如下配置

```html
<script charset="utf-8" id="seajsnode" 
   src="sea-modules/seajs/1.3.0/sea.js"></script>
<script>
  seajs.config({
    alias: {
      '$': 'gallery/jquery/1.7.2/jquery',
      'popup': 'arale/popup/0.9.9/popup'
    }
  });
  seajs.use(['$', 'popup'], function($, Popup){
    // use jQuery and Popup
  });
</script>
```

## 提问？回答！

如果有问题，欢迎提 issue 沟通，这种方式有很多好处

 -  可以详细描述问题，并且有据可循。
 
 -  可以对版本进行管理，升级的时候能列出所有的改动点，并且改动原因。
 
 -  可以合理安排时间，统一解决问题。
 
如某个组件有问题可以点击页面左边的「讨论」链接。

## 还没完

上面只是简单的介绍，接下来跟我们一起[写个组件](develop-components.html)！


