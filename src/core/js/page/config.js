'use strict';

// 页面实例

var path = require('path');
var lib = require('linco.lab').lib;
var db = require('../lib/db');
var Page = require('../lib/page');
var page = new Page;

page.extend({
	// 页面id，唯一，关系页面逻辑
	id: "config",
	// 虚拟页DOM id，唯一，关系页面逻辑
	pageId: "#vpConfig",

	init: function(){
		console.log('init ' + this.id);

		this.enter();
		this.bind();
	},

	enter: function(){
		// 载入页面
		console.log('=> ' + this.id);

		// 渲染页面
		this.render(null, app.config);
	},

	bind: function(){
		// 更新配置
		$('#updateConfig').click(function(){
			console.log(1)
			page.setCache();
		})
	},
	
	setCache: function(){
		lib.extend(app.config.config, {
			// for server
			serverEnable	: $('#serverEnable').prop('checked'),
			serverPath		: $('#serverPath').val(),
			localPath		: $('#localPath').val(),
			key				: $('#key').val(),

			// for less
			defaultHome		: $('#defaultHome').prop('checked'),
			defaultCompress	: $('#defaultCompress').prop('checked')
		});

		// 更新数据
		db.data.find({name: page.id}, function(e, docs){
			if(e){
				page.tips('数据库链接失败');
				console.log(e);
			}

			docs = docs || [];

			if(docs.length == 0){
				db.data.insert(app.config, function(e, doc){
					app.config = doc;
				})
			}else{
				db.data.update({name: page.id}, app.config, function(e, num){
					if(e) return page.tips('配置更新失败');
					page.tips('配置更新成功');
				})
			}
		})

	}

});

page.reg();

module.exports = page;