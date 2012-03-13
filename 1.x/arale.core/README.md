Overview
========
`arale.core` 是整个arale框架的核心, 这个模块本身并没有提供任何代码, 只是一个聚合模块, 他把我们常用的几个子模块(arale.base, arale.string, arale.hash, arale.array, arale.dom, arale.event)打包合并为一个文件, 这样主要是为了简化资源访问.

此模块的升级一般是伴随着arale.base模块的升级而升级.

Configuration
=============

`arale.core`是这个框架的核心(包含了arale.base), 在引入这个js之前我们需要进行`araleConfig`的配置.

例如：

    araleConfig = {
        combo_host: 'dev.assets.alipay.net',
        combo_path: '/ar/??'
    }

Usage
=====
参看相关聚合模块的使用
