'use strict';

// author: gavinning
// HomePage: www.ilinco.com
// 底层框架页面，基于PM，由底层框架逻辑和部分页面逻辑组成

var lib = require('linco.lab').lib;
var path = require('path');
var jade = require('jade');
var pm = require('./pm');
var tips = require('./tips');
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
			// 页面初始化日志
			console.log('init ' + this.id);
			// 进入页面
			this.enter();
			// 页面DOM事件绑定，所有事件绑定集合方法
			this.bind();
		},

		// 页面实例进入方法
		// 每次需要执行方法放到这里
		enter: function(){

			// this.render();
		},

		// 页面DOM事件绑定方法
		bind: function(){

		},

		// 页面实例离开方法
		leave: function(){
			this.page ? "" : this.page = $(this.pageId);
			this._log ? "" : this._log = $(this.logId);
			this.page.hide();
			this._log.hide();
		},

		// 页面回退方法，默认调用系统回退
		back: function(){

		},

		// 渲染页面方法
		render: function(src, data){
			var content = $('#content');
			var html;

			this.page = content.find(this.pageId);

			if(this.page.length == 1){
				this.page.show();
			}else{
				html = jade.renderFile(src || path.join(root.app.dir, 'src/views/'+this.id+'.jade'), data || {});
				content.append(html);
				this.page = content.find(this.pageId);
				this.page.show();
			}
		},

		// 全局tips模块占位
		tips: function(msg){
			tips.show(msg)
		},

		// 页面log
		log: function(msg, error){
			this.logId = this.id + 'Log';
			this._log = $('#' + this.logId);

			// 检查页面切换
			if(!msg && this._lastLog){
				return this.log(this._lastLog, this._lastLogError);
			}

			// 检查空日志
			if(!msg) return;

			// 检查当前页面logDOM
			if(this._log.length == 0){
				app.log.append('<div id="'+this.logId+'" class="log"></div>');
				this._log = $('#' + this.logId);
			}

			// 检查是否是警告消息
			if(error){
				this._log.addClass('error');
			}else{
				this._log.removeClass('error');
			}

			// 错误插入检查
			if(this._log.length > 1){
				console.error('页面logDOM插入错误')
			}

			this._log.text(msg).show();
		},

		cache: function(){
			
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