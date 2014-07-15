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
	
	// 检测nodejs环境
	if(!root || root.root !== root){
		return console.log(root + ' is not nodejs root');
	}

	// 缓存app信息
	root.app = {
		dir: process.cwd(),
		tmp: window.gui.App.dataPath
	}
	// 缓存全局库
	root.$ = window.$;


	// 定义首页id，默认为home
	pm.homePage = 'project';
	// 初始化首页
	pm.init();

	// 定义拖拽
	drag(window, function(e){
		pm.page.drag(e.dataTransfer.files, e.target, e)
	});

	// 监听项目资源，并根据规则自动渲染
	reload(path.join(rootPath, '/core/index.html'));
	// 模拟滚动条测试
	// scroll('#mainInner');


	// for nav
	$('#nav').delegate('.item',  'click', function(){
		$(this).addClass('selected').siblings('.selected').removeClass('selected')
	})
};

module.exports = init;
