'use strict';

// 页面实例

var path = require('path');
var lib = require('linco.lab').lib;
var Page = require('../lib/page');
var page = new Page;

page.extend({
	name: "css page",
	id: "css",
	pageId: "#vpCss",
	$: window.$,

	init: function(){
		console.log('init ' + this.id)
	},

	enter: function(){
		// 载入页面
		console.log('enter ' + this.id);


		this.render();


	},

	leave: function(){
		console.log('leave ' + this.id)
		this.page.hide();
	},

	ready: function(){

	}

});

page.reg();

module.exports = page;