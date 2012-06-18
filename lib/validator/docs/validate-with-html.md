#Validate with HTML

这是一个 step by step 的教程教会你如何在 HTML 中定制表单校验。

##启用校验

1.  在表单 form 元素上添加 `data-widget="validator"` 来启用表单校验组件。

        <form data-widget="validator">
            ...
        </form

2.  JS 调用。

    在整个页面中添加以下代码：

        seajs.use(['validator-core', '$', 'widget'], function(Validator, $, Widget) {
            $(function() {
                Widget.autoRenderAll();
            });
        });

    这样会初始化页面中所有以 `data-widget=""` 这种形式指定的组件。

##配置 Validator

1.  了解配置项，请参考 [Core 配置项](./api.md#Core-constructor) 和 [Validator 配置项](./api.md#Validator-constructor)。

2.  如何配置？DATA API，即使用 `-` 连接小写字符串的形式，并以前缀 `data-` 开始写入 html attribute 中。

    例如，配置 `triggerType: 'blur'`，需要这样 `<form data-widget="validator" data-trigger-type="blur">`。

##给表单域添加校验规则等配置项

1.  配置项。了解有哪些配置项请参考 [Item 配置项](./api.md#Item-constructor)，配置方式同上。

2.  校验规则。

    支持按照 html5 标准中校验相关标签属性配置校验规则。包括：
    *   required

            <input name="username" required />
    *   type

        请阅读[校验规则文档](./rules.md)了解支持的所有 type 类型。

            <input name="username" type="email" />
    *   min

            <input name="age" min="18" />
    *   max

            <input name="age" max="30" />
    *   minlength

            <input type="password" minlength="5" />
    *   maxlength

            <input type="password" maxlength="20" />
    *   pattern

            <input type="text" name="country_code" pattern="[A-Za-z]{3}" />

    对于除了以上内容之外的校验规则(包括自定义规则)，使用 `data-rule` 指定，多个校验规则以空格隔开。


##自定义错误提示消息

*   data-errormessage

    若配置此项，无论哪个校验规则出错都会强制显示这个错误信息。

*   data-errormessage-{rulename}

    单独配置某一个校验规则的出错信息。

        <input name="uername" required minlength="5" maxlength="20" data-errormessage-required="用户名不能为空" data-errormessage-minlength="密码长度必须大于等于5" data-errormessage-maxlength="密码长度必须小于20" />
