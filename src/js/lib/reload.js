'use strict';

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var lib = require('linco.lab').lib;
var $ = window.$;

// 需要监听的dom对象集合
var watchElements = [];
// 重新渲染方法对象
var render = {};
// 过滤同一文件重复提交事件
var prevtime = new Date().getTime();
var prevFilename = '';

var render = {
	// 自动编译less
	less: function(source){
		var url = path.join(app.dir, '/src/css/home.less');
		console.log(url)
		console.log('compile home.less');
		return exec('lessc ' + url + ' ' + url.replace('less', 'css') + ' -x', function(){
			console.log(arguments)
		});
	},
	// 重新渲染css
	css: function(source){
		return this.reload();
		// return this.update(source);
	},
	// 重新渲染js
	js: function(source, files){
		return $.inArray(source, files) !== -1 ?
			this.reload() : null;
	},
	html: function(){
		this.reload();
	},
	// 重新渲染dom媒体对象
	update: function(source){
		var el, url, attr, extname;

		extname = path.extname(source);

		switch(extname){
			case '.css':
				attr = 'href';
				break;

			case '.png':
				attr = 'src';
				break;

			case '.jpg':
				attr = 'src';
				break;

			case '.gif':
				attr = 'src';
				break;
		}

		// 遍历监听对象，查找当前修改对象，并重新渲染
		watchElements.each(function(i, item){
			url = item[attr];
			if(url && path.basename(url).split('?')[0] == source){
				item[attr] = url.split('?')[0] + '?t=' + Math.random();
				console.log('render ' + source)
			}
		})


	},
	// 重新渲染app
	reload: function(){
		// window.location.reload();
		window.gui.Window.get().reloadDev();
	}
}

function reload(source){
	var style = $('link[rel="stylesheet');
	var js = $('script[src]');
	var file = stat(source);
	var files = [];

	watchElements = $.merge(style,js);

	watchElements.each(function(i, item){
		files.push(item.src ? path.basename(item.src) : path.basename(item.href))
	});

	watch(file, files);
}

function watch(file, files){
	var folder = lib.dir(path.dirname(file.dirname)).folders;
	folder.push(path.dirname(file.dirname));

	folder.forEach(function(item){

		fs.watch(item, function(event, filename){
			var filetype = path.extname(filename);
			var now = new Date().getTime();

			// 过滤同一文件重复提交事件
			if(prevFilename == filename && now - prevtime < 600){
				return;
			}
			prevFilename = filename;
			prevtime = now;

			// handle main html reload
			if(filename == file.name){
				render.html();
			}

			// render media
			switch(filetype){
				case '.less':
					render.less(filename, files);
					break;

				case '.css':
					render.css(filename, files);
					break;

				case '.js':
					render.js(filename, files);
			}
		});
	})

}

function stat(source){
	var file = {};
	file.stat = fs.statSync(source);
	file.prevtime = file.stat.mtime.getTime();
	file.dirname = path.dirname(source);
	file.name = path.basename(source);
	return file;
}















module.exports = reload;