define(function(require, exports, module){
  var $ = require('jquery');
  var Widget = require('widget');
  var Countdown = Widget.extend({
    attrs: {
      template: '',
      from: new Date(),
      step: 1000,
      animate: false,
      autoStart: false
    },
    //events: {},
    setup: function(){
      this._dashes = {
        year: null,
        month: null,
        day: null,
        hour: null,
        minute: null,
        second: null,
        millisecond: null
      };
      this.render();
      if (this.get('autoStart')) {
        this.start();
      }
    },
    render: function(){
      var self = this;
      var template = self.get('template');
      var element = self.element;
      var dashes = self._dashes;
      if (template) {
        $(element).html(template);
      }
      for (var p in dashes) {
        var dash = $('.' + p, element);
        if (dash.length) {
          dashes[p] = $('.digit', dash);
        }
      }
      
      Countdown.superclass.render.call(self);
      return self;
    },
    /**
     * 开始计时
     */
    start: function(){
      var self = this;
      var from = self.get('from');
      var to = self.get('to');
      var step = self.get('step');
      var animate = self.get('animate');
      //限制最小步长为24毫秒
      step < 24 && (step = 24);
      this._run(from, to, step, animate);
      self.trigger('start');
    },
    /**
     * 停止计时
     */
    stop: function(){
      if (this._timer) {
        clearInterval(this._timer);
        delete this._timer;
        this.trigger('stop');
      }
    },
    /**
     * 运行倒计时
     * @param {Date} from
     * @param {Date} to
     */
    _run: function(from, to, step, animate){
      var duration = to - from;
      if (!duration) {
        return;
      }
      var self = this;
      var timespre = {};
      self._timer = setInterval(interval, step);
      interval();
      function interval(){
        if (duration < step) {
          self.stop();
          //防止最后一次计算出现负数
          duration = 0;
        }
        var relatime = new Date(duration);
        var dashes = self._dashes;
        var times = {
          year: relatime.getFullYear() - 1970,
          month: relatime.getUTCMonth(),
          day: relatime.getUTCDate() - 1,
          hour: relatime.getUTCHours(),
          minute: relatime.getUTCMinutes(),
          second: relatime.getUTCSeconds(),
          millisecond: relatime.getUTCMilliseconds()
        };
        
        //特殊处理， 没有提供年份容器
        if (!dashes.year) {
          times.month += times.year * 12;
          times.year = 0;
          //没有提供月份容器，前提是没有年份容器
          if (!dashes.month) {
            times.day = Math.floor(relatime.getTime() / 86400000);
            times.month = 0;
            //up
            if (!dashes.day) {
              times.hour = Math.floor(relatime.getTime() / 3600000);
              times.day = 0;
            }
          }
        }
        
        for (var p in dashes) {
          if (dashes[p] && (times[p] !== timespre[p])) {
            self._seat(p, times[p], dashes[p], animate);
          }
        }
        //保存本次时间状态
        timespre = times;
        
        duration -= step;
      }
    },
    /**
     * 将数字转化为和digit容器相同长度的字符串，并对号入座
     * @param {String} property
     * @param {Int} time
     * @param {Object} dash
     */
    _seat: function(property, time, dash, animate){
      time += '';
      while (dash.length - time.length) {
        time = '0' + time;
      }
      //处理没一个digit容器
      dash.each(function(index){
        var digit = time.charAt(index);
        var digitpre = $(this).data('digit');
        //判断数值是否有改变
        if (digit != digitpre) {
          //保存数值并变更对应的样式
          $(this).data('digit', digit).removeClass().addClass('digit digit' + digit);
          if (animate && property !== 'millisecond') {
            var prev = $(this).children();
            var next = $('<div>').html(digit);
            $(this).append(next);
            if (prev.length) {
              prev.animate({
                marginTop: '-' + prev.height() + 'px'
              }, 600, function(){
                $(this).remove();
              });
            }
          } else {
            $(this).html(digit);
          }
        }
      });
    }
  });
  return Countdown;
});

