'use strict';

// 页面实例

var path = require('path');
var Page = require(path.resolve('./core/js/lib/page'));

var page = new Page;

page.extend({
	name: "less",
	id: "less",

	init: function(){

	},

	enter: function(){

		console.log('enter less')
	},

	leave: function(){

	}
});

page.reg();


module.exports = page;