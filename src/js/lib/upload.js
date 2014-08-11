// by gavinning
// upload server 

var fs = require('fs');
var path = require('path');
var http = require('http');
var lib = require('linco.lab').lib;
var config = {}

function updateConfig(){
	config.username = app.config.config.username;
	config.password = app.config.config.password;
	config.api = app.config.config.serverApi;
	config.workplace = [];

	app.config.config.workplace.forEach(function(item){
		if(item.server && item.local){
			config.workplace.push(item)
		}
	})
}

// 检查工作目录
function isWorkplace(src){
	return config.workplace.some(function(item){
		return !!src.match(item.local)
	})
}

// 获取工作路径
function getPath(src){
	var i = 0, arr = config.workplace, len = arr.length;

	for(; i<len; i++){
		if(src.match(arr[i].local)){
			return arr[i]
		}
	}
}

// 处理文件
function handleFile(src){
	var filepath, relative, pathArr;

	pathArr = getPath(src);

	/*
	 * src: 本地文件路径
	 * relative: src与本地工作目录local的相对路径
	 * filepath: 依据server和relative生成的服务器文件路径
	 *
	 */

	// 获取相对路径
	relative = path.relative(pathArr.local, src);
	// 转换window平台路径
	relative = relative.replace(/\\/g,'/');
	// 计算服务器文件路径
	filepath = path.join(pathArr.server, relative);

	// console.log(relative)
	// console.log(src)
	// console.log(filepath)

	post(config.api, src, filepath, function(e){
		// 接入app日志模块
		if(e){
			app.log([e.message, true])
			console.log(e)
		}else{
			app.log(['已写入：' + filepath])
			console.log('已写入：' + filepath);
		}
	})
}

// 对外接口
function upload(file){
	updateConfig();

	// 检查file路径合法性
	if(!lib.isDir(file) && !lib.isFile(file)){
		return console.log('Error: Illegal Path')
	}

	// 检查工作目录
	if(!isWorkplace(file)){
		return console.log('Error: The folder is not workplace');
	}

	handleFile(file)
}

// 上传文件
function post(url, file, filepath, callback){
	var opt, req, input;

	opt = require('url').parse(url);
	opt.method = 'POST';

	opt.headers = {
		username: config.username,
		password: config.password,
		filepath: filepath
	}

	req = http.request(opt, function(res){

		res.on('data', function(){
			// console.log('upload...')
		})

		res.on('end', function(){
			// console.log('res.end', new Date().getTime())

			if(res.statusCode == 201 || res.statusCode == 200){
				return callback(null, res.headers.msg);
			}

			if(res.statusCode == 501){
				return callback({message: '登录失败，请检查用户名和密码'})
			}

			if(res.statusCode == 502){
				return callback({message: '文件路径溢出，非工作目录，请检查'})
			}

			console.log(res.headers)

			return callback({message: '超时: 服务器连接失败，请重试'})
		})
	});

	input = fs.createReadStream(file);
	input.pipe(req);
}


module.exports = upload;





