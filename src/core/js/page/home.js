(function(){
	var rootPath = process.cwd();
	var path = require('path');
	var reload = require(path.join(rootPath, '/core/js/lib/reload'));
	var body, page, header, content, footer, aside, nav, main, base;

	var os  = require('os');

	base = {};

	base.page = {

		init: function(){
		}
	}

	// console.log($.jQuery)


	reload(path.join(rootPath, '/core/index.html'));


	// base.page.init();
})();