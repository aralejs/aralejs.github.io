#Validator

Validator 是表单校验组件。

##Feature List

*   HTML5 form API。

*   data-attribute API。

*   异步校验。

*   校验规则的组合，与、或、非。

*   校验规则的 dynamic binding，和 unbinding。 

*   关联性校验/级联校验。例如当满足一个条件时校验某种规则，满足另外的条件校验其他规则。应用场景举例：密码再输入一遍。

##Quick Example

HTML

    <form id="test-form" data-enable-validate="true">
        <p>
            <label for="username">Username:</label>
            <input id="username" required name="username" type="email" data-rule='lengthBetween{"max":12, "min":1}' data-onItemValidate="handler" />
        </p>

        <p>
            <label for="password">Password:</label>
            <input id="password" required name="password" type="password" pattern="[^\#\$\%]*" />
        </p>
    </form>


##Documentation

###检验规则

*   [Validator::addRule](#Validator-addRule)
*   [Validator::setMessage](#Validator-setMessage)
*   [Validator::getRule](#Validator-getRule)

*   [Rule#and](#Rule-and)
*   [Rule#or](#Rule-or)
*   [Rule#not](#Rule-not)

###校验核心

*   [Validator#addItem](#Validator-addItem)
*   [Validator#removeItem](#Validator-removeItem)
*   [Validator#execute](#Validator-execute)
*   [Validator#getItem](#Validator-getItem)
*   [Validator#destroy](#Validator-destroy)

*   [Validator::parsePage](#Validator-parsePage)
*   [Validator::getForm](#Validator-getForm)


##校验规则

<a name="Validator-addRule"></a>
### Validator::addRule(name, operator, message)

为了使用一个自定义校验规则，必须先将它添加到 Validator 中。

__Arguments__

*   name - 校验规则名称。
*   operator - 检验执行规则。它可以是正则表达式或者一个函数。对于一般的函数校验规则，在校验结束时请返回布尔值作为校验结果；对于异步校验规则，使用第二个参数提交校验结果。请参照下面的示例。
*   message - 提示消息。提示信息中可以使用`{{}}`来引用检验规则中接收到的 options 对象中的字段。

__Example__

        var Validator = require('validator');

*   正则校验

        Validator.addRule('phone', /^1\d{10}$/, '请输入合法的{{name}}');

*   函数检验。operator 函数将收到一个 options 对象作为参数。

        Validator.addRule('valueBetween', function(options) {
            var v = Number(options.field.value);
            return v <= options.max && v >= options.min;
        }, '{{name}}必须在{{min}}和{{max}}之间');

*   异步检验。operator 函数将收到一个options 对象作为第一个参数，commit 函数作为第二个参数，用来提交校验结果。commit接受两个参数，第一个是 error 对象，如果校验通过，则这一项应该为 null；第二个是提示消息。

        Validator.addRule('checkUseranmeAvailable', function(options, commit) {
            $.post('http://youdomain/checkUsernameAvailable', {username: options.field.value}, function(data) {
                commit(data.state == 'ok' ? null : data.state, data.msg);
            })
        });

校验函数接收的第一个参数options对象中，包含以下字段：
    
*   `options.element` - 当前在校验的表单项。也可能是一个数组，例如多个 radio。
*   `options.display` - 若用户传入的规则参数字段中含有 display，或者检验配置项字段中有 display，则使用 display 字段，否则使用表单域的 name 属性。
*   用户使用校验规则时传入对象的所有字段。例如用户定义'lengthBetween{"min":1, "max":3}'，那么options对象中将存在 min 和 max 字段。
    例如

        validator.addItem('username' {
            rules: ['required']
        });
        //出错校验信息为"username不能为空"

        validator.addItem('username' {
            rules: ['required', lengthBetween{"min": 1, "max":5}],
            display: '用户名'
        });
        //出错校验信息为"用户名不能为空"或者“用户名的长度必须在1和5之间"。


        validator.addItem('username' {
            rules: ['required{"display": "USERNAME"}', lengthBetween{"min": 1, "max":5}],
            display: '用户名'
        });
        //出错校验信息为"USERNAME不能为空"或者“用户名的长度必须在1和5之间”，请注意两者的区别。

<a name="Validator-setMessage"></a>
### Validator::setMessage(name, message)

设置校验提示信息。

__Arguments__

*   name - 校验规则名称。
*   message - 提示消息。提示信息中可以使用`{{}}`来引用检验规则中接收到的 options 对象中的字段。举例：
    
__Example__

    Validator.setMessage('email', '{{display}}的格式不正确');


<a name="Validator-getRule"></a>
### Validator::getRule(name, opt_options)

获取校验规则对象。

__Arguments__

*   name - 校验规则名称。
*   opt_options - 可选参数。如果传入一个对象，那么这个校验规则执行的时候，这个对象都会 merge 到 options 对象中。

##检验核心

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
                rule: ['required', 'lengthBetween']
            },
            password: {
                rule: ['required', 'somerule']
            }
        }, function(b) {

        });

*   添加检验项

        .addItem(name, cfg)

    Example

        vCore.addItem('email', {
            rules: ['required', 'lengthBetween{"min": 12, "max": 13}'],
            name: '电子邮箱',
            msg-success: '您的用户名校验通过！',
            msg-failure: '用户名校验失败！',
            triggerType: ['blur', 'submit'],
            before: function() {},
            after: function() {}
        });


data-attribute API支持
==================

HTML

    <form>
        <input id="username" name="username" type="text" placeholder="请输入邮箱或手机号" data-rules="required emailOrPhone maxLength{min:20} ajax" data-notice-required="用户名不能为空" data-notice-emailOrPhone="用户名必须为email或者电话号码" data-notice-default="这条信息会显示" />
    </form>

