'use strict';

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var lib = require('linco.lib/lib');

var render = {};
var prevtime = new Date().getTime();
var prevFilename = '';


var render = {
	less: function(source){
		console.log(source, 111)
		// exec('lessc ' + source + ' ' + source.replace('less', 'css') + ' -x');
	},
	css: function(source){
		console.log(source, 333)
	},
	js: function(source){
		console.log(source, 222)
	},
	html: function(source){
		console.log(source)
	}
}

function reload(source){
	var $ = window.$;
	var style = $('link[rel="stylesheet');
	var js = $('script[src]');
	var file = stat(source);
	var files = [];

	$.merge(style,js).each(function(i, item){
		files.push(item.src ? path.basename(item.src) : path.basename(item.href))
	});

	// fs.watch(file.dirname, function(event, filename){
	// 	if(filename == file.name){
	// 		console.log('isModify');
	// 		window.location.reload();
	// 	}
	// });

	watch(file, files);
}

function watch(file, files){
	var folder = lib.dir(file.dirname).folder;
	folder.push(file.dirname);

	folder.forEach(function(item){

		fs.watch(item, function(event, filename){
			var filetype = path.extname(filename);

			if(filename == file.name){
				render.html(filename, file.name);
			}

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

function render(source, target){
	var filetype = path.extname(source);



	if(filetype == '.less'){
		console.log(source + ' is Modify')
	}

	if(filetype == '.css'){
		console.log(target + ' is Modify')
	}
}



function isRepeat(){

}
















module.exports = reload;