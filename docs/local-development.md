# 本地开发

- order: 4

---

Arale 可以很方便的在本地开发和调试组件，可以先看看[如何开发一个组件](develop-components.html)。

## Makefile

Arale 的一些本地部署命令通过 Makefile 设置，这个文件在 `spm init` 会生成。

 -  make doc

    编译生成站点

 -  make server

    本地启动一个站点，可通过 http://127.0.0.1:8000 访问

 -  make debug

    本地启动一个调试模式的站点，可通过 http://127.0.0.1:8000 访问
    
    如果使用调试模式需要先运行 `spm install`，将依赖的模块下载到本地。


Makefile 文件，如果是 Windows 用户可[安装 Cygwin](https://github.com/aralejs/liquidluck-theme-arale2#%E5%86%99%E7%BB%99-windows-%E7%94%A8%E6%88%B7)

```
THEME = $(HOME)/.liquidluck-themes/arale2

doc:
	liquidluck build -v -s $(THEME)/settings.yml

debug:
	liquidluck server -d -s $(THEME)/settings.yml

server:
	liquidluck server -s $(THEME)/settings.yml
```

## arale-helper

这个 [helper](https://github.com/aralejs/liquidluck-theme-arale2/blob/master/static/js/arale-helper.js) 文件帮助我们在各种环境切换模块的引用地址。

存在一些规则：

 -  如果是三方模块，会请求 [CDN](https://a.alipayobjects.com) 上的
 
 -  Arale 的模块会访问 [aralejs](http://aralejs.org/source/) 的源
 
 -  如果本地调试会访问本地 sea-modules 目录，这也是 `spm install` 默认安装的目录
 
## 支持 livereload

> 需要安装 tornado 才支持此功能

启动本地站点后，每次修改文件都会重新生成站点，并通知浏览器刷新页面。

## 如何写 examples

在 examples 目录新增 markdown 文件，站点会自动生成页面。

写代码可以用下面的语法，同时生成高亮代码和执行代码。支持 javascript，css，html，可查看[文档](https://github.com/aralejs/liquidluck-theme-arale2#%E6%96%87%E6%A1%A3%E7%BC%96%E8%BE%91)。

    ````javascript
    seajs.use();
    ````

可以直接 use src 下的文件，如 src 下有个 widget.js 文件

    ````javascript
    seajs.use('widget', function(Widget){
        // use it
    });
    ````
    
为了避免样式冲突，我们提供了 iframe 的语法，会将内容生成一个 iframe，这样可以隔离样式和脚本。

    ````iframe
    <link rel="stylesheet" href="css/some.css">
    <button>click</button>
    <script>
        seajs.use('jquery', function($) {
            $('button').click(function() { alert('hello'); })
        });
    </script>
    ````
