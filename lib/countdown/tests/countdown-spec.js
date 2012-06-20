define(function(require){
  var Countdown = require('../src/countdown');
  
  describe('Countdown common spec', function(){
    var onStartCallback;
    var onStopCallback;
    var countdown;
    
    beforeEach(function(){
      onStartCallback = jasmine.createSpy('onStartCallback');
      onStopCallback = jasmine.createSpy('onStopCallback');
      countdown = new Countdown({
        template: '<div class="second">\
                      <div class="digit ">\
                      </div>\
                      <div class="digit ">\
                      </div>\
                    </div>',
        element: document.createElement('div'),
        from: new Date(),
        to: new Date((new Date()).getTime() + 1000),
        onStart: onStartCallback,
        onStop: onStopCallback
      });
      jasmine.Clock.useMock();
    });
    
    it('Callbacks', function(){
      expect(onStartCallback).not.toHaveBeenCalled();
      countdown.start();
      expect(onStartCallback).toHaveBeenCalled()
      expect(onStopCallback).not.toHaveBeenCalled();
      
      jasmine.Clock.tick(950);
      expect(onStopCallback).not.toHaveBeenCalled();
      jasmine.Clock.tick(1050);
      expect(onStopCallback).toHaveBeenCalled();
      
      expect(onStartCallback.calls.length).toEqual(1);
      expect(onStopCallback.calls.length).toEqual(1);
    });
  });
});
