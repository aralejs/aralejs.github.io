
# Coundown

倒计时组件

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
    
* `from` : {date}

    起始时间。默认"Date.now()"，获取客户端系统时间。严格场景需设置服务器端系统时间。
    
* `to` : {date}

    结束时间。
    
* `step` : {int}

    刷新频率(ms)。默认"1000"。
    
* `animate` : {boolean}

    是否启用过渡动画效果。默认"false"。

    
* `autoStart` : {boolean}

    是否自动开始计时。默认"false"。





