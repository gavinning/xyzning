'use strict';

// author: gavinning
// HomePage: www.ilinco.com
// 底层框架页面，基于PM，由底层框架逻辑和部分页面逻辑组成

var lib = require('linco.lab').lib;
var path = require('path');
var jade = require('jade');
var pm = require('./pm');
var mTpl = require('./mTpl').mTpl;
var Page;

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
			console.log('init ' + this.id);
			this.enter();
		},

		// 页面实例进入方法
		enter: function(){

		},

		// 页面实例离开方法
		leave: function(){
			console.log('leave ' + this.id);
			this.page.hide();
		},

		back: function(){

		},

		// 渲染页面
		render: function(src){
			var content = $('#content');
			var html;

			this.page = content.find(this.pageId);

			if(this.page.length == 1){
				this.page.show();
			}else{
				html = jade.renderFile(src || path.join(root.app.dir, '/views/'+this.id+'.jade'), {});
				content.append(html);
				this.page = content.find(this.pageId);
				this.page.show();
			}
		},

		cache: function(num){
			var ul = window.$(this.pageId).find('.list-folder ul');
			var cache = window.localStorage[this.pageId + 'Aside'];

			if(num){
				// 缓存aside
				ul.html() ?
					window.localStorage[this.pageId + 'Aside'] = ul.html():"";
			}else{
				// 取出aside
				cache && cache !== 'null' ?
					ul.html(cache):"";
			}
		},

		dragCallback: function(){

		},

		// 页面实例默认拖拽方法
		drag: function(files, target, e){
			var ul = $(this.pageId).find('.list-folder ul');
			var hash;

			if(ul.length == 0) return;

			// 获取aside过滤hash
			this.asideHash ? "" : this.asideHash = {};
			hash = this.asideHash;

			// 添加文件夹方法
			function add(file){
				// console.log(file, ul)
				ul.append('<li path="'+file.path+'">'+file.name+'</li>')
			}

			// 监听drag事件
			lib.each(files, function(i, item){
				if(lib.isDir(item.path)){
					if(!hash[item.path]){
						hash[item.path] = true;
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