'use strict';

// 底层框架页面，基于PM

var lib = require('linco.lab').lib;
var path = require('path');
var pm = require('./pm');
var mTpl = require('./mTpl').mTpl;
var Page;
var tmp = {};
tmp.hash = {};

// 设置页面基础方法
// 虚拟页面可选引用
Page = function(){
	this.extend = function(obj){
		return lib.extend(this, obj);
	}

	// 定义页面实例默认方法，可被覆盖
	this.extend({
		// 页面实例初始化方法
		init: function(){

		},

		// 页面实例进入方法
		enter: function(){

		},

		// 页面实例离开方法
		leave: function(){

		},

		dragCallback: function(){

		},

		// 页面实例默认拖拽方法
		drag: function(files, target, e){
			var ul, $;

			$ = window.$;
			ul = $('#listFolder').find('ul');

			// 添加文件夹方法
			function add(file){
				// console.log(file, ul)
				ul.append('<li path="'+file.path+'">'+file.name+'</li>')
			}

			// 监听drag事件
			lib.each(files, function(i, item){
				if(lib.isDir(item.path)){
					if(!tmp.hash[item.path]){
						tmp.hash[item.path] = item;
						add(item);
					}
				}
			})

			this.dragCallback(files, target, e);
		}

	})
}

// 虚拟页面公共方法
Page.prototype = {

	// 统计方法
	stats: function(){

	},	

	// 注册页面
	reg: function(){
		pm.reg(this);
		pm.cache();
		this.stats();
		return;
	},

	// 渲染页面
	render: function(id, dom, data){
		var doc = window.document;
		doc.getElementById(id).innerHTML = mTpl(dom, data);
	},

	// 调用node-webkit shell
	shell: {
		file: function(src){
			var gui = window.gui;
			var shell = gui.Shell;
			return shell.openItem(src);
		},

		folder: function(src){
			var gui = window.gui;
			var shell = gui.Shell;
			return shell.showItemInFolder(src);
		},

		url: function(src){
			var gui = window.gui;
			var shell = gui.Shell;
			return shell.openExternal(src);
		}
	}
}

module.exports = Page;