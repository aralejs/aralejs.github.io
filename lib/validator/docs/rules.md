#校验规则

每个校验规则都必须有一个名称，校验的执行器（或者正则）和默认提示信息。

##内置校验规则

对于每种校验规则如何做校验，read the fucking source : ) -> [rule.js](../src/rule.js)。

###type

以下规则都对应一种正则校验，可以在 DOM 中用作 type 属性的值，或者使用 JS API 在写在 rule 属性中。

例如

    <input type="url" />

或者

    validator.addItem({
        element: '[name=url]',
        rule: 'url'
    })

*   email
*   text
*   password
*   radio
*   checkbox
*   url
*   number
*   date

###attribute

以下规则可以在 DOM 中作为 attribute 指定参数。例如：

    <input type="text" name="age" min="1" max="100" />

也可以在 JS API 中写在 rule 属性中。例如：

    validator.addItem({
        element: '[name=age]',
        rule: 'min{min:1} max{max:100}'
    });

*   min

    *   min

*   max

    *   max

*   minlength

    *   min

*   maxlength

    *   max


###rule

以下规则只能用于 rule 字段中。

*   mobile - 手机号码。

*   confirmation - 重复输入。例如再输入一遍密码。

    *   target - 要重复的 input 的选择器。




##自定义校验规则

*   [Validator::addRule](#Validator-addRule) 自定义校验规则。
*   [Validator::setMessage](#Validator-setMessage) 动态设置校验提示消息。

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
    
*   `options.element` - 当前在校验的表单项。
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



##校验规则组合

校验规则可以进行与或非逻辑组合成新的规则。

如何组合？

1.  获取 Rule 对象。
2.  进行逻辑组合。
3.  注册新的校验规则。

Example

    var emailRule = Validator.getRule('email'); // #1
    var username = email.or('mobile');          // #2
    Validator.addRule('username', username);    // #3


API

*   [Validator::getRule](#Validator-getRule) 获取校验规则对象
*   [Rule#and](#Rule-and) “AND”(与)组合校验规则
*   [Rule#or](#Rule-or) "OR"(或)组合校验规则
*   [Rule#not](#Rule-not) "NOT"(非)组合校验规则


<a name="Validator-getRule"></a>
### Validator::getRule(name)

获取校验规则对象。

__Arguments__

*   name - 校验规则名称。

__Example__

    Validator.getRule('ruleName');





<a name="Rule-and"></a>
### Rule#and(name, opt_options)

将两个校验规则合并成一个逻辑“与”校验，即当两个校验规则都校验正确的时候合并后的规则才算校验通过。

__Arguments__

*   name - 校验规则名称。
*   opt_options - 可选参数。如果传入一个对象，那么这个校验规则执行的时候，这个对象都会 merge 到 options 对象中。

__Example__

    var newrule = Validator.getRule('email').and('minlength', {min:5});
    Validator.addRule('newrule', newrule);





<a name="Rule-or"></a>
### Rule#or(name)

将两个校验规则合并成一个逻辑“或”校验，即当两个校验规则有一个校验正确的时候合并后的规则就算校验通过。

__Arguments__

*   name - 校验规则名称。
*   opt_options - 可选参数。如果传入一个对象，那么这个校验规则执行的时候，这个对象都会 merge 到 options 对象中。

__Example__

    var username = Validator.getRule('email').or('mobile');
    Validator.addRule('username', username);





<a name="Rule-or"></a>
### Rule#not(opt_options)

将两个校验规则合并成一个逻辑“或”校验，即当两个校验规则有一个校验正确的时候合并后的规则就算校验通过。

__Arguments__

*   opt_options - 可选参数。如果传入一个对象，那么这个校验规则执行的时候，这个对象都会 merge 到 options 对象中。

__Example__

    var notemail = Validator.getRule('email').not();
    Validator.addRule('notemail', notemail);





<a name="Rule-not"></a>
### Rule#not(name)

将两个校验规则合并成一个逻辑“或”校验，即当两个校验规则有一个校验正确的时候合并后的规则就算校验通过。

__Arguments__

*   name - 校验规则名称。

__Example__

    var username = Validator.getRule('email').or('mobile');
    Validator.addRule('username', username);





