'use strict';

// 页面实例

var path = require('path');
var lib = require('linco.lab').lib;
var Page = require('../lib/page');
var page = new Page;

page.extend({
	// 页面名称，不关系页面业务逻辑
	name: "less page",
	// 页面id，唯一，关系页面逻辑
	id: "less",
	// 虚拟页DOM id，唯一，关系页面逻辑
	pageId: "#vpLess",
	// 缓存全局库
	$: window.$,

	init: function(){
		console.log('init ' + this.id);
		this.enter();
		this.cache();
	},

	enter: function(){
		var $ = this.$;
		var live = {};

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

				console.log(this.list(cssArr))
			},

			list: function(arr){
				var ul = $(window.document.createElement('ul'));
				arr.forEach(function(item){
					var li = '<li><strong>'+path.basename(item)+'</strong><i>'+item+'</i></li>';
					ul.append(li);
				});
				return ul.html();
			}
		})


	},

	leave: function(){
		console.log('leave ' + this.id);
		this.cache(1);
		this.page.hide();
	},

	dragCallback: function(){
		this.cache(1);
	},

	ready: function(){

	}

});

page.reg();

module.exports = page;