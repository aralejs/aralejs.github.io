#API Documentation

*   [Validator#constructor](#Validator-constructor) Validator构造函数

*   [Validator#addItem](#Validator-addItem) 添加校验项
*   [Validator#removeItem](#Validator-removeItem) 移除校验项
*   [Validator#execute](#Validator-execute) 手动触发表单校验
*   [Validator#destroy](#Validator-destroy) 销毁 Validator 实例对象

*   [Validator::autoRender](#Validator-autoRender) 从 DOM 中实例化 Validator 对象
*   [Validator::query](#Validator-query) 获取 Validator 或 Item 实例对象
*   [Validator::helper](#Validator-helper) 注册 helper 函数，以便在 DOM 中引用

*   [Rule#execute](#Rule-execute) 手动触发单个表单项校验


<a name="Validator-constructor"></a>
### Validator#constructor(options)

__Arguments__

*   options - 配置项。包含以下：

    *   element - 要校验的表单，可以是选择器、原生FORM Element，或者 jQuery 对象。
    *   triggerType - 默认值'blur'。触发表单项校验的事件类型。
    *   checkOnSubmit - 默认值 true。是否在表单提交前进行校验，默认进行校验。
    *   stopOnError - 默认值 false。提交前校验整个表单时，遇到错误时是否停止校验其他表单项。
    *   autoSubmit - 默认值true。When all validation passed, submit the form automatically.
    *   checkNull - 默认值true。除提交前的校验外，input的值为空时是否校验。

__Example__

    validator = new Validator({
        element: '#test-form'
    });





<a name="Validator-addItem"></a>
### Validator#addItem(options)

添加校验项。

__Arguments__

*   options - 配置项。包含以下：
    
    *   element - 要校验的表单项(input, radio, select等)。
    *   rule - 校验规则。
    *   display - 表单项的别名，将用于消息提示。如果不配置，则它是表单项的 name 值。
    *   triggerType - 触发校验的事件。如果配置此项会覆盖 Validator 对象的全局 triggerType 配置。
    *   required - 默认 false。

__Examples__

    validator.addItem({
        element: '[name=password]',
        rule: 'required',
        display: '密码',
        onItemValidate: function() {
        },
        onItemValidated: function(err, msg, ele) {
            console.log('onItemValidated', arguments);
        }
    });





<a name="Validator-removeItem"></a>
### Validator#removeItem(element)

移除校验项。

__Arguments__

*   element - 指定要移除此 element 上的校验。

__Example__

    validator.removeItem('#username');






<a name="Validator-execute"></a>
### Validator#execute(callback)

手动触发整个表单的校验。可监听 `formValidate` 和 `formValidated` 两个事件。

__Arguments__

*   callback - 回调函数。

__Example__

    validator.execute(function() {
        console.log(arguments);
    });






<a name="Validator-destroy"></a>
### Validator#destroy(callback)

销毁 Validator 实例。

__Example__

    validator.destroy();





<a name="Validator-autoRender"></a>
### Validator::autoRender()

给 Widget 自动渲染预留的接口。在 FORM 的 DOM 中使用标签属性 `data-widget="validator"` ，那么在 DOMReady 后调用 `Widget.autoRenderAll()` 方法会自动调用此方法进行初始化页面上所有的 Validator。

__Example__

    $(function() {
        Widget.autoRenderAll();
    });






<a name="Validator-query"></a>
### Validator::query(element)

如果在 DOM 中使用标签属性指定校验规则，那么调用此函数获取 Validator 和 Item 的实例对象。
如果传入 form 对象，那么获取到的是 Validator 实例对象。如果传入的是 input radio select 等表单域，获取到的是 Item 实例对象。

__Arguments__

*   element - 可以是原生 DOM 对象、jquery 对象或者选择器。

__Example__

    seajs.use('validator', 'widget', function(Validator, Widget) {
        Widget.autoRenderAll(); //调用此方法初始化会从所有包含 `data-widget="widget-name"` 属性的 DOM 中初始化对应的组件。

        Validator.query('#test-form').on('formValidated', function(err, msg, ele) {
            console.log(err, msg);
        });

        Validator.query('#test-form [name=username]').on('itemValidated', function(err, msg, ele) {
            console.log('item', err, msg);
        });
    });






<a name="Validator-helper"></a>
### Validator::helper(name, fn)

注册 helper 函数，以便在 DOM 中通过 data-on-item-validated 等 DATA API 注册回调函数。

__Arguments__

*   name - helper 名称。
*   fn - helper 函数。

__Example__


    Validator.helper('usernameHandler', function(err, msg, ele) {
        console.log('helper', err, msg);
    });

    <input required name="username" type="username" data-on-item-validated="usernameHandler" data-errormessage-required="Please fullfill {{display}}" />




<a name="Rule-execute"></a>
### Rule#execute(callback)

手动触发整个表单的校验。可监听 `itemValidate` 和 `itemValidated` 两个事件。

__Arguments__

*   callback - 回调函数。

__Example__

    Validator.query('#form [name=usernmae]').execute(function() {
        console.log(arguments);
    });
