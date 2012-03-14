Overview
========

Calendar(日历控件)，让用户可以直观方便的选取日期，并返回格式化日期

Usage
======

源代码示例

    var cal = new aralex.calendar.Calendar();
    cal.render();
    cal.show();

Configuration
=============

*   pagedate - Date | String
    设置当前显示页展示的月份日期

*   mindate - Date | String
    可选最小年月

*   maxdate - Date | String
    可选最大年月

*   dropfilter - Boolean， 默认:false
    是否用Select控件选择年月

*   date_delimiter - String, 默认:'/'
    日期分隔符

*   selected - Array | String, 默认: null
    已选中日期， 如:'2010/11/12', 或者['2010/11/1','2010/11/12']选中2010/11/1到2010/11/12所有日期

*   position - Array
    设置控件显示坐标

*   week_text - Array，默认['日', '一', '二', '三', '四', '五', '六']
    星期显示字符

*   week_start - Number， 默认: 0(星期日)
    起始星期，星期一到星期日分别用1 - 7(0)表示

Methods
=======

*   render()
    输出日历Dom结构到页面

*   show()
    显示Calendar

*   hide()
    隐藏Calendar

*   select(date), date:{String}
    选中某一天，如 cal.select('2010/11/12');

*   setPosition(x, y),
    设置坐标，如 cal.setPosition(200,200);

Events
======

`doSelectEvent(date, target, e)`, date:选中的日期， target: 触发的dom节点， e: Event

选择日期事件暴露接口

    cal.before("doSelectEvent", function(date, target, e) {
        console.log("beforeDoSelect");
    });
    cal.after("doSelectEvent", function(date, target, e) {
        console.log("AfterDoSelect");
    });
