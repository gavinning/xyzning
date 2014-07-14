'use strict';

// 页面实例

var path = require('path');
var lib = require('linco.lab').lib;
var Page = require('../lib/page');
var page = new Page;

page.extend({
	name: "less page",
	id: "less",
	pageId: "#vpLess",
	$: window.$,

	init: function(){
		console.log('init ' + this.id)
	},

	enter: function(){
		var $ = this.$;

		// 载入页面
		console.log('enter ' + this.id);

		// 渲染页面
		this.render();
		this.cache();


		// 文件夹列表操作
		$(this.pageId).find('.list-folder').delegate('li', 'click', function(){
			var files = [];
			var cssArr = [];
			var folderPath = this.getAttribute('path');

			// 不处理已被选中的文件夹
			if($(this).hasClass('selected')) return;

			// 状态切换
			$(this).addClass('selected').siblings('.selected').removeClass('selected');

			// 遍历src
			if(lib.isDir(folderPath)){
				files = lib.dir(folderPath, ['.svn']).file;
				files.forEach(function(item){
					if(item.match(/less$/g)){
						cssArr.push(item)
					}
				})
			}

			console.log(cssArr.join('\n'))
		})


	},

	leave: function(){
		console.log('leave ' + this.id);
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