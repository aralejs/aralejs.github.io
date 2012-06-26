define(function(require, exports, module) {
  var $ = require('jquery');
  var Widget = require('widget');
  var Countdown = Widget.extend({
    attrs: {
      //<span class="year">
      //  ...
      //</span>
      //<span class="month">
      //  ...
      //</span>
      //<span class="day">
      //  ...
      //</span>
      //<span class="hour">
      //  ...
      //</span>
      //<span class="minute">
      //  ...
      //</span>
      //<span class="second">
      //  <span class="digit ">
      //  </span>
      //  <span class="digit ">
      //  </span>
      //</span>
      //<span class="millisecond">
      //  ...
      //</span>
      template: '',
      step: 1000,
      animate: false,
      autoStart: false
    },
    //events: {},
    setup: function() {
      var self = this;
      //保存HTML模版结构片段，每个dash的digit容器
      self._dashes = {
        year: null,
        month: null,
        day: null,
        hour: null,
        minute: null,
        second: null,
        millisecond: null
      };
      self.render();
      if (self.get('autoStart')) {
        self.start();
      }
    },
    render: function() {
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
    start: function() {
      var self = this;
      if (self._timer) {
        return;
      }
      var from = self.get('from') || new Date();
      var to = self.get('to') || new Date();
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
    stop: function() {
      if (this._timer) {
        clearInterval(this._timer);
        delete this._timer;
        this.trigger('stop');
      }
    },
    /**
     * 运行倒计时
     * @param {Date} from 起始时间.
     * @param {Date} to 截止时间.
     */
    _run: function(from, to, step, animate) {
      var duration = to - from;
      if (!duration) {
        return;
      }
      var self = this;
      var timespre = {};
      self._timer = setInterval(interval, step);
      interval();
      function interval() {
        if (duration < step) {
          //最后一次，防止出现负数
          duration = 0;
        }
        var relatime = new Date(duration);
        var dashes = self._dashes;
        var times = {
          year: relatime.getUTCFullYear() - 1970,
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
          //判断数值是否变化
          if (dashes[p] && (times[p] !== timespre[p])) {
            change(p, times[p], dashes[p]);
          }
        }
        if (duration === 0) {
          self.stop();
        }
        //保存本次时间状态
        timespre = times;
        //下次循环准备
        duration -= step;
      }
      /**
       * digit变化
       * @param {String} property dash名名称:
       *  year month day hour minute second millisecond.
       * @param {Number} time 对应的数值.
       * @param {jQuery|Zepto} dash 对应的digit集合.
       */
      function change(property, time, dash) {
        //补足数值
        time += '';
        while (dash.length - time.length) {
          time = '0' + time;
        }
        //处理digit
        dash.each(function(index) {
          var digit = time.charAt(index);
          var digitpre = $(this).data('digit');
          //判断数值是否有改变
          if (digit != digitpre) {
            //保存数值并变更对应的样式
            $(this).data('digit', digit);
            //开启动画
            if (animate) {
              var prev = $(this).children();
              
              //非初始化
              if (prev.length) {
                if (property === 'millisecond') {
                  //直接改变值，取消动画，提升效率
                  prev.removeClass('digit' + digitpre).addClass('digit' + digit).html(digit);
                } else {
                  $(this).append($('<div>').addClass('digit' + digit).html(digit));
                  prev.animate({
                    marginTop: '-' + prev.height() + 'px'
                  }, 600, function() {
                    $(this).remove();
                  });
                }
              } else {
                //初始化,创建digit内的div
                $(this).append($('<div>').addClass('digit' + digit).html(digit));
              }
            } else {
              //关闭动画
              $(this).removeClass('digit' + digitpre).addClass('digit' + digit).html(digit);
            }
          }
        });
      }
    }
  });
  return Countdown;
});

