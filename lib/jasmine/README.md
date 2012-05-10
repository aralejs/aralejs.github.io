
# Jasmine

Jasmine 是一个优秀的 JavaScript 测试框架，核心理念是 BDD（行为驱动开发）。它不依赖其他
JavaScript 类库，也不需要 DOM. 使用 Jasmine 可以很容易写出简洁、清晰的测试用例：

```js
describe("Jasmine", function() {
    it("makes testing JavaScript awesome!", function() {
        expect(yourCode).toBeLotsBetter();
    });
});
```

---


## 模块依赖

 - [seajs](seajs/README.md)


## 使用说明

Jasmine 官方文档：http://pivotal.github.com/jasmine/

在 Arale 项目中使用时，更简单：

1. 首先按照 [文件命名与目录结构](https://github.com/alipay/arale/wiki/文件命名与目录结构) 规范组织好组件文件。
2. 然后创建 `tests/runner.html`, 文件内容可参考 [events/test/runner.html](events/test/runner.html)

可以参考 [events](events/) 等模块的代码。

赶快开始愉悦的 BDD 之旅吧。


## 更新

当 Jasmine 发布新版本，需要更新时，只要运行：

```
$ cd arale/dist
$ spm install jasmine
```

然后更改 `tools/jasmine-runner.js` 中的版本号就好。
