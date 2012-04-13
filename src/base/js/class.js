/* @author lifesinger@gmail.com */

define(function() {

  var Class = {};

  /**
   * Utility to set up the prototype, constructor and superclass properties to
   * support an inheritance strategy that can chain constructors and methods.
   * Static members will not be inherited.
   * @param r {Function} the object to modify
   * @param s {Function} the object to inherit
   * @param px {Object} prototype properties to add/override
   * @param {Object} [sx] static properties to add/override
   * @return r {Object}
   */
  function inherit(r, s, px, sx) {
    if (!s || !r) {
      return r;
    }

    var create = Object.create ?
            function (proto, c) {
              return Object.create(proto, {
                constructor:{
                  value:c
                }
              });
            } :
            function (proto, c) {
              function F() {
              }

              F.prototype = proto;

              var o = new F();
              o.constructor = c;
              return o;
            };

        var sp = s.prototype;
        var rp;

    // add prototype chain
    rp = create(sp, r);
    r.prototype = S.mix(rp, r.prototype);
    r.superclass = create(sp, s);

    // add prototype overrides
    if (px) {
      S.mix(rp, px);
    }

    // add object overrides
    if (sx) {
      S.mix(r, sx);
    }

    return r;
  }



  Class.create = function(properties) {



  };



  function noop(){}


  return Class;
});
