define("#widget/0.8.2/daparser-debug", [], function(require, exports) {

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
    //     "widget": { "dialog": ".daparser-0" }
    //     "role": {
    //        "title": ".daparser-1",
    //        "content": ".daparser-2",
    //        "role": ".daparser-3,.daparser-4",
    //     },
    //     "action": {
    //        "click close": ".daparser-5"
    //     }
    //  }
    //
    // 有 data-* 的节点，会自动加上 class="daparser-n"
    //
    DAParser.parse = function(root) {
        var stringMap = {};

        // 快速判断 dataset 是否为空，减少无 data-* 时的性能损耗
        if (!hasDataset(root)) return stringMap;

        var elements = makeArray(root.getElementsByTagName('*'));
        elements.unshift(root);

        for (var i = 0, len = elements.length; i < len; i++) {
            var element = elements[i];
            var dataset = getDataset(element);
            var cid = element.getAttribute(ATTR_DA_CID);

            for (var key in dataset) {

                // 给 dataset 不为空的元素设置 uid
                if (!cid) {
                    cid = DAParser.stamp(element);
                }

                var val = dataset[key];
                var o = stringMap[key] || (stringMap[key] = {});

                // 用 selector 的形式存储
                o[val] || (o[val] = '');
                o[val] += (o[val] ? ',' : '') + '.' + cid;
            }
        }

        return stringMap;
    };


    DAParser.stamp = function(element) {
        var cid = element.getAttribute(ATTR_DA_CID);

        if (!cid) {
            cid = uniqueId();
            element.setAttribute(ATTR_DA_CID, cid);
            element.className += ' ' + cid;
        }
        return cid;
    };


    // Helpers
    // ---------------


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

    function hasDataset(element) {
        var outerHTML = element.outerHTML;

        // 大部分浏览器已经支持 outerHTML
        if (outerHTML) {
            return outerHTML.indexOf(' data-') !== -1;
        }

        // 看子元素里是否有 data-*
        var innerHTML = element.innerHTML;
        if (innerHTML && innerHTML.indexOf(' data-') !== -1) {
            return true;
        }

        // 判断自己是否有 data-*
        var dataset = getDataset(element);
        //noinspection JSUnusedLocalSymbols
        for (var p in dataset) {
            return true;
        }

        return false;
    }


    var ATTR_DA_CID = 'data-daparser-cid';

    var idCounter = 0;

    function uniqueId() {
        return 'daparser-' + idCounter++;
    }

});
