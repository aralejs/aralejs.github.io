**本组件提供了'aralex.validator.Validator'(校验核心)、`aralex.validator.RuleFactory`(校验规则工厂)和`aralex.validator.MsgFactory`(错误提示消息工厂)**

**aralex.validator从1.3版本开始改名为aralex.validator.Validator。**

aralex.validator.Validator
==========================

###Overview

`aralex.validator.Validator`是表单校验组件，内置了常用的多种校验规则（email, cnphone, number, maxlength等)，并且支持自定义校验规则，解决个性化校验需求。

支持多种校验触发方式(blur,keyup,keyup等)，并且全局配置与局部配置结合可以满足单个表单触发方式的个性化定制。

它是校验核心，只负责对表单项进行校验，不包含表单错误提示的展示等功能，如果想包括表单行为方面功能，请使用`aralex.validator.ClassicValidator`。

**请注意，对于异步类型校验规则`get`, `post`, `jsonp`在type数组中一定要写在最后，这样可以节省对服务器的请求**

###Usage

`new aralex.validator.Validator(opts)`

源代码示例：

    var validator = new aralex.validator.Validator({
        formId: "the-form-id",
        triggerMethod: ["keyup", "blur"],
        rules:{
            "input[name='name']": {
                type: ["requiredText", "alpha", ["lengthBetween", 2, 8]],
                desc: "姓名"
            }
        },
        beforeValidate: function(){},
        afterValidate: function($ele, bValid, msg) {},
        afterValidateAll: function(bValid){},
        onSuccess: function() {},
        beforeSubmit: function() {}
    });

###Configuration

*   formId - String

    需要验证的表单的ID。

*   triggerMethod - Array

    校验被触发的方式。默认是blur触发，可以设置为多种触发方式，比如["blur", "click", "click"]。当只有一个触发方式时，可以是字符串形式不使用数组。

*   checkOnSubmit - Boolean

    表单提交时是否校验。默认为true。

*   stopSubmit - Boolean

    校验全部验证通过后是否阻止提交。默认为false。

*   onSuccess - Function

    校验全部通过后触发的回调函数。此回调函数的参数是表单DOM元素。

*   onFail - Function

    校验失败后触发的回调函数。此回调函数的参数是表单DOM元素。

*   checkNull - Boolean

    表单项为空时是否触发校验。

*   rules - Array

    表单项的校验规则。

        rules:{
            "input[name='name']": {
                type: ["requiredText", "alpha", ["lengthBetween", 2, 8]],
                desc: "姓名"
            },
            "input[name='mobile']": {
                type: ["requiredText", "cnMobile"],
                desc: "手机号"
                skipHidden: true //当隐藏时不校验，默认是校验的
            },
            "input[type='radio']": {
                type: ['requiredRadio']
            }
        }

###Methods

*   .submit()

    显式提交表单。

*   .stop()

    阻止表单提交，在这之后只能通过调用上面的submit()显式提交。

*   .validateAll()

    校验全部rules中配置的表单项，返回布尔类型，验证成功或失败。

*   .validate(ele, rulecfg)

    校验某一表单项。

    ele为表单元素。rulecfg为验证规则。返回布尔类型，验证成功或失败。

        .validate($("email"), {
            type:["requiredText", "email"]
        }):

*   .bind()

    绑定事件。这个函数在validator初始化的时候会自动调用，如果使用unbind解除绑定之后可以再次调用来绑定。这主要用来动态改变表单校验规则配置。

*   .unbind()

    解除所有validator事件绑定。


###EventEmitter

*   submit

    表单提交事件。

*   validate

    表单项校验事件。每次针对某一表单元素进行校验时产生。

    before参数:
    1.  ele - 被校验元素的DOM

    after参数:
    1.  ele - 被校验元素的DOM
    2.  bValid - 是否校验通过
    3.  errormsg - 若检验错误，则提供提示信息

*   validateAll

    全部表单项校验事件。当对全部表单元素进行校验时产生。

    after参数
    1.  bValid - 是否校验通过

*   ajaxValidate

    ajax表单校验事件。

    before参数：
    1.  $ele - $Node类型，被校验元素

    after参数：
    1.  $ele - $Node类型，被校验元素
    2.  是否校验通过
    3.  错误信息

    Example:

        validator.before("ajaxValidate", function($ele){});

        validator.after("ajaxValidate", function(
                                             $ele,      /*校验元素*/
                                             bValid,    /*是否校验通过*/
                                             msg        /*后台返回的提示信息*/
                                             ){});



aralex.validator.RuleFactory
=============================

###Overview

`aralex.validator.RuleFactory`是`aralex.validator.Validator`组件的验证规则工厂。它包含了常用的各种验证规则，用户也可以自己向其中添加自定义规则。

规则工厂支持两种验证规则：

1.  正则表达式
2.  函数式验证规则。

###Usage

RuleFactory默认关联到validator中，向RuleFactory中添加的新规则validator都可以获取到。默认已经向RuleFactory添加了很多常用规则，可以直接使用。

RuleFactory中的规则名称可作为参数放在validator的配置参数rules的type字段。例如：

    rules: {
        "input[name="email"]": {
            type:["email", ["maxLength", 30]]
            //这里email和maxLength都是规则名称。
            //其中maxLength是函数式的验证规则，30是maxLength的参数。
        }
    }

###Methods

*   .getRule(name)

    获取验证规则。validator会内部调用此函数获取验证规则。

    name – 规则名称。

    返回类型：RegExp或者Function。

*   .setRule(name, rule, override)

    添加或重置验证规则。当新增的规则不存在时添加规则，当新增规则以存在时如果override为true则重置，否则不作改变。override为可选参数，默认不覆盖。

    name -- 规则名称。

    rule -- 验证规则，RegExp类型、RegExp-like形式的字符串、或者函数。

    override -- Boolean。是否覆盖已有的规则。

###如何自定义校验规则

校验规则分为两类：正则校验规则和函数式校验规则。如何自定义检验规则：

*   对于正则校验规则很简单，就是一个普通的正则表达式。
*   函数式校验规则需要第一个参数为Node类型，其他参数写在其后。validator会在执行期间，将校验项Node类型的DOM作为第一个参数传入。例如

        function lengthBetween($ele, min, max) {
            var l = $ele.node.value.length;
            return l >=min && l <= max;
        }

自定义校验规则后，需要将它添加到RuleFactory中：

    aralex.validator.RuleFactory.setRule('newRule1', /abc/);
    aralex.validator.RuleFactory.setRule('newRule1', function($ele) {
        //return true | false;
    });

###内置正则校验规则

以下是内置的正则校验规则。具体的正则表达式请查看源码。

*   email 电子邮件校验规则。
*   cnPhone 电话号码校验规则。
*   mobile 手机号码验证规则。
*   cnMobile 手机号码验证规则。
*   date 日期校验规则。
*   string 字符类型校验规则。
*   integer 整数校验规则。
*   number 数值型校验规则。
*   numberWithZero 整数型校验规则，开头可以为0。
*   money 金额验证规则。
*   alpha 英文校验规则，检测是否只有英文。 /^[a-zA-Z]+$/ alphaNum 检测字符串中是否含有英文字母或者数字。
*   betaNum 支持字母数字。
*   cnID 身份证号码校验规则。
*   urls url校验规则，带http或https头。
*   url url验证规则，不带http或https头。
*   chinese 中文校验规则。
*   postal 邮政编码校验规则。
*   mutiYYYMM 月历校验规则。
*   name 支付宝帐户真实姓名校验规则。

###内置函数式校验规则

在validator中使用时，将函数式校验规则放在数组中。数组中第一个项是校验规则名称（即函数名），将验证规则第一个参数(Node类型的表单结点，验证时validator会负责传入此参数)外需要的参数放在其后。

例如：`type:[["maxLength", 50], ["minLength", 10]]`。

以下是内置的函数式校验规则：

*   required - 非空校验。
    推荐使用"requiredText", “requiredCheck”,"requiredRadio"和"requiredCheckBox"中的一种，他们使用的校验规则是相同的，都是进行非空校验，但是这样可以产生友好的提示信息。比如"requiredText"产生的提示为“请填写***”，“requiredCheckBox”产生的提示为“请选择×××”。
*   minValue($ele, min) - 最小值校验规则。
    min为最小值。
*   maxValue($ele, max) - 最大值校验规则。
    max为最大值。
*   minLength($ele, min) - 最小长度校验规则。
    min为最小长度。
*   maxLength($ele, max) - 最大长度校验规则。
    max为最大长度。
*   valueBetween($ele, min, max) - 数值区间校验规则。
    min为最小值。
    max为最大值。
*   lengthBetween($ele, min, max) - 长度区间校验。
    min为最小长度。
    max为最大长度。
*   post($ele, url, checkfunc, msgfunc, domain) - post类型ajax校验。
    url为请求地址。
    checkfunc是函数类型，用来处理返回的json数据以获取验证成功或者失败。此函数需要返回布尔类型。
    msgfunc是函数类型，用来从返回的json数据解析出后台提示信息。此函数需要返回布尔类型。
    domain是字符串类型。用来指定跨域时的domain。可选。
*   get($ele, url, checkfunc, msgfunc, domain) - get类型ajax校验。参数同post。
*   jsonp($ele, url, checkfunc, msgfunc, domain) - jsonp类型异步校验。参数同post。


aralex.validator.MsgFactory
===========================

###Overview

MsgFactory是Validator组件的提示信息工厂，它包含了一些常用的验证规则应给出的提示信息。用户也可以自己向其中添加自定义提示信息规则。


###Usage

MsgFactory默认关联到validator中，向Factory中添加的新提示信息validator都可以获取到。MsgFactory中的提示信息如果在validator的rule配置type中有同名规则则会自动被调用。

另外，如果需要使用提示信息，需要提供desc配置，例如。

    rules: {
        "input[name="email"]": {
            type:["email", ["maxLength", 30]],
            desc:"email" //这一配置项会替代信息提示字符串中的第一个"%s"
            //这里email和maxLength都是规则名称。
            //其中maxLength是函数式的验证规则，30是maxLength的参数。
            //如果其中email或者maxLength验证出错那么会自动调用MsgFactory中的消息进行提示。
        }
    }


###Methods

两个方法：

    aralex.validator.MsgFactory.getMsg(name);
    aralex.validator.MsgFactory.setMsg(name, msg);

*   .getMsg(name)

    获取提示信息字符串，ClassicValidator会自动调用它来生成错误提示信息。

    name -- 提示信息名称，与校验规则相对应。即如果要给email校验规则提供错误信息，那么name必须为"email"。

*   .setMsg(name, msg, override)

    新增或重置校验规则提示信息。

    name -- 提示信息名称，与校验规则名称相对应。

    msg -- 提示信息字符串。形如"%s不能长度超过%s"。第一个"%s"用来接收desc字段描述，其后的用来接收对应的校验规则参数（如

###如何自定义消息提示

当校验表单项在某个校验规则上出错时，会显示同名的提示消息。所以，如果想自定义错误提示消息，只需要写一个与校验规则名称相同的提示消息就可以。

提示信息规则的定义与校验规则相对应。如”maxValue”校验规则的提示信息为”%s数值不能大于%s”, 第一个”%s”会被rule的配置desc代替，其后的”%s”会被校验规则的参数替代。

例如：`aralex.validator.MsgFactory.setMsg('maxLength', '%s的长度不能大于%s哦')`

这样当maxLength校验出错的时候消息提示就被改变了。


###内置提示信息

*   required

    '%s不能为空。'

*   requiredText

    '请填写%s。'

*   requiredRadio

    '请选择%s。'

*   requiredCheckBox

    '请选择%s。'

*   requiredSelect

    '请选择%s。'

*   number

    '%s必须为数字。'

*   betaNum

    '%s只能包含数字、字母、下划线和横杠。'

*   email

    '%s格式不正确。'

*   money

    '%s必须为整数或小数，小数点后不超过2位。'

*   numberWithZero

    '%s必须为数字。'

*   chinese

    '%s必须为汉字。'

*   cnMobile

    '手机号码格式有误，是11位数字，且是13，15，18开头。'

*   name

    '%s只能含汉字、大写字母、符号中的空格和点，且至少两个字。'

*   maxLength

    '%s长度不能超过%s。'

*   minLength

    '%s长度不能小于%s。'

*   maxValue

    '%s数值不能大于%s。'

*   minValue

    '%s数值不能小于%s。'

*   lengthBetween

    '%s长度必须在%s与%s之间。'

*   valueBetween

    '%s数值必须在%s与%s之间。'
