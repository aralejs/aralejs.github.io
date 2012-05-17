define(function(require, exports) {

    // DAParser
    // ---------------
    // data-api 解析器

    var DAParser = exports;


    // 输入是 DOM element，假设 html 为
    //
    //   <div data-widget="dialog">
    //     <h3 data-role="title">...</h3>
    //     <ul data-role="content">
    //       <li data-role="item">...</li>
    //       <li data-role="item">...</li>
    //     </ul>
    //     <span data-action="click close">X</span>
    //   </div>
    //
    // 输出是
    //
    //  {
    //     "widget": { "dialog": ["da_0"] }
    //     "role": {
    //        "title": ["da_1"],
    //        "content": "[da_2"],
    //        "role": ["da_3", "da_4"],
    //     },
    //     "action": {
    //        "click close": ["da_5"]
    //     }
    //  }
    //
    // 有 data-* 的节点，会自动加上 class="da_n"
    //
    DAParser.parse = function(root) {
        var elements = makeArray(root.getElementsByTagName('*'));
        elements.unshift(root);

        var hash = {};

        for (var i = 0, len = elements.length; i < len; i++) {
            var element = elements[i];
            var dataset = getDataSet(element);
            var uid = element.getAttribute(ATTR_DA_UID);
            var first = true;

            for (var key in dataset) {

                // 给 dataset 不为空的元素设置 uid
                if (first) {
                    if (!uid) {
                        uid = uniqueId();
                        element.setAttribute(ATTR_DA_UID, uid);
                        element.className += ' ' + uid;
                    }
                    first = false;
                }

                var o = hash[key] || (hash[key] = {});
                var val = dataset[key];
                (o[val] || (o[val] = [])).push(uid);
            }
        }

        return hash;
    };


    // Helpers

    function makeArray(o) {
        var arr = [];
        for (var i = 0, len = o.length; i < len; i++) {
            arr[i] = o[i];
        }
        return arr;
    }


    var RE_DATA_ATTR = /^data-/i;
    var RE_DASH = /-[\w\d_]/;

    function getDataSet(element) {
        // ref: https://developer.mozilla.org/en/DOM/element.dataset
        if (element.dataset) {
            return element.dataset;
        }

        var attrs = element.attributes;
        var hash = {};

        for (var attr in attrs) {
            if (attrs.hasOwnProperty(attr)) {
                var name = attrs[attr].name;

                if (RE_DATA_ATTR.test(name)) {
                    name = name.substring(5).replace(RE_DASH, function(m, c) {
                        return c.toUpperCase();
                    });

                    hash[name] = attrs[attr].value;
                }
            }
        }

        return hash;
    }


    var ATTR_DA_UID = 'data-daparser-uid';

    var idCounter = 0;

    function uniqueId() {
        return 'da_' + idCounter++;
    }

});
