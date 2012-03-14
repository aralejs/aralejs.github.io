exports.StringXbox = declare("aralex.xbox.StringXbox", [exports.DomXbox], {
    /** @lends aralex.xbox.StringXbox.prototype */
    /**
     * xbox类型
     * @type String
     * @default 'string'
     * @private
     */
	type: "string",
    /**
     * 初始化dom
     * @private
     */
	initDom: function() {
		//原来的domNode从原来的地方插入到mock中,然后在关闭的时候还需要把这个部分归位,目前应该没有这个必要,所以不要了
		//然后并且把这个node作为我们的domNode因为有些事件是绑定在他上面的
		this.domNode = $($D.toDom(this.makeValue()));
		//我们需要把这个节点从原有的文档结构中孤立起来
		//this.domNode.dispose();
	}
});
