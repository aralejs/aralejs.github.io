#异步校验

<link charset="utf-8" rel="stylesheet" href="http://assets.alipay.com/al/alice.components.ui-form-1.0-src.css" />
<link charset="utf-8" rel="stylesheet" href="http://assets.alipay.com/al/alice.components.ui-button-orange-1.1-full.css" />

<div class="cell">

    <form id="test-form" class="ui-form" data-widget="validator">
        <div class="ui-form-item">
            <label for="username" class="ui-label"><span class="ui-form-required">*</span>用户名：</label>
            <input id="username" name="username" class="ui-input" required data-display="用户名" data-rule="email checkUsername" />
            <div class="ui-form-explain">用户名为电子邮箱。</div>
        </div>

        <div class="ui-form-item">
            <span class="ui-button-morange ui-button"><input class="ui-button-text" value="确定" type="submit"></span>
        </div>
    </form>

</div>

```javascript

seajs.use(['widget', '$', 'validator'], function(Widget, $, Validator) {
    $(function() {
        Validator.addRule('checkUsername', function(options, commit) {
            var element = options.element,
                item = Validator.query('form').getItem(element);

            item.addClass('ui-form-item-loading');

            $.get('/lib/validator/examples/username.json', function(data) {
                item.removeClass('ui-form-item-loading');
                commit(data.error, data.message);
            });
        });
        Widget.autoRenderAll();
    });
});

```
