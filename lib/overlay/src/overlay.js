define(function(require, exports, module) {

    var $ = require('$'),
        Position = require('position'),
        Shim = require('iframe-shim'),
        Widget = require('widget');


    var Overlay = Widget.extend({

        options: {
            element: null,
            template: '',
            content: '',

            zIndex: 10,
            width: 'auto',
            height: 'auto',
            minHeight: 0,

            parentNode: document.body,

            pinOffset: {
                x: 0,
                y: 0
            },
            baseObject: {
                element: document.body,
                x: 0,
                y: 0
            }
        },

        init: function() {
            this.content = this.options.content;
            this.parentNode = this.options.parentNode;

            var shim = this.shim = new Shim(this.element);
            this.on('show hidden sync', shim.sync, shim);
        },

        render: function() {
            this.content && this.element.html(this.content);
            this.element.appendTo(this.parentNode);
            this.sync();
            return this;
        },

        sync: function() {
            this.trigger('sync');
            var options = this.options;

            this.element.css({
                width: options.width,
                height: options.height,
                zIndex: options.zIndex,
                minHeight: options.minHeight
            });

            Position.pin({
                element: this.element,
                x: options.pinOffset.x,
                y: options.pinOffset.y
            }, options.baseObject);

            return this;
        },

        show: function() {
            this.trigger('show');
            this.element.show();
            return this;
        },

        hide: function() {
            this.element.hide();
            this.trigger('hidden');
            return this;
        }

    });

    module.exports = Overlay;

});
