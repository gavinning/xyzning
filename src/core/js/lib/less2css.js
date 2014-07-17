// by gavining
// compile less 

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

function less2css(file, config){
	var home;
	var compress;

	config.defaultCompress ? compress = ' -x ' : compress = ' ';

	// 如果未启用isHome模式，直接编译
	if(!config.isHome){
		return exec('lessc' + compress + file + ' ' + file.replace('.less', '.css'), function(e){
			if(e) return console.log(e.message);
			console.log(file + ' => ' + path.basename(file).replace('.less', '.css') + ' done.')
		});
	}

	// 如果已启用isHome模式，并文件为HOME文件，直接编译
	if(config.isHome == path.basename(file)){
		return exec('lessc' + compress + file + ' ' + file.replace('.less', '.css'), function(e){
			if(e) return console.log(e.message);
			console.log(file + ' => ' + path.basename(file).replace('.less', '.css') + ' done.')
		});
	}

	// 搜索HOME文件
	home = soHome(file, config);

	// 如果没搜索到返回日志
	if(!home){
		return console.log('Can\'t find ' + config.isHome);
	}
	
	// 编译父级HOME文件
	exec('lessc' + compress + home + ' ' + home.replace('.less', '.css'), function(e){
		if(e) return console.log(e.message);
		console.log(home + ' => ' + home.replace('.less', '.css') + ' done.')
	});
}

function soHome(file, config){
	var dir = path.dirname(file);
	var parentFolder = path.basename(dir);
	var home = path.join(dir, config.isHome);

	// 如果当前目录存在指定文件 则返回
	if(fs.existsSync(home)) return home;

	// 如果当前目录不存在指定文件，向父级查找，直至查找到根目录
	while(!fs.existsSync(home) && parentFolder !== 'css'){
		dir = path.dirname(dir);
		parentFolder = path.basename(dir);
		home = path.join(dir, config.isHome);

		// 到根目录则停止循环，返回false
		if(dir == '/'){
			home = false;
			break;
		}
	}

	return home;
}


module.exports = less2css;