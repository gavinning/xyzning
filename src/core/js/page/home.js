'use strict';

// 初始化首页

(function(){
	var fs = require('fs');
	var path = require('path');

	var rootPath = process.cwd();
	var libPath = path.join(rootPath, '/core/js/lib');
	var reload = require(path.resolve('./core/js/lib/reload'));
	var scroll = require(path.resolve('./core/js/lib/scroll'));
	var pm = require(path.resolve('./core/js/lib/pm'));
	var drag = require(path.resolve('./core/js/lib/drag'));


	drag(window, function(){
		alert(1)
	})



	// console.log(pm.version)


	pm.show('less');

	console.log(pm.page)



	// 监听项目资源，并根据规则自动渲染
	reload(path.join(rootPath, '/core/index.html'));
	// 模拟滚动条测试
	scroll('#asideInner');

})();


var _aside = $('#asideInner');
var aside = _aside.get(0)