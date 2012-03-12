Overview
========

此项目来自`https://github.com/balupton/history.js`，加上Arale框架的适配（项目的作者提供了适配API）。主要作用是实现跨浏览器操作历史记录功能，试图通过改变history达到无刷新的体验，通常在富应用(RIA)中广泛使用。

现状
====

此项目的现状是在支持HTML5的现代浏览器中运行良好，在非高级浏览器中通过hash来实现，有bug。所以，此项目的主要目的是探索History API的发展，和对跨浏览器实现的探索。对于线上应用暂时不要使用，对于可以只面向高级浏览器的应用可以使用。注意，使用History API实现无刷新应用体验，对于前后台的应用架构都有一定的挑战。

API文档
======

请移步`https://github.com/balupton/history.js`。
