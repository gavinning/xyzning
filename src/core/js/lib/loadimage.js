'use strict';

// 读取图片

var lib = require('linco.lab').lib;

function LoadImage(src, num){
	var file = lib.dir(src, [], new RegExp('\.jpg|\.png', 'g')).file;
	var imgs;
	var last;
	var count = 0;

	function more(){
		return imgs = file.slice(num*count, num*++count);
	}

	return {more: more}
}


module.exports = LoadImage;



// var loadImage = new LoadImage('/Users/iLinco/Pictures/rosi', 10);

// console.log(loadImage.more())
// console.log(loadImage.more())
// console.log(loadImage.more())