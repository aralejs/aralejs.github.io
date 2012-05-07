define(function(require, exports, module) {

    var $ = require('jquery'),
		position = require('position'),
		iframeshim = require('iframeshim');

	var defaults = {
		srcNode : null,
		tpl : '',
		content : '',
		zIndex : 10,
		width : 0,
		height : 0,
		minHeight : 0,
		parentNode : document.body,
		pinOffset : {
			x : 0,
			y : 0
		},
		relativeObj : {
			elem : document.body,
			x : 0,
			y : 0
		}
	};

    var overlay = function(options) {
		this.options = $.extend({}, defaults, options);
		$.extend(this, this.options)
	};

    overlay.prototype = {

		render: function() {
			var elem;
			if(!this.srcNode) {
				elem = $(this.tpl);
				this.content && elem.html(this.content);
				this.srcNode = elem[0];
			}
			this.sync();
			elem.appendTo(this.parentNode);
			this.iframeshim = iframeshim(this.srcNode);
			return this;
		},

        sync: function() {
			if(this.srcNode) {
				var elem = $(this.srcNode);
				elem.css({
					width : this.width,
					height : this.height,
					zIndex : this.zIndex,
					minHeight : this.minHeight
				});
				position.pin({
					elem : this.srcNode,
					x : this.pinOffset.x,
					y : this.pinOffset.y
				}, this.relativeObj);
			}
			this.iframeshim && this.iframeshim.sync();
			return this;
        },

        show: function() {
			$(this.srcNode).show();
			this.iframeshim.show();
			return this;			
        },

        hide: function() {
			$(this.srcNode).hide();
			this.iframeshim.hide();
			return this;			
        }

    };

    module.exports =  function(options) {
        if(!options) {
            throw('Options must be spicified');
        }
        return new overlay(options); 
	};

});

