feature list
=============

*   data-attribute api。

*   异步校验。

*   校验规则的dynamic binding，和unbinding。 

*   关联性校验/级联校验。例如当满足一个条件时校验某种规则，满足另外的条件校验其他规则。应用场景距离：密码再输入一遍。

*   校验规则的组合，与、或、非。


组成
===

*   检验规则工厂`validator.ruleFactory`。它负责维护所有的校验规则和消息提示。

*   校验核心`validator.Core`。它负责校验的执行，校验动作的消息/事件处理，校验提示消息的产生等。

*   data-attribute api支持模块`validator.Parser`，负责将data-attribute解析成校验核心可以理解的对象。

*   一套默认的校验反馈UI处理模块`validator.Ex`，根据支付宝的交互规范定制的特定validator。

校验规则
=====================

提供一个默认的校验规则集合:

    var rules = require('validator.ruleFactory');

API

*   `.setRule`

*   `.setMessage`

*   `.setAsyncRule`

*   `.getRule`

*   `.setCombinedRule`

如何自定义规则：

*   函数类型

        var rules = require('validator.ruleFactory');

        rules.setRule('valueBetween', function(options) {
            var v = Number(options.field.value);
            return v <= options.max && v >= options.min;
        });

        rules.setMessage('valueBetween', '{{name}}必须在{{min}}和{{max}}之间');

*   正则类型

        rules.setRule('phone', /^1\d{10}$/);
        rules.setMessage('phone', '请输入合法的{{name}}');

*   异步检验

        rules.setAsyncRule('checkUseranmeAvailable', function(options, commit) {
            $.post('http://youdomain/checkUsernameAvailable', {username: options.field.value}, function(data) {
                rules.setMessage('checkUseranmeAvailable', data.msg);
                commit(data.state);
            })
        });


检验核心
==============

*   添加校验规则集合：
    
        .registerRules(rules);

    *   `rules` - 必须是规则工厂ruleFactory。

    Example

        var rules = require('validator.ruleFactory'),
            vCore = require('validator').Core;

        vCore.registerRules(rules);

*   校验表单

        .validateForm(formElem, items, callback);

    Example

        vCore.validateForm(formElem, {
            email: {
                rules: ['required', 'lengthBetween']
            },
            password: {
                rules: ['required', 'somerule']
            }
        }, function(b) {

        });

*   添加检验项

        .validateItem(name, cfg)

    Example

        vCore.validateItem('email', {
            rules: ['required', 'lengthBetween{min: 12, max: 13}'],
            name: '电子邮箱',
            msg-success: '您的用户名校验通过！',
            msg-failure: '用户名校验失败！',
            checkOn: ['blur', 'submit'],
            before: function() {},
            after: function() {}
        });


validator.Ex
============



data-attribute API支持
==================

HTML

    <form>
        <input id="username" name="username" type="text" placeholder="请输入邮箱或手机号" data-constraints="@required @emailOrPhone(@email | @phone(/^1\d{10}$/)) @maxLength{min:20} @ajax" data-notice-required="用户名不能为空" data-notice-emailOrPhone="用户名必须为email或者电话号码" data-notice-default="这条信息会显示" />
        
    </form>

JS

    var v = require('validator');
