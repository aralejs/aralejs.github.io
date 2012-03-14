/**
 * @name aralex.calendar.Calendar
 * @class
 * @author <a href="mailto:shuai.shao@alipay.com">xuning@alipay.com</a>
 */
var arale = require('arale.base');
var aralexBase = require('aralex.base');
var $Date = require('arale.date');
var $E = require('arale.event');
var $Node = require('arale.dom').$Node;
var $A = require('arale.array');
var $N = require('arale.number');
var declare = require('arale.class');

//@$Loader.css
module.exports = declare('aralex.calendar.Calendar',[aralexBase.TplWidget, aralexBase.View],{
    /** @lends aralex.calendar.Calendar.prototype */
	
	calendar_id : 'calendar',
	/*全部可选*/
	full_selector : false,
	
	/**
	 * 当前页年月
	 * @params {Date|String} pagedate string格式为 yyyy/m
	 */
	pagedate : new Date(),
	
	/**
	 * 可选最小年月
	 * @type {Date|String} mindate sring格式为 yyyy/m
	 */
	mindate : null,
	
	/**
	 * 可选最大年月
	 * @type {Date|String} mindate sring格式为 yyyy/m
	 */
	maxdate : null,
	
	/**
	 * 是否显示dropfilter
	 */
	dropfilter: false,
	
	today : $Date(new Date()),
	
	/**
	 * 日期分隔符
	 * @params {String} date_delimiter 默认 '/'
	 */
	date_delimiter : '/',
	
	/**
	 * 当前选中时间
	 * @params {String} selected 默认 [], 日期格式为"yyyy/m/d"
	 */
	selected : [],
	
	/**
	 * 定位坐标
	 */
	position : null,
	
	/**
	 * 星期显示字符
	 */
	week_text  : ['日', '一', '二', '三', '四', '五', '六'],
	
	/**
	 * 起始星期
	 */
	week_start : 0,
	
    /** @ignore */
	templatePath: arale.getModulePath('aralex/calendar/calendar.tpl'),
		
    /** @ignore */
	init : function(params){},
	
    /** @ignore */
	beforeCreate : function(){
		this._processConfig();
	},
	
	attr : function(key, value){
		this.parent(arguments);
		this._processConfig();
	},
	
	/**
	 * 设置坐标
	 */
	setPosition : function(x,y){
		$(this.id).setStyle('position','absolute');
		$(this.id).setPosition({
			left : x,
			top  : y
		});
	},
	
	/**
	 * 处理用户输入数据
     * @private
	 */
	_processConfig : function(){
		//格式化用户输入日期
		if(!arale.isDate(this.pagedate)){
			this.pagedate = this._parseDate(this.pagedate.toString());
		}
		//处理是否有select下拉框，并初始化数据
		this.mindate = this.mindate ? $Date(this._parseDate(this.mindate)) : $Date(2004);

		this.maxdate = this.maxdate ? $Date(this._parseDate(this.maxdate)) : $Date(this.today.year);
						
		//处理选中日期的数据
		if(arale.isString(this.selected)){
			this.selected = [this.selected];
		}else if(arale.isArray(this.selected) && this.selected.length > 1){
			var start_date = $Date(this._parseDate(this.selected[0]));
			var end_date   = $Date(this._parseDate(this.selected[1]));
			this.selected  = [];
			while(start_date.formatDate() != end_date.formatDate()){
				this.selected.push(start_date.formatDate(this.date_delimiter));
				start_date.add({days : 1});
			}
			this.selected.push(end_date.formatDate(this.date_delimiter));
		}
		//如果week_start大于6，都重置为0
		this.week_start = this.week_start > 6 ? 0 : this.week_start;
	},
	
    /** @ignore */
	postCreate: function(param){
		var that = this;
		this.aroundFn("doSelectEvent");
		this.aroundFn("renderData");
		this.after("renderData",function(){
			$A($$("#"+that.id+" .filterchange")).each(function(target){
				$E.connect(target,"onchange",function(e){
					that.doChangedate(target.node,e)
				});
			})
		});
	},
	
	/**
	 * 格式化用户输入日期格式
	 */
	_parseDate : function(str){
		if(!arale.isString(str)){
			if(str.date) return str.date;
			return str;
		}
		var dateDefault = [0,0,1]
		$A(str.split(this.date_delimiter)).each(function(s,index){
			dateDefault[index] = s.replace(/^0+/,'');
		});
		var year  = parseInt(dateDefault[0]);
		var month = parseInt(dateDefault[1]);
		var day   = parseInt(dateDefault[2]);
		return new Date(year, month-1, day);
	},
	
	/**
	 * 绑定事件
     * @ignore
	 */
	bind: function(){
		var that = this;
		this.addEvent("click" ,this.doChangedate,'.changedate');
		this.addEvent("click",function(target,e){
			this.doSelectEvent($(target).attr('data-date'),target,e);
		},'.selector');
	},
	
	/**
	 * 选中某一日期
	 */
	select : function(date){
		this.selected = date;
		this._processConfig();
		this.render();
	},
	
	/**
	 * 输入dom结构
	 */
	render : function(){
		var data = this._getCurrentDaysData();
		this.renderData(data);
		if(this.position){
			this.setPosition(this.position[0],this.position[1]);
		}
		this._appendIframe();
	},
	
	/**
	 * 选择日期后暴露API接口
	 */
	doSelectEvent : function(date,target,e){
		$A($$('#' + this.id + ' .calcell')).each(function(item){
			$A(this.selected).each(function(sel){
				if($$('a',item)[0].attr('data-date') == sel){
					item.removeClass('selected');
					item.removeClass('activeable');
				}
			});
		},this);
		this.selected = [date];
		$Node($(target).node.parentNode).addClass('selected');
		e.stopEvent();
	},
	
	/**
	 * 下拉框事件
	 */
	doChangedate : function(target,e){
		var pagedate  = $Node(target).attr('data-changedate') ? $Node(target).attr('data-changedate') : target.value;
		this.pagedate = this._parseDate(pagedate);
         /*var next = $(target).hasClass('calnavright');
        this.pagedate = $Date(this.pagedate).add({months: next? 1 : -1});*/
		this.render();
		e.stopEvent();
	},
	
	/**
	 * 获取当前页面所有需要输出的数据
     * @private
	 */
	_getCurrentDaysData : function(){
		var zfill = function(m){
			if(m < 10) return '0'+m;
			return m
		}
		//获取本月总天数
		var days  = $Date(this.pagedate).getNumberOfDaysInMonth();
		//具体日期"2009/11/12"
		var dates = [];

		//第一天星期几
		var first_dayweek = $Date(this.pagedate.getFullYear(), this.pagedate.getMonth()+1, 1).week;
		
		//最后一天星期几
		var last_dayweek = $Date(this.pagedate.getFullYear(), this.pagedate.getMonth()+1, days).week;

		//上个月
		var pre_month_date = $Date(this.pagedate).add({months : -1});
		
		//下个月
		var next_month_date = $Date(this.pagedate).add({months : 1});
						
		//显示上个月天数
		var pre_day_num = first_dayweek - this.week_start;
		var pre_month_days = $Date(pre_month_date).getNumberOfDaysInMonth();
				
		pre_month_days = arale.range(pre_month_days - pre_day_num + 1, pre_month_days);
		
		if(pre_day_num<1){
			pre_month_days = [];
		}
		var pre_month_days_date = $A(pre_month_days).map(function(day){
			return pre_month_date.getFullYear() + this.date_delimiter + zfill(pre_month_date.getMonth() + 1) + this.date_delimiter + zfill(day)
		},this);
				
		//显示下个月天数
		var next_day_num = 42 - pre_day_num - days;
		next_month_days = arale.range(1, next_day_num);		
		var next_month_days_date = $A(next_month_days).map(function(day){
			return next_month_date.getFullYear() + this.date_delimiter + zfill(next_month_date.getMonth() + 1) + this.date_delimiter + zfill(day)
		},this);
		
		//创建日期数组[1....30]
		days = arale.range(1,days);		
		var days_date = $A(days).map(function(day){
			return this.pagedate.getFullYear() + this.date_delimiter + zfill(this.pagedate.getMonth() + 1) + this.date_delimiter + zfill(day)
		},this);
		days  = $A([pre_month_days,days,next_month_days]).flatten()
		dates = $A([pre_month_days_date,days_date,next_month_days_date]).flatten()
		
		//可选年份区段
		var drop_section = (this.dropfilter && this.mindate!=null && this.maxdate!=null) 
			? arale.range(this.mindate.year, this.maxdate.year) : []; 

		return {
			'predate'  : $Date(pre_month_date).formatDate(this.date_delimiter),
			'nextdate' : $Date(next_month_date).formatDate(this.date_delimiter),
			'year'  : this.pagedate.getFullYear(),
			'month' : this.pagedate.getMonth() + 1,
			'days'  : days,
			'dates' : dates,
            'today' : this.today.year + this.date_delimiter + zfill(this.today.month) + this.date_delimiter + zfill(this.today.day),
			'weeks' : this._sortWeekText(),
			'dropfilter' : this.dropfilter,
			'drop_section' : drop_section,
			'selected' : this.selected,
			'delimiter' : this.date_delimiter,
			'mindate' : this.mindate,
			'maxdate' : this.maxdate,
			'full_selector' : this.full_selector
		}
	},
	
	/**
	 * 根据week_start重新排序显示顺序
     * @private
	 */
	_sortWeekText : function(){
		var s_week = this.week_text.slice(this.week_start, 7);
		var e_week = this.week_text.slice(0, this.week_start);
		$A(s_week).extend(e_week);
		return s_week;
	},
	
	/**
	 * IE6吓放置iframe
     * @private
	 */
	_appendIframe : function(){
     	 if(arale.isIE6() && $(this.id).query("iframe").length<1){
	          var iframe = new Node("iframe");
	          iframe.addClass("fixedsize");
	          iframe.attr("frameBorder","0");
	          iframe.attr("scrolling","no");
	          iframe.attr("src","javascript:'';");
  
	          var style = {
	              position : "absolute",
	              zIndex : -1,
	              scrolling : 'no',
	              border : 'none',
	              filter : 'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)'
	          }
	          iframe.setStyle(style)
	          $(this.id).node.appendChild(iframe.node);
	      }
	  }

	
});
