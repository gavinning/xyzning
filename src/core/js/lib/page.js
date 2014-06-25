'use strict';

// 底层框架页面，基于PM

var lib = require('linco.lab').lib;
var path = require('path');
var pm = require(path.resolve('./core/js/lib/pm'));

var Page;

// 设置页面基础方法
// 虚拟页面可选引用
Page = function(){
	this.extend = function(obj){
		return lib.extend(this, obj);
	}
	this.extend({
		init: function(){

		},

		enter: function(){

		},

		leave: function(){

		}
	})
}

// 虚拟页面公共方法
Page.prototype = {

	reg: function(){
		return pm.reg(this);
	}
}

module.exports = Page;