#校验规则组合


<link charset="utf-8" rel="stylesheet" href="http://assets.alipay.com/al/alice.components.ui-form-1.0-src.css" />
<link charset="utf-8" rel="stylesheet" href="http://assets.alipay.com/al/alice.components.ui-button-orange-1.1-full.css" />

注册表单中有一个常见的场景是：用户名是电子邮箱或者密码。但是我们拥有的校验规则是电子邮箱和手机号码，应该怎么办？

使用校验规则组合可以组合出新的规则完成这种校验。

<div class="cell">

    <form id="test-form" class="ui-form" data-widget="validator">

        <div class="ui-form-item">
            <label for="username" class="ui-label"><span class="ui-form-required">*</span>用户名：</label>
            <input id="username" name="username" class="ui-input" required data-display="用户名" data-rule="emailOrMobile" />
            <div class="ui-form-explain">用户名为电子邮箱或手机号码。</div>
        </div>

        <div class="ui-form-item">
            <span class="ui-button-morange ui-button"><input class="ui-button-text" value="确定" type="submit"></span>
        </div>

    </form>

</div>


```javascript

seajs.use(['widget', '$', 'validator'], function(Widget, $, Validator) {
    $(function() {
        //1. 获取校验规则对象
        var email = Validator.getRule('email');
        //2. 组合校验规则
        var emailOrMobile = email.or('mobile');
        //3. 注册新的校验规则
        Validator.addRule('emailOrMobile', emailOrMobile, '{{display}}的格式必须是电子邮箱或者手机号码。');

        Widget.autoRenderAll();
    });
});

```
