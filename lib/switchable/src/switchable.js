define(function(require, exports, module) {

    // Switchable
    // -----------------
    // Thanks to:
    //  http://jquerytools.org/demos/scrollable/index.html

    var $ = require('jquery');
    var Widget = require('widget');

    function find(root, query) {
        var el = $(query);
        return el.length < 2 ? el : root.parent().find(query);
    }

    var Switchable = module.exports = Widget.extend({

        options: {
            contentClass: '.scrollable',
            disabledClass: 'disabled',
            easing: 'swing',
            initialIndex: 0,
            item: '> *',
            items: '.items',
            keyboard: true,
            next: '.next',
            prev: '.prev',
            size: 1,
            speed: 400
        },

        //view已经渲染完成. 开始对View拆分为Content, prev, next等元素。
        beforeCreate: function() {

            var options = this.options;
            var root = find(element, options.contentClass);
            //可以通过 class 来获取。
            this.itemWrap = root.children(),

            this.prevElement = find(root, options.prev);
            this.nextElement = find(root, options.next);

            if (!options.initialIndex) {
                this.prevElement.addClass(options.disabledClass);
            }

            if (this.getSize() < 2) {
                //如果只有一组, 那么就不显示prev和next
                this.prevElement.add(this.nextElement).addClass(options.disabledClass);
            }

            this.index = 0;
        },

        bindAction: function() {
            var that = this;
            var prev = this.prevElement;
            var next = this.nextElement;
            var options = this.options;

            this.onElement('click', options.prev, function(e) {
                e.stopPropagation();
                that.prev();
            });
            this.onElement('click', options.next, function(e) {
                e.stopPropagation();
                that.next();
            });

            this.on('beforeSeek', (function(i) {
                setTimeout(function() {
                    prev.toggleClass(options.disabledClass, i <= 0);
                    next.toggleClass(options.disabledClass, i >= that.getSize() - 1);
                }, 1);
            }));

            if (options.keyboard) {
                this._bindKeyboard();
            }
        },

        _bindKeyboard: function() {
            var that = this;
            $(document).on('keydown.scrollable', function(evt) {
                // skip certain conditions
                if (evt.altKey || evt.ctrlKey || evt.metaKey || $(evt.target).is(':input')) {
                    return;
                }
                var key = evt.keyCode;
                if (key == 37 || key == 39) {
                    that.move(key == 37 ? -1 : 1);
                    return evt.preventDefault();
                }
            });
        },

        getSize: function() {
            return this.itemSize || (this.itemSize = this.getItems().size());
        },

        //目前 items 是不会动态增加的。 所以我们是否可虑缓存。
        getItems: function() {
            return this.itemWrap.find(this.options.item);
        },

        move: function(offset) {
            return this.seekTo(this.index + offset);
        },

        next: function() {
            return this.move(this.options.size);
        },

        prev: function() {
            return this.move(-this.options.size);
        },

        // all seeking functions depend on this.
        seekTo: function(i, fn) {

            var that = this;
            var options = this.options;
            var item = this.getItems().eq(i);
            var props = {left: -item.position().left};

            this.index = i;
            var time = options.speed;

            // onBeforeSeek
            if (!fn) {
                this.trigger('beforeSeek', i, time);
            }

            this.itemWrap.animate(props, time, options.easing, fn || function() {
                that.trigger('onSeek', i);
            });

            return this;
        }
    });

});

