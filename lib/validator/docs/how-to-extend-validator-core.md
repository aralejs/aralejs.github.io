#基于 validator-core 自定义表单交互

本项目提供两个模块：

*   validator-core.js - Core。校验核心，处理校验相关的一切。

*   validator.js - Validator。继承 Core 模块，封装了包括校验在内的一套默认表单交互行为。

当 validator 封装的表单交互形式不满足需求时，可以轻易地通过拓展 Core 自定义一套表单交互行为。表单交互根据场景的不同可能包括很多内容，这里只描述和校验相关的部分：校验提示消息展示。

1.  基于 validator-core 扩展。

        var Core = require('validator-core');

2.  继承Core。

        var customValidator = Core.extend({});

3.  定制如何展示校验消息。

        // 假设我们要实现的交互形式是校验消息打印在 console 中。(当然实际场景不会如此简单)
        var customValidator = Core.extend({
            attrs: {
                showMessage: function(element, message) {
                    console.log(message);
                },

                hideMessage: function(element, message) {
                    // do nothing
                }
            }
        });

这样，我们就实现了一个简单的交互行为。实际的情况要比此复杂，我们可以继续在 customValidator 中绑定事件和封装更多的行为和方法来实现理想中的交互形式。

更多请参考[validator.js](../src/validator.js)源码。
