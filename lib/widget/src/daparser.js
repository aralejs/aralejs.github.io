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
    //     "widget": { "dialog": ".da_0" }
    //     "role": {
    //        "title": ".da_1",
    //        "content": ".da_2",
    //        "role": ".da_3,.da_4",
    //     },
    //     "action": {
    //        "click close": ".da_5"
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
            var dataset = getDataset(element);
            var cid = element.getAttribute(ATTR_DA_CID);
            var first = true;

            for (var key in dataset) {

                // 给 dataset 不为空的元素设置 uid
                if (first) {
                    if (!cid) {
                        cid = uniqueId();
                        element.setAttribute(ATTR_DA_CID, cid);
                        element.className += ' ' + cid;
                    }
                    first = false;
                }

                var val = dataset[key];
                var o = hash[key] || (hash[key] = {});

                // 用 selector 的形式存储
                o[val] || (o[val] = '');
                o[val] += (o[val] ? ',' : '') + '.' + cid;
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

    function getDataset(element) {
        // ref: https://developer.mozilla.org/en/DOM/element.dataset
        if (element.dataset) {
            return element.dataset;
        }

        var attrs = element.attributes;
        var dataset = {};

        for (var attr in attrs) {
            if (attrs.hasOwnProperty(attr)) {
                var name = attrs[attr].name;

                if (RE_DATA_ATTR.test(name)) {
                    name = name.substring(5).replace(RE_DASH, function(m, c) {
                        return c.toUpperCase();
                    });

                    dataset[name] = attrs[attr].value;
                }
            }
        }

        return dataset;
    }


    var ATTR_DA_CID = 'data-daparser-cid';

    var idCounter = 0;

    function uniqueId() {
        return 'daparser-' + idCounter++;
    }

});
