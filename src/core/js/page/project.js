'use strict';

// 页面实例
var watch = require('/Users/gavinning/Documents/lab/github/Lab/src/watch');
var path = require('path');
var lib = require('linco.lab').lib;
var db = require('../lib/db');
var Page = require('../lib/page');
var page = new Page;

page.extend({
	// 页面名称，不关系页面业务逻辑
	name: "project page",
	// 页面id，唯一，关系页面逻辑
	id: "project",
	// 虚拟页DOM id，唯一，关系页面逻辑
	pageId: "#vpProject",

	init: function(){
		console.log('init ' + this.id);
		this.enter();

		// 读取缓存数据
		this.cache();

		// 启动监听
		// watch(['xyzning'], {baseDir: '/Users/gavinning/Documents/lab/github/'}, function(filename, stat){
		// 	console.log(filename)
		// })
	},

	enter: function(){
		var $ = window.$;
		var live = this.live = {};
		var _this = this;

		// 载入页面
		console.log('enter ' + this.id);

		// 渲染页面
		this.render();

		// 拓展live
		live.extend = function(obj){
			lib.extend(this, obj);
		}

		// 文件夹列表操作
		$(this.pageId).find('.list-folder').delegate('li', 'click', function(){
			var files = [];
			var cssArr = [];
			var folderPath = this.getAttribute('path');

			// 不处理已被选中的文件夹
			// if($(this).hasClass('selected')) return;

			// 状态切换
			$(this).addClass('selected').siblings('.selected').removeClass('selected');

			// 渲染文件夹列表
			live.renderFolder(folderPath);
		});


		// 工具方法
		live.extend({

			renderFolder: function(src){
				var files, cssArr = [];

				if(!lib.isDir(src)) return;

				// 遍历文件夹
				files = lib.dir(src, ['.svn']).file;
				files.forEach(function(item){
					if(item.match(/less$/g)){
						cssArr.push(item)
					}
				});

				$(page.pageId).find('.list-file ul').html(this.list(cssArr));
			},

			list: function(arr){
				var ul = $(window.document.createElement('ul'));
				arr.forEach(function(item){
					var li = '<li><strong>'+path.basename(item)+'</strong><i>'+item+'</i></li>';
					ul.append(li);
				});
				return ul.html();
			},

			renderAside: function(obj){
				var ul = $(page.pageId).find('.list-folder ul');

				// 添加文件夹方法
				function add(file){
					ul.append('<li path="'+file.src+'">'+file.name+'</li>')
				}

				// 监听drag事件
				lib.each(obj.aside, function(key, value){
					if(lib.isDir(key)){
						add(value);
					}
				})
			}
		});

		// enter end.
	},

	leave: function(){
		console.log('leave ' + this.id);
		// this.cache(1);
		this.page.hide();
	},

	cache: function(key, value){
		if(arguments.length == 0){
			db.data.find({name: this.id}, function(e, docs){
				page.live.renderAside(docs[0])
			})
		}
	},

	dragCallback: function(){
		// this.cache(1);
	},

	ready: function(){

	}

});

page.reg();

module.exports = page;