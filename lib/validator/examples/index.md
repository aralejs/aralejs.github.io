# Validate with HTML

<link charset="utf-8" rel="stylesheet" href="http://assets.alipay.com/al/alice.components.ui-form-1.0-src.css" />
<link charset="utf-8" rel="stylesheet" href="http://assets.alipay.com/al/alice.components.ui-button-orange-1.1-full.css" />

<div class="cell">
    <form id="test-form" class="ui-form" data-widget="validator">
       
        <div class="ui-form-item">
            <label for="username" class="ui-label"><span class="ui-form-required">*</span>用户名：</label>
            <input id="username" name="username" class="ui-input" type="email" required data-display="用户名" />
            <div class="ui-form-explain">用户名为电子邮箱。</div>
        </div>

        <div class="ui-form-item ui-form-item-error">
            <label for="password" class="ui-label"><span class="ui-form-required">*</span>密码：</label>
            <input id="password" name="password" type="password" class="ui-input" data-explain="请输入5-20位的密码。" value="123" required minlength="5" data-display="密码" />
            <div class="ui-form-explain">密码的长度必须大于或等于5。</div>
        </div>

        <div class="ui-form-item">
            <label for="password-confirmation" class="ui-label"><span class="ui-form-required">*</span>重复输入密码：</label>
            <input id="password-confirmation" name="password-confirmation" type="password" class="ui-input" required data-rule="confirmation{target:'#password', name: '第二遍'}" data-errormessage-required="请再重复输入一遍密码，不能留空。" data-display="第一遍" />
            <div class="ui-form-explain">请再输入一遍。</div>
        </div>

        <div class="ui-form-item">
            <label class="ui-label"><span class="ui-form-required">*</span>性别：</label>

            <input id="male" value="male" name="sex" type="radio" required data-errormessage-required="请选择您的性别。"> <label for="male">Male</label>
            <input id="female" value="female" name="sex" type="radio"> <label for="female">Female</label>

        </div>

        <div class="ui-form-item">
            <label class="ui-label"><span class="ui-form-required">*</span>交通工具：</label>
            <label for="Bike"><input class="ui-hidden" required data-errormessage-required="请选择您的交通工具。" name="vehicle" id="Bike" type="checkbox">自行车</label>
            <label for="Car"><input class="ui-hidden" name="vehicle" id="Car" type="checkbox">汽车</label>
        </div>

        <div class="ui-form-item">
            <label class="ui-label"><span class="ui-form-required">*</span>国籍：</label>
            <select name="country" required data-errormessage-required="请选择您的国籍。">
              <option value="">请选择</option>
              <option value="china">China</option>
              <option value="usa">USA</option>
            </select>
        </div>
        <div class="ui-form-item">
            <span class="ui-button-morange ui-button"><input class="ui-button-text" value="确定" type="submit"></span>
        </div>

    </form>
</div>


```javascript

seajs.use(['widget', '$'], function(Widget, $) {
    $(function() {
        Widget.autoRenderAll();
    });
});

```
