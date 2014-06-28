'use strict';

// 读取图片

var lib = require('linco.lab').lib;

function LoadImage(src, num){
	// var file = lib.dir(src, [], new RegExp('\.jpg|\.png', 'g')).file;
	var file = lib.dir(src, [], new RegExp('123.jpg', 'g')).file;
	var imgs;
	var last;
	var count = 0;

	console.log('读取图片数量: ' + file.length)

	function more(){
		return imgs = file.slice(num*count, num*++count);
	}

	return {more: more}
}


module.exports = LoadImage;
