/* @author lifesinger@gmail.com */

define(function(require) {

  var Class = require('./class');
  var Options = require('./options');
  var EventTarget = require('./event-target');

  return Class.create({
    Implements: [Options, EventTarget]
  });

});
