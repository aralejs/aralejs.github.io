define(function(require, exports, module) {
  var $ = require('jquery');
	var Widget = require('widget');
	var Timer = Widget.extend({
		attrs: {
			template: '',
			from: Date.now(),
			step: 1000,
			animate: false,
			autoStart: false
		},
		//events: {},
		setup: function() {
			console.info('setup!');
			this.render();
		},
		render: function() {
			console.info('render!');
      Timer.superclass.render.call(this);
		}
	});
	return Timer;
});

