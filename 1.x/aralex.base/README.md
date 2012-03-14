Overview
========

`aralex.base`项目是Arale框架的组件核心. 包含了整个组件的设计思想. 并义了组件的默认的生命周期，在生命周期的每一个阶段我们可以做相应的事情, 我们提供了默认的实现, 使用者可以根据自己的需求覆盖相应的方法.

在base模块里面提供了三个对象, aralex.Widget--所有组建的基类, aralex.TplWidget--所有包含模版的组件的基类, View--一个辅助模块提供了show, hide的便捷方法. 

在API中我们分别会对我们日常需要覆盖或者用到的模版方法予以介绍. 


Configuration
=============

Widget
{
    id: 'id', //如果提供id, 则会把$('id')这个dom对象作为整个组件的容器,
    domNode: $('id'), //也可以直接创建好dom对象传递给组件,作为整个组件的容器.
}

TplWidget
{
    onlyWidget: false, //全局只有一个widget,算是一个hack
    srcId:null, // 在使用模版的组件中，我们如果给组件在页面提供一个占位符，比如在页面中放置一个id为abc的div，把srcId配置成abc，那么组件初始化时，会把模版渲染好并且替换这个占位符div。
    parentId: null, //在使用模版的组件中，比如在页面中生成一个id为abc的div，把parentId配置成abc，那么组件初始化时，会把模版渲染好并且插入到这个div中。
    data: null, //用来渲染模版的数据。
    templateString: null, // 模版的内容. 可以通过我们自定义的语法@template把指定的模版内容在编译期间替换进来。

}


Usage
=============
示例一: Widget组件 在指定区域根据用户的配置输出一个<div>用户指定的内容</div>, 用户点击区域, alert里面的内容
`
arale.declare('aralex.Test', [aralex.Widget], {
    init: function(params) {
       console.log('init-->');
       console.log(params);
       //在这个方法中可以对用户传入的参数进行加工和修改
       params.value = "-->" + params.value + "<--";
    },
    beforeCreate: function() {
        console.log('breforeCreate!');
        //组件还未创建出来, 在这里我们可以进一步做些初始化操作, 比如去初始化一些额外的操作啥
    },
    initDom: function() {
        console.log('init dom');
        //组件容器初始化方法, 在这里我们可以初始化我们的组件容器, 我们所有组件的dom操作都是基于这个容器对象的. 默认这个对象为domNode.
        //默认实现为this.domNode = $(this.id); 如果我们的程序没有提供id, 也没有提供domNode这个属性, 则表明我们这个组件是一个纯逻辑组件
        //不需要相应的dom操作, 如果调用添加事件等方法则会报错.
        this.parent(arguments);
        var p = document.createElement('p');
        $(p).setHtml(this.value);
        this.domNode.adopt(p);
    },
    bind: function() {
        var that = this;
        console.log('bind');
        //通过delegate的方式绑定事件, 类似于$E.delegate(this.domNode, 'click', function(){}, 'p');
        this.addEvent('click', function() {
            alert(that.value);             
        }, 'p');
    },
    postCreate: function() {
        console.log('post create');
        //组件容器初始化完毕. 可以继续做事情了
    }
});

var t = new aralex.Test({
    value: 'content',
    id: 'test'
});

`
大家可以把上述代码可以按照自己的想法修改后, 进行测试


示例二: TplWidget组件. 根据用户传入的data, 构造内容列表
test2.tpl--
`<div id="test2" class="fn-hide">
    <!--下面的script的内容, 会自动被抽取出来. 然后渲染的时候会合相对应的模版进行渲染通过id. -->
	<script type="text/html" id="suggestItems">
		<ul>
		<% for (var i=0; i<items.length; i++){ %>
			<% var item = items[i]; %>
			<li class="ui-menu-item"><%=item.value%></li>		
		<% } %>
		</ul>
	</script>
	<!--由于页面可能存在多个实例, 这种情况下就需要把id加到前面, 这样我们会自动把组件容器的id给加上去, 这样就可以保证id的唯一-->
    <div id="${id}_suggestItems" class="ui-menu</div>
</div>
`
`
arale.declare('aralex.Test2', [aralex.TplWidget, aralex.View], {
    //templateString: @template('autocomplete.tpl'), //程序在打包的过程中会自动把指定的模版文件给内联进来. @template是自定义的语法. 
    templateString: '%20%3Cdiv%20id%3D%22test2%22%20class%3D%22fn-hide%22%3E%0A%20%09%3Cscript%20type%3D%22text%2Fhtml%22%20id%3D%22suggestItems%22%3E%0A%20%09%09%3Cul%3E%0A%20%09%09%3C%25%20for%20%28var%20i%3D0%3B%20i%3Citems.length%3B%20i%2B%2B%29%7B%20%25%3E%0A%20%09%09%09%3C%25%20var%20item%20%3D%20items%5Bi%5D%3B%20%25%3E%0A%20%09%09%09%3Cli%20class%3D%22ui-menu-item%22%3E%3C%25%3Ditem.value%25%3E%3C%2Fli%3E%09%09%0A%20%09%09%3C%25%20%7D%20%25%3E%0A%20%09%09%3C%2Ful%3E%0A%20%09%3C%2Fscript%3E%0A%20%20%20%20%20%3Cdiv%20id%3D%22%24%7Bid%7D%5FsuggestItems%22%20class%3D%22ui-menu%22%3E%3C%2Fdiv%3E%0A%20%3C%2Fdiv%3E%0A',
    bind: function() {
        this.addEvent('click', function(target, e) {
            alert($(target).getHtml());
        }, 'li');
    }
    //, data:{items: [{value:'a'}, {value: 'b'}, {value: 'c'}]} //默认也可以把数据提供, 会自动渲染模版          
} 
});

var test2 = new aralex.Test2();
test2.renderData({
    items: [{value:'a'}, {value: 'b'}, {value: 'c'}]              
});

test2.show(); // 显示组件
test2.hide(); //隐藏组建
`


API -- Widget
=============

*   init(params);
    在初始化widget的时候首先调用的方法, 在这里我们可以对用户传入的参数进行修改. 
    params 用户在构造组件的时候传入的参数对象

*   beforeCreate();
    需要覆盖. 初始化dom结构之前会执行这个函数，此时用户配置已混入对象实例

*   initDom();
    domNode初始化函数. 用户如果在构造组件的时候传入了id, 将把指定id的dom元素作为组件容器对象也就是domNode

*   bind();
    需要覆盖. 事件绑定函数,  在这个函数里面我们可以定于需要绑定的事件, 一般是通过addEvent来绑定.

*   postCreate();
    需要覆盖. 组件创建完毕时会调用此函数

*   addEventeventType, handler, selector);
    使用事件代理绑定事件，这是推荐的绑定事件的方式. 
    eventType 事件类型，比如'click', 'blur'. handler 事件处理函数.  selector 选择器，用来指定domNode中具体响应事件的元素.

*   aroundFn(fn);
     给指定的函数添加before,after事件，使之成为eventEmitter(事件发射器)。调用这个方法后，fn函数会在执行前和执行后自动发布事件，用户可以通过before和after进行事件订阅。<br/>
     请注意，使用这种方式，fn函数执行前后发布事件时同时发布出的数据与fn被调用的参数相同。如果想自定义发布的数据（回调接受到的参数），需要手动发布事件，并且调用defaultFn函数。
    fn 需要绑定的函数名称
    example: this.aroundFn('show');

*   defaultFn(fn);
    参考aroundFn函数，defaultFn函数的作用比aroundFn函数少了自动发布事件的功能，它使组件通过before和after订阅事件的能力，或者通过beforeFn和afterFn在配置中订阅事件。
    fn 需要绑定的函数名称

*   addActionFilter(fn, filter);
    
    增加一个actionFilter。使用actionFilter对某个函数进行过滤，若filter函数返回true，则函数有机会执行。若actionFilter返回false，则函数被拒绝执行。
    fn 要过滤的函数名称。必须存在这个实例方法。 filter 控制函数，若此函数的返回值为false，则拒绝执行被控制的函数.

*   removeActionFilter(handler);
    删除制定的actionFilter. handler 调用addActionFilter返回的句柄.

*   before(fn, callback);
    
     订阅某一EventEmitter，在事件发生前执行回调函数。在Arale框架的组件体系中，所谓eventEmitter是指事件发射器，当一个函数执行的前后我们想暴漏出执行代码的机会，那么我们会让这个函数成为事件发射器。
    fn 要订阅的函数名称，也就是eventEmitter. callback 回调函数

*   after(fn, callback);

     订阅某一EventEmitter，在事件发生后执行回调函数。在Arale框架的组件体系中，所谓eventEmitter是指事件发射器，当一个函数执行的前后我们想暴漏出执行代码的机会，那么我们会让这个函数成为事件发射器。
     fn 要订阅的函数名称，也就是eventEmitter.  callback 回调函数

*   rmFn(handler);
    
    取消事件订阅。例如通过before和after订阅的事件通过调用rmFn可以解除。
    handler 使用before和after订阅事件时返回的句柄。

*   attr(key, value);
    
    改变对象属性值

*   destroy();
    销毁组件。默认的行为是解除事件绑定。用户可以扩展此方法来做额外的动作进行销毁组件。
    
API -- TplWidget
=============

*   renderData(data,tmplId,isReplace);
    渲染模版的默认实现，用户可以根据情况覆盖。
    data 渲染模版需要的数据. tmplId 制定渲染哪个模版，这个id是在模版中使用的id. isReplace 是把整个模版把容器替换掉,还是添加到模版容器里面

*   getTmplHtml(tmplId, data);
    根据数据获取模版的内容
    tmplId 模版id. data 需要用来渲染模版的数据


API -- View
=============

*   show();
    显示组件

*   hide();
    隐藏组件
