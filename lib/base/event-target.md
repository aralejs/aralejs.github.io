
康辉负责

## EventEmitter
事件扩展.  主要是在jquery事件基础上进行扩展. 接口和jquery尽量一致. 其中借鉴了YUI中 EventTarget的部分功能. 

### 需要支持的主要功能和相应的场景.
使用上目前有2种

#### 一. 全局调用(是否支持跨sandbox事件传播).

* 基本的事件发布和订阅.
	1. 事件是否支持链式调用?
	2. 事件取消订阅是通过在绑定的时候获取的句柄 or 通过绑定的时候传递的对应的参数?
	3. 如何向订阅者传递数据?

```
var E = require('event-emitter');

var cb = function() {};

E.on('render', function(a, b) {
	console.log('render');
}).on('render', cb); //是否支持链式调用?
E.emit('render',["a", "b"]);

E.off('render', cb);

E.once('render', cb);
E.emit('render');
E.emit('render');

//其中对于如何在发布事件的时候进行数据传递, 有三种方式.
//1. emit的时候, 传递一个数组,这个数组对应的传递到订阅函数中.
//2. 通过创建EventObject. 这个对象模拟dom事件中的一些内容. 
//3. 两种都支持, 通过配置来进行选择.

```
* 支持事件前缀

```
var E = require('event-emitter');

var cb = function() {};

E.on('render:title', function() {
	console.log('render title');
});
E.on('render:body', function() {
	console.log('render body');
});
E.on('render:*', function(){
	console.log('render');
});
E.emit('render:title');
E.emit('render:body');

```

#### 二 扩展使用.
1. 前缀的配置方式? 在扩展的时候是否可以统一的设置前缀,或者其他参数? 在yui的EventTarget是在augment中进行的, 我们怎么做?

```
var Class = require('class');
var EventEmitter = require('event-emitter');
var Widget = Class.create({
	Implements: [EventEmitter],
	render: function() {
		this.publish('render', {
			//支持配置, 但是感觉这样使用有点怪怪的.
			prefix: 'Widget', //明确默认前缀, 但是如果需要发布多个不同事件的话, 这种方式很冗余.
			defaultFn: dFn,
			emitOnce: true
		});
		this.emit('render');
	},
	show: function() {
		this.publish('show', {
			prefix: this.getType(), //更加精确的前缀. 确定也是多个事件会冗余.
			defaultFn: dFn
		});
		this.emit('show');
	},
	bind: function() {
		this.emit('bind'); //使用默认前缀
	},
	getType: function() {
		return 'Widget' + this.id
	}
});
var w = new Widget();
w.on('Widget:render', function() {
	console.log('w render!');
});
w.on(this.getType() + ':show', function() {
	console.log('w show');
});

//通过实例对象进行订阅, 不需要前缀.
w.on('bind', function() {

});
//是否支持全事件监听? 
w.on('*', function() {
	
});
//是否可以支持类事件订阅. 比如我们可以订阅所有Widget实例的事件.
//订阅所有Widget实例对象的render事件
EventEmitter.on('Widget:render', function() {

});


```

### API(一)

* on
* off
* emit
* once
* publish

### API(二)
* removeAll
* setMaxListeners

### Configure

* prefix
* defaultFn
* emitOnce 

#### 问题如果进行全局配置?




