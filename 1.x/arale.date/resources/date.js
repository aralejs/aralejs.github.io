/**
 * @name arale.date
 * @class
 * 日期处理类
 *opt_year, opt_month, opt_date, opt_hours, opt_minutes, opt_seconds, opt_milliseconds
 * @param  {} opt_year
 * @param  {} opt_month
 * @param  {} opt_date
 * @param  {} opt_hours
 * @param  {} opt_minutes
 * @param  {} opt_seconds
 * @param  {} opt_milliseconds
 * @returns {CData} 包装后的日期类
 */
var arale = window.arale || require('arale.base');
var arale = window.$H || require('arale.hash');
var arale = window.$N || require('arale.number');

arale.module("arale.date", function () {
    var _week_day = {
        MON: 0,
        TUE: 1,
        WED: 2,
        THU: 3,
        FRI: 4,
        SAT: 5,
        SUN: 6
    };
    _now = Date.now ||
    function () {
        return +new Date
    };
    var CDate = arale.dblPrototype(new Date, function (date) {
        this.date = date;
        this.week = date.getDay();
        this.day = date.getDate();
        this.month = date.getMonth() + 1;
        this.year = date.getFullYear();
        this.hour = date.getHours();
        this.second = date.getSeconds();
        this.minute = date.getMinutes();
        this.millisecond = date.getMilliseconds()
    });
    arale.augment(CDate, {

        /** @lends arale.date.prototype */

        /**
         * 是不是闰年
         * @param {Number} [year] 要判断的年，省略此参数相对于判断当前年
         * @returns {Boolean} 是不是闰年
         */
        isLeapYear: function (year) {
            year = year || this.date.getFullYear();
            return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)
        },

        /**
         * 获取指定某年中的某月的天数
         */
        getNumberOfDaysInMonth: function (year, month) {
            year = year || this.date.getFullYear();
            month = (month || this.date.getMonth()) + 1;
            switch (month) {
            case 2:
                return this.isLeapYear(year) ? 29 : 28;
            case 6:
            case 9:
            case 11:
            case 4:
                return 30
            }
            return 31
        },

        /**
         * 是不是同一天
         */
        isSameDay: function (opt_now) {
            var now = opt_now || new Date(_now());
            return this.date.getDate() == now.getDate() && this.isSameMonth(now)
        },


        /**
         * 是不是同一个月
         */
        isSameMonth: function (opt_now) {
            var now = opt_now || new Date(_now());
            return this.date.getMonth() == now.getMonth() && this.isSameYear(now)
        },

        /**
         * 是不是同一年
         */
        isSameYear: function (opt_now) {
            var now = opt_now || new Date(_now());
            return this.date.getFullYear() == now.getFullYear()
        },

        /**
         */
        getWeekNumber: function (opt_weekDay, opt_firstDayOfWeek) {
            var cutoff = opt_weekDay - 1 || _week_day.THU;
            var firstday = opt_firstDayOfWeek - 1 || _week_day.MON;
            var ONE_DAY = 24 * 60 * 60 * 1E3;
            var isoday = (this.date.getDay() + 6) % 7;
            var daypos = (isoday - firstday + 7) % 7;
            var cutoffpos = (cutoff - firstday + 7) % 7;
            var cutoffSameWeek = this.date.valueOf() + (cutoffpos - daypos) * ONE_DAY;
            var jan1 = (new Date((new Date(cutoffSameWeek)).getFullYear(), 0, 1)).valueOf();
            return Math.floor(Math.round((cutoffSameWeek - jan1) / ONE_DAY) / 7) + 1
        },

        /**
         */
        equals: function (d2, day) {
            if (day) return this.date.getYear() == d2.getYear() && this.date.getMonth() == d2.getMonth() && this.date.getDate() == d2.getDate();
            return this.date.getTime() == d2.getTime()
        },

        /**
         */
        formatDate: function (opt) {
            opt = arale.isUndefined(opt) ? "-" : opt;
            var str = [this.date.getFullYear(), $N(this.date.getMonth() + 1).pad(2), $N(this.date.getDate()).pad(2)];
            return str.join(opt)
        },

        /**
         */
        formatDateTime: function (opt) {
            opt = arale.isUndefined(opt) ? "-" : opt;
            var str = [$N(this.date.getHours()).pad(2), $N(this.date.getMinutes()).pad(2), $N(this.date.getSeconds()).pad(2)];
            return this.formatDate(opt) + " " + str.join(":") + "." + this.date.getMilliseconds()
        },


        /**
         */
        add: function (obj) {
			var cdate = this.date;
            var interval = {
                years: 0,
                months: 0,
                days: 0,
                hours: 0,
                monutes: 0,
                seconds: 0
            };
            $H(interval).extend(obj);
            var _maybeFixDst = function (d, expected) {
                if (d.getDate() != expected) {
                    var dir = d.getDate() < expected ? 1 : -1;
                    d.setUTCHours(d.getUTCHours() + dir)
                }
                return d
            };
            if (interval.years || interval.months) {
                var month = cdate.getMonth() + interval.months + interval.years * 12;
                var year  = cdate.getFullYear() + Math.floor(month / 12);
                month %= 12;
                if (month < 0) month += 12;
                var daysInTargetMonth = this.getNumberOfDaysInMonth(year, month);
                var min_date = Math.min(daysInTargetMonth, cdate.getDate());
                cdate.setDate(1);
                cdate.setFullYear(year);
                cdate.setMonth(month);
                cdate.setDate(min_date)
            }
            if (interval.days) {
                var noon = new Date(cdate.getFullYear(), cdate.getMonth(), cdate.getDate(), 12);
                var result = new Date(noon.getTime() + interval.days * 864E5);
                cdate.setDate(1);
                cdate.setFullYear(result.getFullYear());
                cdate.setMonth(result.getMonth());
                cdate.setDate(result.getDate());
                cdate = _maybeFixDst(cdate, result.getDate())
            }
            if (interval.hours) cdate.setHours(cdate.getHours() + interval.hours);
            if (interval.minutes) cdate.setMinutes(cdate.getMinutes() + interval.minutes);
            if (interval.seconds) cdate.setSeconds(cdate.getSeconds() + interval.seconds);
			for(k in interval){
				interval[k] = -interval[k]
			}
            return cdate
        }
    });
    CDate.prototype["toString"] = function () {
        return this.formatDateTime()
    };
    var CDateFactory = function (opt_year, opt_month, opt_date, opt_hours, opt_minutes, opt_seconds, opt_milliseconds) {
        opt_month = opt_month - 1;
        if (arale.isNumber(opt_year)){
			var date = new Date(opt_year, opt_month || 0, 
				opt_date || 1, opt_hours || 0, opt_minutes || 0, opt_seconds || 0, opt_milliseconds || 0);
		}else if (arale.isDate(opt_year)){
			var year  = opt_year.getFullYear();
			var month = opt_year.getMonth();
			var date  = opt_year.getDate();
			var hour  = opt_year.getHours();
			var minute = opt_year.getMinutes();
			var second = opt_year.getSeconds();
			var millisecond = opt_year.getMilliseconds();
			var date = new Date(year, month, date, hour, minute, second, millisecond);
		}
        else{
			return opt_year;
		}
        return new CDate(date)
    };
    module.exports = CDateFactory;
    CDateFactory.fn = CDate.prototype;
    return CDateFactory
}, "$Date");
