'use strict';

// 页面实例

var path = require('path');
var lib = require('linco.lab').lib;
var Page = require('../lib/page');
var page = new Page;

page.extend({
	id: "css",
	pageId: "#vpCss",

	init: function(){
		console.log('init ' + this.id)
		this.enter();
	},

	enter: function(){
		this.render();
	}

});

page.reg();

module.exports = page;