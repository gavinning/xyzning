'use strict';

// 页面实例
var path = require('path');
var watch = require(path.join(root.app.dir, '../../Lab/src/watch'));
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
		// 初始化页面
		console.log('init ' + this.id);

		// 注册live方法
		this.live = new lib.parent();

		// 进入页面
		this.enter();

		// 读取缓存数据
		this.cache();

		// 启动监听
		// watch(['xyzning'], {baseDir: '/Users/gavinning/Documents/lab/github/'}, function(filename, stat){
		// 	console.log(filename)
		// })
	},

	enter: function(){
		var _this = this;
		var live = this.live;

		// 载入页面
		console.log('enter ' + this.id);

		// 渲染页面
		this.render();

		// 文件夹列表操作
		this.page.find('.list-folder').delegate('li', 'click', function(){
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

				_this.page.find('.list-file ul').html(this.list(cssArr));
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
				var ul = _this.page.find('.list-folder ul');

				// 添加文件夹方法
				function add(file){
					ul.append('<li path="'+file.path+'">'+file.name+'</li>')
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

	buildAsideHash: function(obj){
		page.asideHash = page.asideHash || {};
		lib.each(obj.aside, function(key, value){
			page.asideHash[key] = true;
		})
	},

	cache: function(src){
		var cache, tmp;

		cache = {
			type: "page",
			name: "project",
			aside: {
				// @path: {
				// 	@name: string,
				// 	@path: string:url,
				// 	@isHome: true,
				// 	@isCompress: true
				// }
			}
		};

		// 加载数据
		if(arguments.length == 0){
			db.data.find({name: this.id}, function(e, docs){
				if(docs.length==0) return;
				// 缓存页面data对象
				page._cache = docs[0];
				page.live.renderAside(docs[0]);

				// 重建page.asideHash
				page.buildAsideHash(page._cache);
			});

			return;
		};


		// 存储数据

		// 更新aside节点对象
		tmp = {
			name: path.basename(src),
			path: src,
			isHome: $('#isHome').prop('checked'),
			isCompress: $('#isCompress').prop('checked')
		};

		// 更新数据
		if(page._cache){
			page._cache.aside[src] = tmp;
			db.data.update({name: "project"}, page._cache, function(e, num){
				console.log(e, num)
			})
		}else{
			cache.aside[src] = tmp;
			db.data.insert(cache, function(e, doc){
				page._cache = doc;
			})
		}

	},

	dragCallback: function(filelist){
		lib.each(filelist, function(i, item){
			page.cache(item.path)
		})
	},

	ready: function(){

	}

});

page.reg();

module.exports = page;