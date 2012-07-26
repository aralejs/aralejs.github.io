
# Coundown

倒计时组件，常用于活动页面倒计时，用户付款、退款截止时间。

---


## 模块依赖

 - [seajs](seajs/README.md)
 - [jquery](jquery/README.md)



## 配置说明

* `template`: {string}
    
    通过`template`或者源HTML来自动判断`format`. 如: 
       
        <div id="timer1">
            <span class="day">
                <span class="digit ">0</span>
                <span class="digit ">0</span>
                <span class="digit ">0</span>
            </span>
            <span class="hour">
                <span class="digit ">0</span>
                <span class="digit ">0</span>
            </span>
            <span class="minute">
                <span class="digit ">0</span>
                <span class="digit ">0</span>
            </span>
            <span class="second">
                <span class="digit ">0</span>
                <span class="digit ">0</span>
            </span>
        </div>
        
    PS：组件能够自动判断是否有"年"，"月"，"日"的结构容器片段，并依次转换成对应的"月"，"日"，"时"。比如当不存在`class="year"`的容器时，1年会被转换为24个月，如果没有`class="month"`的容器时，1年会被转换为365天。
    
* `from` : {date}

    起始时间。默认"new Date()"，获取客户端系统时间。严格场景需配置服务器端系统时间。
    
* `to` : {date}

    结束时间。默认"new Date()"，获取客户端系统时间。
    
* `step` : {int}

    刷新频率(ms)。默认"1000"。当设置小于25ms时，组件限制为24ms。
    
* `animate` : {boolean}

    是否启用过渡动画效果。默认"false"。
    PS：每个数字的容器都有对应的class名称，0对应digit0，1对应digit1……9对应digit9。当开启动画时，可以根据此class来设置每个数字容器的样式。

    
* `autoStart` : {boolean}

    是否自动开始计时。默认"false"。





