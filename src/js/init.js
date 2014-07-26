'use strict';

// 初始化首页
function init(){
	var fs = require('fs');
	var path = require('path');

	var tips = require('./lib/tips');
	var db = require('./lib/db');
	// var reload = require('./lib/reload');
	var scroll = require('./lib/scroll');
	var drag = require('./lib/drag');
	var pm = require('./lib/pm');
	var location = window.location;
	
	// 检测nodejs环境
	if(!root || root.root !== root){
		return console.log(root + ' is not nodejs root');
	}

	// 缓存app信息
	root.app = {
		dev: true,
		// 注册app根目录
		dir: process.cwd(),
		// 注册app数据缓存目录
		tmp: window.gui.App.dataPath,
		// 注册logDOM
		log: window.$('#log'),

		// 注册默认配置信息
		config: {
			type: "page",
			name: "config",
			isConfig: true,
			config: {
				// for server
				serverEnable	: false,
				serverApi		: '',
				serverPath		: '',
				localPath		: '',
				key				: '',

				// for less
				defaultHome		: true,
				defaultCompress	: true
			}
		}
	}
	// 缓存全局库
	root.$ = window.$;
	// 读取全局配置信息
	db.data.find({name: app.config.name}, function(e, docs){
		if(e) return tips.show('数据库链接失败');
		docs.length > 0 ?
			app.config = docs[0] : "";
	});


	// 定义首页id，默认为home
	pm.homePage = 'project';
	// 初始化首页
	pm.init();

	// 定义拖拽
	drag(window, function(e){
		pm.page.drag(e.dataTransfer.files, e.target, e)
	});

	// 监听项目资源，并根据规则自动渲染
	// reload(path.join(app.dir, '/src/views/index.html'));
	// 模拟滚动条测试
	// scroll('#mainInner');


	// for nav
	$('#nav').delegate('.item',  'click', function(){
		var hash = this.getAttribute('hash');
		if(hash){
			location.hash = hash;
			$(this).addClass('selected').siblings('.selected').removeClass('selected');
		}
	})

};

module.exports = init;
