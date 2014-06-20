'use strict';

(function(){
	var rootPath = process.cwd();
	var path = require('path');
	// var gui = require('nw.gui');
	// var win = gui.Window.get();

	var reload = require(path.join(rootPath, '/core/js/lib/reload'));
	var body, page, header, content, footer, aside, nav, main, base;

	var os  = require('os');

	// global.win = win;
	base = {};

	base.page = {

		init: function(){
		}
	}

	reload(path.join(rootPath, '/core/index.html'));


	// base.page.init();
})();