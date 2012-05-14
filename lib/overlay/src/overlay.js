define(function(require, exports, module) {

    var $ = require('jquery'),
        Position = require('position'),
        iframeshim = require('iframeshim'),
        Base = require('base');

    var Overlay = Base.extend({
        options: {
            srcNode: null,
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

        initialize: function(options) {
            this.options = $.extend({}, this.options, options)
            //this.setOptions(options);
            $.extend(this, this.options);
        },

        render: function() {
            var elem;
            if (!this.srcNode) {
                elem = $(this.template);
                this.content && elem.html(this.content);
                this.srcNode = elem[0];
            }
            this.sync();
            elem.appendTo(this.parentNode);
            this.iframeshim = new iframeshim(this.srcNode);
            this.on('show hidden sync', this.iframeshim.sync);
            return this;
        },

        sync: function() {
            if (this.srcNode) {
                this.trigger('sync');
                var elem = $(this.srcNode);
                elem.css({
                    width: this.width,
                    height: this.height,
                    zIndex: this.zIndex,
                    minHeight: this.minHeight
                });
                Position.pin({
                    element: this.srcNode,
                    x: this.pinOffset.x,
                    y: this.pinOffset.y
                }, this.baseObject);
            }
            return this;
        },

        show: function() {
            this.trigger('show');
            $(this.srcNode).show();
            return this;
        },

        hide: function() {
            $(this.srcNode).hide();
            this.trigger('hidden');
            return this;
        }

    });

    module.exports = Overlay;

});

