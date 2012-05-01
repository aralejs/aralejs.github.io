
# Jasmine

Jasmine 是一个优秀的 JavaScript 测试框架，核心理念是 BBD（行为驱动开发）。它不依赖其他
JavaScript 类库，也不需要 DOM. 使用 Jasmine 可以很容易写出简洁、清晰的测试用例：

```js
describe("Jasmine", function() {
    it("makes testing JavaScript awesome!", function() {
        expect(yourCode).toBeLotsBetter();
    });
});
```

---


## 使用说明

Jasmine 官方文档：http://pivotal.github.com/jasmine/

在 Arale 项目中使用时，更简单：

1. 首先按照 [文件命名与目录结构](https://github.com/alipay/arale/wiki/文件命名与目录结构) 规范组织好组件文件。
2. 然后创建 `tests/runner.html` ：
```html
<!doctype html>
<html>
<head>
<title>Jasmine Spec Runner</title>
<script src="../../../tools/jasmine-runner.js"></script>
</head>
<body>
</body>
</html>
```
3. 编辑 `package.json` 文件中的 `tests` 字段，加入需要测试 spec 名称。

这样就可以开始愉悦的 BDD 之旅了。


## 更新

当 Jasmine 发布新版本，需要更新时，只要运行：

```
$ node update.js
```

然后更改 `tools/jasmine-runner.js` 中的版本号就好。
