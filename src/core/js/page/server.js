'use strict';

// 页面实例

var path = require('path');
var lib = require('linco.lab').lib;
var Page = require('../lib/page');
var page = new Page;

page.extend({
	// 页面名称，不关系页面业务逻辑
	name: "server page",
	// 页面id，唯一，关系页面逻辑
	id: "server",
	// 虚拟页DOM id，唯一，关系页面逻辑
	pageId: "#vpServer",

	init: function(){
		console.log('init ' + this.id);
		this.enter();
		this.cache();
	},

	enter: function(){
		var live = {};

		// 载入页面
		console.log('enter ' + this.id);

		// 渲染页面
		this.render();

		// 拓展live
		live.extend = function(obj){
			lib.extend(this, obj);
		}

		


	},

	leave: function(){
		console.log('leave ' + this.id);
		this.page.hide();
	},

	dragCallback: function(){
		this.cache(1);
	},

	ready: function(){

	}

});

page.reg();

module.exports = page;