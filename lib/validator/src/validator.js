define(function(require, exports, module) {
    var Core = require('./core'),
        Widget = require('widget'),
        $ = require('$');

    var Validator = Core.extend({

        events: {
            'mouseenter .{{attrs.inputClass}}': 'mouseenter',
            'mouseleave .{{attrs.inputClass}}': 'mouseleave',
            'mouseenter .{{attrs.textareaClass}}': 'mouseenter',
            'mouseleave .{{attrs.textareaClass}}': 'mouseleave',
            'focus .{{attrs.itemClass}}': 'focus',
            'blur .{{attrs.itemClass}}': 'blur'
        },

        attrs: {
            explainClass: 'ui-form-explain',
            itemClass: 'ui-form-item',
            itemHoverClass: 'ui-form-item-hover',
            itemFocusClass: 'ui-form-item-focus',
            itemErrorClass: 'ui-form-item-error',
            inputClass: 'ui-input',
            textareaClass: 'ui-textarea',

            showMessage: function(message, element) {
                this.getExplain(element).html(message);
                this.getItem(element).addClass(this.get('itemErrorClass'));
            },

            hideMessage: function(message, element) {
                this.getExplain(element).html(element.data('explain') || ' ');
                this.getItem(element).removeClass(this.get('itemErrorClass'));
            }
        },

        addItem: function(cfg) {
            Validator.superclass.addItem.apply(this, [].slice.call(arguments));
            var item = this.query(cfg.element);
            this._saveExplainMessage(item);
            return this;
        },

        _saveExplainMessage: function(item) {
            var that = this;
            var ele = item.element;

            var explain = ele.data('explain');
            // If explaining message is not specified, retrieve it from data-explain attribute of the target
            // or from DOM element with class name of the value of explainClass attr.
            // Explaining message cannot always retrieve from DOM element with class name of the value of explainClass
            // attr because the initial state of form may contain error messages from server.
            !explain && ele.data('explain', ele.attr('data-explain') || this.getExplain(ele).html());
        },

        getExplain: function(ele) {
            var item = this.getItem(ele);
            var explain = item.find('.' + this.get('explainClass'));

            if (explain.length == 0) {
                var explain = $('<div class="' + this.get('explainClass') + '"></div>').appendTo(item);
            }

            return explain;
        },

        getItem: function(ele) {
            ele = $(ele);
            var item = ele.parents('.' + this.get('itemClass'));

            return item;
        },

        mouseenter: function(e) {
            this.getItem(e.target).addClass(this.get('itemHoverClass'));
        },

        mouseleave: function(e) {
            this.getItem(e.target).removeClass(this.get('itemHoverClass'));
        },

        focus: function(e) {
            var target = e.target;
            this.getItem(target).removeClass(this.get('itemErrorClass'));
            this.getItem(target).addClass(this.get('itemFocusClass'));
            this.getExplain(target).html($(target).data('explain') || ' ');
        },

        blur: function(e) {
            this.getItem(e.target).removeClass(this.get('itemFocusClass'));
        }
    });


    module.exports = Validator;
});
