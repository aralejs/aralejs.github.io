#API Documentation

##[Core](#Core)

Constructor

*   [配置项](#Core-constructor)

Instance Methods

*   [Core#addItem](#Core-addItem) 添加校验项
*   [Core#removeItem](#Core-removeItem) 移除校验项
*   [Core#query](#Core-query1) 获取 Item 实例对象
*   [Core#execute](#Core-execute) 手动触发表单校验
*   [Core#destroy](#Core-destroy) 销毁 Core 实例对象

Class Methods

*   [Core::autoRender](#Core-autoRender) 从 DOM 中实例对象化 Core 对象
*   [Core::query](#Core-query2) 获取 Core 或 Item 实例对象对象
*   [Core::helper](#Core-helper) 注册 helper 函数，以便在 DOM 中引用
*   [Core::validate](#Core-validate) 不初始化 validator 实例，执行一次性校验表单域。

##[Item](#Item)

Constructor

*   [配置项](#Item-constructor)

Instance Methods

*   [Item#execute](#Item-execute) 手动触发单个表单项校验

##[Validator](#Validator)

Constructor

*   [配置项](#Validator-constructor)


<a name="Core"></a>
##Core

校验核心。它负责处理校验，维护校验规则和事件触发等。它不包含消息提示等 UI 渲染，可以通过继承 Core 自定制一套 UI 渲染体系。(Validator 就是继承自 Core ，封装了支付宝表单交互行为的 UI 渲染。)

<a name="Core-constructor"></a>
### 配置项

*   element - 要校验的表单，可以是选择器、原生FORM Element，或者 $ 对象。
*   triggerType - 默认值'blur'。触发表单项校验的事件类型。支持多个事件，以空格隔开。
*   checkOnSubmit - 默认值 true。是否在表单提交前进行校验，默认进行校验。
*   stopOnError - 默认值 false。提交前校验整个表单时，遇到错误时是否停止校验其他表单项。
*   autoSubmit - 默认值true。When all validation passed, submit the form automatically.
*   checkNull - 默认值true。除提交前的校验外，表单域的值为空时是否校验。
*   onItemValidate - 函数类型。监听 itemValidate 事件，任何表单域校验前都会触发此函数。接收到的参数：
    1.  element - 被校验的元素，$ 类型。

*   onItemValidated - 函数类型。监听 itemValidated 事件，任何表单校验结束都会触发此函数。接受到的参数：
    1.  element - 被校验的元素，$ 类型。
    2.  error - 如果校验通过，则为 null，否则为出错的校验规则名称。
    3.  message - 提示消息。

*   onFormValidate - 函数类型。监听 formValidate 事件，当针对整个表单的校验开始钱触发此函数。接受到的参数：
    1.  element - 校验的表单元素，$ 类型。

*   onFormValidated - 函数类型。监听 formValidated 事件，当针对整个表单的校验结束后触发此函数。接受到的参数：
    1.  element - 被校验的元素，$ 类型。
    2.  error - 如果校验通过，则为 null，否则为 true。

*   showMessage - 函数类型。用来定制错误信息提示，当任何表单项校验出错时都触发此函数。Item 实例对象中的这个属性优先生效。this 指向 Core 实例对象，接受到的参数：
    1.  element - 被校验的元素，$ 类型。
    2.  message - 提示消息。

*   hideMessage - 函数类型。用来定制怎样隐藏错误信息提示，当任何表单项校验通过时都触发此函数。Item 实例对象中的这个属性优先生效。this 指向 Core 实例对象，接受到的参数：
    1.  element - 被校验的元素，$ 类型。
    2.  message - 提示消息。

__Example__

    validator = new Core({
        element: '#test-form'
    });





<a name="Core-addItem"></a>
### Core#addItem(options)

添加校验项。

__Arguments__

*   options - 配置项。请参考[Item配置项](#Item-constructor)。

__Examples__

    validator.addItem({
        element: '[name=password]',
        required: true,
        rule: 'min{min:5}'
        display: '密码',
        onItemValidate: function() {
        },
        onItemValidated: function(err, msg, ele) {
            console.log('onItemValidated', arguments);
        }
    });





<a name="Core-removeItem"></a>
### Core#removeItem(element)

移除校验项。

__Arguments__

*   element - 指定要移除此 element 上的校验。

__Example__

    validator.removeItem('#username');






<a name="Core-execute"></a>
### Core#execute(callback)

手动触发整个表单的校验。触发 `formValidate` 和 `formValidated` 两个事件。

__Arguments__

*   callback - 回调函数。

__Example__

    validator.execute(function(element, error, message) {
        console.log(arguments);
    });





<a name="Core-query1"></a>
### Core#query(element)

根据 DOM 获取 Item 实例对象。

__Arguments__

*   element - 校验对象的原生 DOM element 或 $ 对象或者选择器。

__Example__

    var usernameItem = validator.query('[name=username]');
    usernameItem.on('itemValidated', function() {
        // do something
    });






<a name="Core-destroy"></a>
### Core#destroy()

销毁 Core 实例对象。

__Example__

    validator.destroy();





<a name="Core-autoRender"></a>
### Core::autoRender()

给 Widget 自动渲染预留的接口。在 FORM 的 DOM 中使用标签属性 `data-widget="validator"` ，那么在 DOMReady 后调用 `Widget.autoRenderAll()` 方法会自动调用此方法进行初始化页面上所有的 Core。

__Example__

    $(function() {
        Widget.autoRenderAll();
    });






<a name="Core-query2"></a>
### Core::query(element)

若在 DOM 中使用标签属性初始化，调用此函数可以获取 Core 或 Item 的实例对象。
如果传入 form 对象，那么获取到的是 Core 实例对象。如果传入的是 input radio select 等表单域，获取到的是 Item 实例对象。

__Arguments__

*   element - 可以是原生 DOM 对象、$ 对象或者选择器。

__Example__

    seajs.use('validator', 'widget', function(Core, Widget) {
        Widget.autoRenderAll(); //调用此方法初始化会从所有包含 `data-widget="widget-name"` 属性的 DOM 中初始化对应的组件。

        // 拿到 Core 实例对象后，监听 formValidated 事件。
        Core.query('#test-form').on('formValidated', function(err, msg, ele) {
            console.log(err, msg);
        });

        // 拿到 Item 实例对象后，监听 itemValidated 事件。
        Core.query('#test-form [name=username]').on('itemValidated', function(err, msg, ele) {
            console.log('item', err, msg);
        });
    });






<a name="Core-helper"></a>
### Core::helper(name, fn)

注册 helper 函数，以便在 DOM 中通过 data-on-item-validated 等 DATA API attribute 注册回调函数。

__Arguments__

*   name - helper 名称。
*   fn - helper 函数。

__Example__


    Core.helper('usernameHandler', function(err, msg, ele) {
        console.log('helper', err, msg);
    });

    <input required name="username" type="username" data-on-item-validated="usernameHandler" data-errormessage-required="Please fullfill {{display}}" />






<a name="Core-validate"></a>
### Core::validate(options)

不初始化 Validator 实例，执行一次性校验表单域。(要求表单域必须在一个 form 中。)

__Arguments__

*   options - 配置项。请参考[Item配置项](#Item-constructor)。

__Example__

    Core.validate({
        element: '[name=username]',
        required: true,
        rule: 'minlength{min:8}',
        onItemValidated: function() {
            console.log(arguments);
        }
    });







<a name="Item"></a>
##Item

对于每一个要校验的表单域都对应一个 Item 实例对象。

<a name="Item-constructor"></a>
### 配置项

*   element - 要校验的表单项(input, radio, select等)。
*   rule - 校验规则。字符串类型，多个校验规则以空格隔开。
*   display - 表单项的别名，将用于消息提示。如果不配置，则它是表单项的 name 值。
*   triggerType - 触发校验的事件。项会覆盖 Core 对象的全局 triggerType 配置。
*   required - 默认 false。
*   checkNull - 默认值true。除提交前的校验外，表单域的值为空时是否校验。会覆盖 Core 对象的全局配置。
*   errormessage - 配置错误提示消息，若配置此项，无论哪一项出错都提示此消息。
*   errormessage{RuleName} - 配置某一校验规则的消息提示。例如 errormessageRequired。
*   onItemValidate  - 同 Core 对象同名配置。
*   onItemValidated - 同 Core 对象同名配置。
*   showMessage - 同 Core 对象同名配置。会覆盖 Core 对象的全局配置。
*   hideMessage - 同 Core 对象同名配置。会覆盖 Core 对象的全局配置。

__Example__

    validator.addItem({
        element: '[name=password]',
        rule: 'minlength{min: 5} maxlength{max:20}',
        required: true,
        display: '密码',
        onItemValidate: function() {
        },
        onItemValidated: function(err, msg, ele) {
            //console.log('onItemValidated', arguments);
        }
    });





<a name="Item-execute"></a>
### Item#execute(callback)

手动触发整个表单的校验。触发 `itemValidate` 和 `itemValidated` 两个事件。

__Arguments__

*   callback - 回调函数。

__Example__

    Core.query('#form [name=usernmae]').execute(function() {
        console.log(arguments);
    });





<a name="Validator"></a>
##Validator

继承 Core，封装了包括错误信息处理在内的支付宝默认表单交互规则。拥有 Core 所有的实例方法和类方法。

想根据需求自定制一种表单交互？

1.  首先阅读源码 [validator.js](../src/validator.js)。
2.  阅读[基于 validator-core 拓展自定义 UI 反馈](how-to-extend-validator-core.md)。



<a name="Validator-constructor"></a>
### 配置项

*   explainClass: 'ui-form-explain'
*   itemClass: 'ui-form-item'
*   itemHoverClass: 'ui-form-item-hover'
*   itemFocusClass: 'ui-form-item-focus'
*   itemErrorClass: 'ui-form-item-error'
*   inputClass: 'ui-input'
*   textareaClass: 'ui-textarea'

这些都是为了处理表单 UI 响应。具体请参考 DEMO。
