'use strict';

// 读取图片

var lib = require('linco.lab').lib;

function LoadImage(src, num, filter, reg){
	// var file = lib.dir(src, [], new RegExp('\.jpg|\.png', 'g')).file;
	var filter = filter || [];
	var reg = reg || new RegExp('\.jpg|\.png', 'g');
	var file = lib.dir(src, filter, reg).file;
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
