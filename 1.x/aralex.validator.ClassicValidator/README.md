Overview
========

`aralex.validator.ClassicValidator`是表单校验组件，继承自`aralex.validator.Validator`。以下内容为ClassicValidator在Validator基础上的扩展配置、方法和事件等，更多内容请参考`aralex.validator.Validator`。

它不仅负责对表单项进行校验，还包含表单错误提示的展示等功能，如果想包括表单行为方面功能。

**`aralex.classicvalidator`从1.3版本开始改名为`aralex.validator.ClassicValidator`。**

Usage
=====

ClassicValidator的使用和Validator的使用基本相同，只是增加了一些行为的钩子。这些钩子建议使用默认值，约定大于配置有利于开发效率的提高。

经典校验封装了一系列默认行为，可以满足大部分情况下的需求。这些行为包括：鼠标在校验项移入移出时、校验失败时、ajax请求验证时、有错误提示信息时对表单DOM结构增加各种class以改变提示样式。

源代码示例

    var validator = new aralex.validator.ClassicValidator({
        itemClass: "ui-fm-item",
        notifyClass: "ui-fm-explain",
        errorClass: "ui-fm-error",
        focusClass: "ui-fm-focus",
        formId: "validate-form",
        rules: {
            "input[name='phone']": {type: ["requiredText", "cnMobile"]},
            "input[name='hobby']": {type: ['requiredText']}
        }
    });

Configuration
=============

*   itemClass - String

    需要校验的表单项的外层容器class。默认值为"ui-fm-item"。

*   notifyClass - String

    提示信息容器class。默认值为"ui-fm-explain"。

*   errorClass - String

    校验失败时校验项外层容器的class。默认值为"ui-fm-error"。

*   hoverClass - String

    鼠标移入校验项时外层容器的class。默认值为"ui-fm-hover"。

*   focusClass - String

    校验项focus时外层容器的class。默认值为"ui-fm-focus"。

*   loadClass - String

    表单提交时提示信息容器class。默认值为"ui-fm-status"。

*   ajaxLoadClass - String

    Ajax验证时检验项外层容器的class。默认值为"ui-fm-loading"。

*   ajaxSuccessClass - String

    Ajax验证成功后校验项外层容器的class。默认值为"ui-fm-success"。

*   placehoderClass - String

    当浏览器支持html5的placeholder属性时，使用原生的placeholder。当浏览器不支持placeholder属性时，将这一class加到表单项上以处理样式。默认值为"ui-fm-placeholder"。

Methods
=======

*   .getParentItem(ele)

    得到表单项ele的class为itemClass的父容器。返回值为Node类型。

*   .getExplain(ele)

    得到表单项对应的提示信息容器，如果不存在则创建并插入到页面中对应的位置。返回值为Node类型。

