define(function(require, exports) {

    // DAParser
    // --------
    // data api 解析器，提供对 block 块和单个 element 的解析，并可用来自动初始化页面中
    // 的所有 Widget 组件。


    var $ = require('$');
    var ATTR_DA_CID = 'data-daparser-cid';
    var DAParser = exports;


    // 输入是 DOM element，假设 html 为
    //
    //   <div data-widget="Dialog">
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
    //     "widget": { "Dialog": ".daparser-0" }
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
    DAParser.parseBlock = function(root) {
        root = $(root)[0];
        var stringMap = {};

        // 快速判断 dataset 是否为空，减少无 data-* 时的性能损耗
        if (!hasDataAttrs(root)) return stringMap;

        var elements = makeArray(root.getElementsByTagName('*'));
        elements.unshift(root);

        for (var i = 0, len = elements.length; i < len; i++) {
            var element = elements[i];
            var dataset = DAParser.parseElement(element);
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


    // 得到某个 DOM 元素的 dataset
    DAParser.parseElement = function(element) {
        element = $(element)[0];

        // ref: https://developer.mozilla.org/en/DOM/element.dataset
        if (element.dataset) {
            // 转换成普通对象返回
            return $.extend({}, element.dataset);
        }

        var dataset = {};
        var attrs = element.attributes;

        for (var i = 0, len = attrs.length; i < len; i++) {
            var attr = attrs[i];
            var name = attr.name;

            if (name.indexOf('data-') === 0) {
                name = camelCase(name.substring(5));
                dataset[name] = attr.value;
            }
        }

        return dataset;
    };


    // 给 DOM 元素添加具有唯一性质的 className
    DAParser.stamp = function(element) {
        element = $(element)[0];
        var cid = element.getAttribute(ATTR_DA_CID);

        if (!cid) {
            cid = uniqueId();
            element.setAttribute(ATTR_DA_CID, cid);
            element.className += ' ' + cid;
        }
        return cid;
    };


    // Helpers
    // ------

    function makeArray(o) {
        var arr = [];

        for (var i = 0, len = o.length; i < len; i++) {
            var node = o[i];

            // 过滤掉注释等节点
            if (node.nodeType === 1) {
                arr.push(node);
            }
        }

        return arr;
    }


    function hasDataAttrs(element) {
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
        var dataset = DAParser.parseElement(element);
        //noinspection JSUnusedLocalSymbols
        for (var p in dataset) {
            return true;
        }

        return false;
    }


    // 仅处理字母开头的，其他情况仅作小写转换："data-x-y-123-_A" --> xY-123-_a
    var RE_DASH_WORD = /-([a-z])/g;

    function camelCase(str) {
        return str.toLowerCase().replace(RE_DASH_WORD, function(all, letter) {
            return (letter + '').toUpperCase();
        });
    }


    var idCounter = 0;

    function uniqueId() {
        return 'daparser-' + idCounter++;
    }

});
