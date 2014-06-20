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


	$.fn.setScroll = function(){
		var _this = $(this);
		var that = _this.get(0);
		var scroll = {};

		_this.append($('<div class="iscroll"></div>'));

		scroll.base = 1 + _this.height() / that.scrollHeight;
		scroll.height = _this.height() * _this.height() / that.scrollHeight;

		_this.find('.iscroll').height(scroll.height + 'px');

		that.onscroll = function(){
			_this.find('.iscroll').css('top', that.scrollTop*scroll.base)
		}
	}


	$('#asideInner').setScroll();


	// base.page.init();
})();


var _aside = $('#asideInner');
var aside = _aside.get(0)