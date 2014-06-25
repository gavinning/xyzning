'use strict';

// 虚拟页面管理，底层框架

var path = require('path');
var rootPath = process.cwd();
var pagePath = path.join(rootPath, '/core/js/page');

var pm;


pm = {
	version : '0.0.1',

	name: 'Page Manger',

	init: function(id){
		return id ?
			this.show(id):
			this.show('less');
	},

	show: function(id){
		pm.page ? pm.page.leave() : "";
		pm.prev = pm.page;
		require(path.join(pagePath, id));
	},

	load: function(id){

	},

	reg: function(page){
		this.page = page;
		this.page.enter();
	},

	cache: function(){

	},

	stats: function(){

	},

	hashChange: function(){

	},

	bind: function(){

	}
}

module.exports = pm;