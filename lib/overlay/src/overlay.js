define(function(require, exports, module) {

    var $ = require('jquery'),
        Position = require('position'),
        iframeshim = require('iframeshim'),
        Events = require('events');

    var defaults = {
        srcNode: null,
        tpl: '',
        content: '',
        zIndex: 10,
        width: 0,
        height: 0,
        minHeight: 0,
        parentNode: document.body,
        pinOffset: {
            x: 0,
            y: 0
        },
        relativeObj: {
            elem: document.body,
            x: 0,
            y: 0
        }
    };

    function Overlay(options) {
        if (!(this instanceof Overlay)) {
            return new Overlay(options);
        }

        this.options = $.extend({}, defaults, options);
        $.extend(this, this.options);        
    };

    Events.mixTo(Overlay);

    Overlay.prototype.render = function() {
        var elem;
        if (!this.srcNode) {
            elem = $(this.tpl);
            this.content && elem.html(this.content);
            this.srcNode = elem[0];
        }
        this.sync();
        elem.appendTo(this.parentNode);
        this.iframeshim = iframeshim(this.srcNode);
        this.on('show hidden sync', this.iframeshim.sync);
        return this;
    };

    Overlay.prototype.sync = function() {
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
                elem: this.srcNode,
                x: this.pinOffset.x,
                y: this.pinOffset.y
            }, this.relativeObj);
        }
        return this;
    };

    Overlay.prototype.show = function() {
        this.trigger('show');
        $(this.srcNode).show();
        return this;
    };

    Overlay.prototype.hide = function() {
        $(this.srcNode).hide();
        this.trigger('hidden');
        return this;
    };

    module.exports = Overlay;

});

