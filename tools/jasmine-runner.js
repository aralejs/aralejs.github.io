// load sea.js
(function(m, o, d, u, l, a, r) {
  if(m[d]) return;
  function f(n, t) { return function() { r.push(n, arguments); return t; } }
  m[d] = a = { args: (r = []), config: f(0, a), use: f(1, a) };
  m.define = f(2);
  u = o.createElement('script');
  u.id = d + 'node';
  u.src = '../../../dist/seajs/1.1.0/sea.js';
  l = o.getElementsByTagName('head')[0];
  l.insertBefore(u, l.firstChild);
})(window, document, 'seajs');


// default config
seajs.config({
    alias: {
        'json': 'json/1.0.1/json',
        'jasmine-html': 'jasmine/1.1.0/jasmine-html'
    },
    preload: [this.JSON ? '' : 'json', 'plugin-text']
});


seajs.use(['text!../package.json', 'jasmine-html'], function(data) {

    var jasmineEnv = getJasmineEnv();
    runSpecs();


    function getJasmineEnv() {
        var env = jasmine.getEnv();
        env.updateInterval = 1000;

        var trivialReporter = new jasmine.TrivialReporter();

        env.addReporter(trivialReporter);

        env.specFilter = function(spec) {
            return trivialReporter.specFilter(spec);
        };

        return env;
    }


    function runSpecs() {
        var meta = JSON.parse(data);

        var specs = [];
        for (var i = 0; i < meta.files.length; i++) {
            var name = meta.files[i].split('/').pop().split('.')[0];
            specs[i] = './' + name + '-spec.js';
        }

        seajs.use(specs, function() {
            jasmineEnv.execute();
        });
    }

});
