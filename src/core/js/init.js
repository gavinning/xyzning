'use strict';

// 初始化首页

function init(){
	var fs = require('fs');
	var path = require('path');
	var lib = require('linco.lab').lib;

	var reload = require('./lib/reload');
	var scroll = require('./lib/scroll');
	var drag = require('./lib/drag');
	var pm = require('./lib/pm');

	var rootPath = process.cwd();
	
	var location = window.location;
	var home = {};
	// 全局接口
	window.home = home;

	// 拖拽接口
	home.dragHash = {};
	home.drag = function(id, callback){
		return this.dragHash[id] = callback;
	}


	// 定义首页id，默认为home
	pm.homePage = 'image';
	// 初始化首页
	pm.init();

	// 定义拖拽
	drag(window, function(e){
		// console.log(e.dataTransfer.files)

		lib.each(home.dragHash, function(key, value){
			if(pm.page.id == key){
				value(e);
			}
		})
	});

	// 监听项目资源，并根据规则自动渲染
	reload(path.join(rootPath, '/core/index.html'));
	// 模拟滚动条测试
	// scroll('#mainInner');

	window.onhashchange = function(){
		console.log('hash change from init.js line52')
		pm.hashChange(location.hash.slice(1));
	}

};

module.exports = init;
