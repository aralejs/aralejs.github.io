# 支付宝入门指南

- order: 1
- category: alipay

---

> 在使用 Arale 之前可以先看一下 [seajs](http://seajs.org/docs/) 和 [spm](https://github.com/spmjs/spm/wiki) 的文档。

## 支付宝内部源

支付宝内部统一使用内部源，有很多内部定制的功能，编辑 `vi ~/.spm/config.json`。

```
{
  "sources": ["modules.alipay.im"]
}
```

## seajs 配置

在所有的 `head.vm` 文件部署 seajs，部署 seajs 的 cms 为 `alipay/tracker/seajs.vm`，你只要确定系统中是否已经存在这个区域。

    <script charset="utf-8" id="seajsnode" 
        src="https://a.alipayobjects.com/seajs/1.2.1/??sea.js,plugin-combo.js"></script>
    <script>
        seajs.config({
            alias: {
              '$'         : 'gallery/jquery/1.7.2/jquery',
              '$-debug'   : 'gallery/jquery/1.7.2/jquery-debug',
              'jquery'    : 'gallery/jquery/1.7.2/jquery'
            }
        });
    </script>


seajs 的 base 为 https://a.alipayobjects.com ，这是由 seajs 的存放目录决定的。线上的部署目录为

```
a.alipayobjects.com
    | - seajs
    | - gallery
    | - arale
    | - alipay
    | - cashier
    | - personal
    ` - ...
```

支付宝使用3个公共 root：gallery、arale、alipay，除此之外还有系统 root，如 cashier，personal。

每个组件的 id 形式为 `{{root}}/{{module}}/{{version}}/{{file}}`，比如 xbox 的 id 为 `alipay/xbox/0.9.8/xbox`，同时这也是文件路径，使用 xbox 可直接 use。

```
seajs.use('alipay/xbox/0.9.8/xbox', function(Xbox) {
    // use Xbox
});
```

## 查看组件

> validator 最新的版本是什么？

> xbox 0.9.8 到底上线了没有？

经常会遇到这种问题，现在大家可以通过 [online status](online-status.html) 查看组件的状态。

## 开发 alipay 组件

alipay 组件存放在 http://git.alipay.im/ 下，先到这里创建一个库，命名要加 `alipay.` 前缀。

根据[组件编写文档](./develop-components.html)进行开发。

**注意：** root 要配成 alipay。

开发完成后可以通过 `spm deploy --to=dev` 部署到 assets 服务器，`dev` 是对应的坑位。详细查看 [spm deploy 文档](https://github.com/spmjs/spm/wiki/spm-deploy)

如果有多个项目需要使用，要建个任务单发布到 test 环境，test 环境会定时同步到所有的开发环境。

## 开发系统组件

以 personal 消费记录为例子

在 /static 目录创建 consume 目录，在 consume 下执行 `spm init`。

**注意：** root 要配成系统名。

需要忽略部分文件，在组件当前目录输入

```
$ svn propset svn:ignore '.gitignore' ./ 
$ svn propset svn:ignore '_site' ./
$ svn propset svn:ignore 'sea-modules' ./
```

其他可以参考 alipay 组件开发。

