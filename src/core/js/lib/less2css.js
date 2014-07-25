// by gavining
// compile less 

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var less = require('less')


less.renderFile = function(file, compress, callback){
	var parser = new(less.Parser)({
		paths: [path.dirname(file), './lib'] // 指定@import搜索的目录
	});

	// parser.parse('.class { width: (1 + 1) }', function (e, tree) {
	// 	tree.toCSS({
	// 		// 压缩输出的CSS
	// 		compress: compress
	// 	});
	// });


	// 读less
	fs.readFile(file, 'utf-8', function(e, data){
		if(e) return console.log(e);
		// 编译
		// less.render(data, function(e, css){
		// 	if(e) return console.log(e);

		// 	fs.writeFile(file.replace('.less', '.css'), css, 'utf-8', function(e){
		// 		if(e) return console.log(e);

		// 		callback(e)
		// 	})
		// })

		parser.parse(data, function (e, tree) {
			if(e) return console.log(e)
			var css = tree.toCSS({
				// 压缩输出的CSS
				compress: compress
			});
		
			fs.writeFile(file.replace('.less', '.css'), css, 'utf-8', function(e){
				if(e) return console.log(e);

				callback(e)
			})

		});
	})
}


function less2css(file, config){
	var home;
	var compress = ' ';

	config.defaultCompress ? compress = ' -x ' : compress = ' ';

	// 如果未启用isHome模式，直接编译
	if(!config.isHome){
		// return exec(cmd, function(e){
		// 	if(e) return console.log(e.message);
		// 	console.log(file + ' => ' + path.basename(file).replace('.less', '.css') + ' done.')
		// });

		less.renderFile(file, config.defaultCompress, function(e){
			if(e) return console.log(e)
			console.log('compile: ' + file + ' => ' + path.basename(file).replace('.less', '.css') + ' done.')
		})
	}

	// 如果已启用isHome模式，并文件为HOME文件，直接编译
	if(config.isHome == path.basename(file)){
		less.renderFile(file, config.defaultCompress, function(e){
			if(e) return console.log(e)
			console.log('compile: ' + file + ' => ' + path.basename(file).replace('.less', '.css') + ' done.')
		})
	}

	// 搜索HOME文件
	home = soHome(file, config);

	// 如果没搜索到返回日志
	if(!home){
		return console.log('Can\'t find ' + config.isHome);
	}
	
	less.renderFile(home, config.defaultCompress, function(e){
		if(e) return console.log(e)
		console.log('compile: ' + home + ' => ' + path.basename(home).replace('.less', '.css') + ' done.')
	})
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