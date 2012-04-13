
## 概要

Jasmine 是一个优秀的 JavaScript 测试框架，核心理念是 BBD（行为驱动开发）。它不依赖其他
JavaScript 类库，也不需要 DOM. 使用 Jasmine 可以很容易写出简洁、清晰的测试用例：

````javascript
describe("Jasmine", function() {
  it("makes testing JavaScript awesome!", function() {
    expect(yourCode).toBeLotsBetter();
  });
});
````


## 使用说明

Jasmine 官方文档：http://pivotal.github.com/jasmine/

在 Arale 项目中使用时，更简单：

1. 首先组件文件遵循 [文件命名与目录结构](https://github.com/alipay/arale/wiki/文件命名与目录结构)
1. `tests/runner.html` 的内容为：

````html
<!doctype html>
<html>
<head>
<title>Jasmine Spec Runner</title>
<script src="../../../tools/jasmine-runner.js"></script>
</head>
<body>
</body>
</html>
````

这样就可以开始愉悦的 BDD 之旅了。
