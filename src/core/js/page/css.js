'use strict';

// 页面实例

var path = require('path');
var jade = require('jade');
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
		// var win = window;
		// var $ = win.$;
		// var content = $('#content');
		// var thisPage = $(this.pageId);

		// 载入页面
		console.log('enter ' + this.id);


		this.render();


	},

	leave: function(){
		console.log('leave ' + this.id)
		console.log(this.id + ' is hide 2222222222222')
		this.page.get(0).style.display = 'none';
	},

	ready: function(){

	},

	render: function(){
		var win = window;
		var $ = this.$;
		var content = $('#content');
		var html;

		this.page = $(this.pageId);

		if(this.page.length == 1){
			this.page.show();
		}else{
			html = jade.renderFile(path.join(window.root, '/views/css.jade'), {});
			content.append(html);
			this.page = content.find(this.pageId);
			this.page.height(content.height())
			this.page.show();
		}
	}
});

// page.init();
page.reg();

module.exports = page;