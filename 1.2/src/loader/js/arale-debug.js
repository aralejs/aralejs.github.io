
var arale = seajs.noConflict();

(function() {

  var modules = ['array', 'base', 'dom', 'event', 'hash', 'string'];
  var alias = {};

  for (var i = 0, len = modules.length; i < len; i++) {
    var name = modules[i];
    alias[name] = name + '/js/' + name;
  }

  arale.config({
    base: '../../',
    alias: alias
  });

})();

