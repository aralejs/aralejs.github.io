define(function(require, exports) {

  require('./event-object');
  require('./event-store');
  require('./event-chain');
  require('./event-core');

  window.E = window.$E = exports;

});
