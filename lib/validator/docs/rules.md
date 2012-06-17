#校验规则

##内置校验规则

对于校验规则执行的动作，请阅读 [rule.js](../src/rule.js) 源码。

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

以下规则只能用于 JS API 中。

*   mobile - 手机号码。

*   confirmation - 重复输入。例如再输入一遍密码。

    *   target - 要重复的 input 的选择器。


