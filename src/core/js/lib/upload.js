// by gavinning
// upload server 

var fs = require('fs');
var path = require('path');
var lib = require('linco.lib/lib');
var request = require('request');

// @url: 服务器地址
// @file: 本地文件路径
// @src: 写入远程文件路径
// @key: 密匙
function post(url, file, src, key){
	if(lib.isDir(file)) return;

	var opt, req, from;
	
	opt = {
		url: url,
		method: 'POST',
		auth: {
			'user': 'gavinning',
			'password': key
		},
		headers: {
			src: src
		}
	};

	req = request(opt, function(e, res, body){
		e ?
			console.log(e.message):
			console.log('已写入：' + body);
	});

	form = req.form();
	form.append('file', fs.readFileSync(file).toString('base64'));
}


function upload(file, config){
	var index, src;

	// 内部版，为了服务器安全需写入目录限制
	if(config.serverApi.indexOf('gavinning') >= 0 && !config.serverPath.match(/\/resin_\w+\/webapps/)){
		return console.log('服务器目录设置不符合内部版规范，请联系gavinning')
	}

	// 监听文件路径规范
	index = file.indexOf(config.localPath);

	// 忽略路径不符合服务器配置的文件
	if(index !== 0){
		return console.log(file + ': 不符合服务器路径配置');
	}

	// 获取写入服务器的路径
	src = path.join(config.serverPath, file.replace(config.localPath, ''));

	// 替换window路径
	if(src.match(/\\\\/g) || src.match(/\\/g)){
		src = src.replace(/\\/g, '/');
	}

	// 开始上传
	post(config.serverApi, file, src, config.key);
}

module.exports = upload;





