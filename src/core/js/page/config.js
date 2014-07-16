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

		// 回调处理可以忽略
		// 测试过程中刷新频繁
		// 所以做一下回调
		if(app.config._id){
			this.enter();
			this.bind();
		}else{
			this.getCache(function(){
				page.enter();
				page.bind();
			})
		}
	},

	enter: function(){
		// 渲染页面
		this.render(null, app.config);
	},

	bind: function(){
		// 更新配置
		$('#updateConfig').click(function(){
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

	},

	getCache: function(callback){
		// 读取全局配置信息
		db.data.find({name: app.config.name}, function(e, docs){
			if(e) return tips.show('数据库链接失败');
			docs.length > 0 ?
				app.config = docs[0] : "";

			callback(app.config)
		});
	}

});

page.reg();

module.exports = page;