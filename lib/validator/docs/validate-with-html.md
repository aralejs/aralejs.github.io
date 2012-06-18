#Validate with HTML

这是一个 step by step 的教程教会你如何在 HTML 中定制表单校验。

1.  启用校验

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

2.  配置 Validator

3.  给表单域添加校验规则等配置项。

4.  自定义错误提示消息。
