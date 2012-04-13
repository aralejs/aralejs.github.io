/* @author lifesinger@gmail.com */

define(function(require) {

  var Class = require('../js/class');
  var Options = require('../js/options');
  var EventTarget = require('../js/event-target');

  return Class.create({
    Implements: [Options, EventTarget]
  });

});
