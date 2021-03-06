'use strict';

// 初始化首页
function init(){
	var fs = require('fs');
	var path = require('path');
	var lib = require('linco.lab').lib;

	var tips = require('./lib/tips');
	var db = require('./lib/db');
	var scroll = require('./lib/scroll');
	var drag = require('./lib/drag');
	var pm = require('./lib/pm');
	var location = window.location;
	
	// 检测nodejs环境
	try{
		if(root.process.title !== 'node'){
			return console.log(root + ' is not nodejs root');
		}
	}catch(e){
		return console.log(e)
	}

	// 缓存app信息
	root.app = {
		dev: true,
		// 注册app根目录
		dir: process.cwd(),
		// 注册app数据缓存目录
		tmp: window.gui.App.dataPath,
		// 注册logDOM
		logDom: window.$('#log'),
		// 存放日志的数组
		logArr: [],
		// 注册lib方便测试调用
		// 正式使用推荐直接require
		lib: lib,
		// 注册cache对象
		cache: {},

		doc: window.$(window.document),

		// 注册默认配置信息
		config: {
			type: "page",
			name: "config",
			isConfig: true,
			config: {
				// for server
				serverEnable	: false,
				serverApi		: '',
				username		: '',
				password		: '',
				workplace		: [{server: '', local:''}],

				// for less
				lessEnable		: false,
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

	// for log
	app.doc.on('log', function(e, msg, error){
		// 包装时间戳
		msg = '['+lib.now()+'] ' + msg;

		// 缓存日志
		app.logArr.push({data: msg, error: error})
		// 展示页面日志
		pm.page.log(msg, error)
		// 设置页面最后日志信息，用于页面切换
		pm.page._lastLog = msg;
		pm.page._lastLogError = error;
	})

	app.log = function(arr){
		return app.doc.trigger('log', arr);
	}

};

module.exports = init;
