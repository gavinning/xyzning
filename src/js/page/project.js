'use strict';

// 页面实例
var path = require('path');
var watch = require('linco.lab').watch;
var lib = require('linco.lab').lib;
var db = require('../lib/db');
var less2css = require('../lib/less2css');
var upload = require('../lib/upload');
var Page = require('../lib/page');
var page = new Page;

page.extend({
	// 页面id，唯一，关系页面逻辑
	id: "project",
	// 虚拟页DOM id，唯一，关系页面逻辑
	pageId: "#vpProject",

	init: function(){
		// 初始化页面
		console.log('init ' + this.id);

		// 注册live方法
		this.live = new lib.parent();

		// 进入页面
		this.enter();

		// 读取缓存数据
		// 渲染aside列表
		// 重建asideHash
		// 创建监听
		this.getCache();

		// 绑定事件
		this.bind();
	},

	enter: function(){
		// 渲染页面
		this.render();
		this.log();
	},

	// 页面内方法绑定
	bind: function(){
		var _this = this;
		var live = this.live;

		// 文件夹列表操作
		this.page.find('.list-folder').delegate('li', 'click', function(){
			var files = [];
			var cssArr = [];
			var folderPath = this.getAttribute('path');

			// 不处理已被选中的文件夹
			if($(this).hasClass('selected')) return;

			// 状态切换
			$(this).addClass('selected').siblings('.selected').removeClass('selected');

			// 渲染文件夹列表
			_this.live.renderFolder(folderPath);

			// 读取配置项
		});

		// 删除项目
		this.page.find('.list-folder').delegate('.idel', 'click', function(e){
			e.preventDefault();
			e.stopPropagation()
			e.target.parentNode.remove();
			live.delProject(e.target.parentNode.getAttribute('path'));
		});

		live.extend({
			init: function() {
				
			},

			// 渲染文件夹文件列表
			renderFolder: function(src){
				var files, cssArr = [];

				if(!lib.isDir(src)) return;

				// 遍历文件夹
				files = lib.dir(src).files;
				files.forEach(function(item){
					if(item.match(/less$/g)){
						cssArr.push(item)
					}
				});

				_this.page.find('.list-file ul').html(this.list(cssArr));
			},

			// 创建li列表
			list: function(arr){
				var ul = $(window.document.createElement('ul'));
				arr.forEach(function(item){
					var li = '<li><strong>'+path.basename(item)+'</strong><i>'+item+'</i></li>';
					ul.append(li);
				});
				return ul.html();
			},

			// 渲染侧栏项目列表
			renderAside: function(obj){
				var ul = _this.page.find('.list-folder ul');

				// 添加文件夹方法
				function add(file){
					ul.append('<li path="'+file.path+'">'+file.name+'<i class="idel"></i></li>')
				}

				// 监听drag事件
				lib.each(obj.aside, function(key, value){
					// 反格式化路径
					key = live.unformatURL(key);
					if(value && lib.isDir(key)){
						add(value);
					}
				})
			},

			// 删除项目
			delProject: function(src){
				page.setCache(src, true)
			},

			// 格式化项目url，用于转移带.路径，便于nedb存储
			formatURL: function(src){
				return src.replace(/\./g, '_LINCO_')
			},

			// 反格式化项目url
			unformatURL: function(src){
				return src.replace(new RegExp('_LINCO_', 'g'), '\.')
			}
		});
	},

	// 创建asideHash，用于过滤重复的项目
	buildAsideHash: function(obj){
		page.asideHash = page.asideHash || {};
		lib.each(obj.aside, function(key, value){
			// 反格式化url
			key = page.live.unformatURL(key)
			if(value)
				page.asideHash[key] = true;
		})
	},

	// 缓存数据
	setCache: function(src, del){
		var cache, tmp, _src;

		// 缓存数据模型
		cache = {
			type: "page",
			name: "project",
			aside: {
				// @path: {
				// 	@name: string,
				// 	@path: string:url,
				// 	@isHome: true,
				// 	@isCompress: true
				// }
			}
		};

		// 更新aside节点对象
		tmp = {
			// 设置项目名称
			name: path.basename(src),
			// 设置项目路径
			path: src//,
			// isHome: $('#isHome').prop('checked'),
			// isCompress: $('#isCompress').prop('checked')
		};

		// 更新数据
		if(page._cache){
			// 删除项目存储
			if(del) tmp = null;
			// 格式化项目路径
			_src = page.live.formatURL(src);
			// 设置项目缓存
			page._cache.aside[_src] = tmp;
			// 项目写入数据库
			db.data.update({name: "project"}, page._cache, function(e, num){
				if(e) return app.doc.trigger('log', ['数据库写入失败：' + e.message, true])

				if(del){
					// 广播日志
					app.doc.trigger('log', ['del: ' + src])
					// 删除项目列表hash
					page.asideHash[src] = false;
				}else{
					// 广播日志
					app.doc.trigger('log', ['add: ' + src])
				}
			})

		// 插入新纪录
		}else{
			_src = page.live.formatURL(src);
			cache.aside[_src] = tmp;
			db.data.insert(cache, function(e, doc){
				if(e) return app.doc.trigger('log', ['数据库写入失败：' + e.message, true])
				page._cache = doc;
				app.doc.trigger('log', ['add: ' + src])
			})
		}
	},

	// 获取缓存数据
	getCache: function(obj){
		obj = obj || {name: this.id};

		// 加载数据
		db.data.find(obj, function(e, docs){
			if(docs.length==0) return;

			// 缓存页面data对象
			page._cache = docs[0];

			// 渲染页面aside列表
			page.live.renderAside(page._cache);

			// 重建page.asideHash
			page.buildAsideHash(page._cache);

			// 创建监听
			page.watch(page._cache);
		});

		return;
	},

	// 创建项目监听
	watch: function(obj){
		var arr;

		// 检查数据库对象
		if(obj._id){
			arr = [];
			lib.each(obj.aside, function(key, value){
				if(value)
					arr.push(value.path);
			})
			// 启动监听
			return this.watch(arr);
		}

		// 包装字符串路径，启动监听
		if(lib.isString(obj)){
			return this.watch([obj])
		}

		// 检查是否为路径数组
		if(lib.isArray(obj)){

			// 启动监听
			watch(obj, function(filename){
				var config = app.config.config;
				var lessConfig = {};
				var isLess = !!filename.match(/\.less$/);

				// 编译less文件
				if(isLess){
					// for less config
					lessConfig.defaultHome = config.defaultHome;
					lessConfig.defaultCompress = config.defaultCompress;
					config.defaultHome ?
						lessConfig.isHome = 'home.less': lessConfig.isHome = false;

					// compile
					less2css(filename, lessConfig, function(e, source, target){
						if(e){
							page._lastLog = makeMessage(e);
							page._lastLogError = true;
						}else{
							page._lastLog = makeMessage([source, target])
							page._lastLogError = false;
						}
						
						app.doc.trigger('log', [page._lastLog, page._lastLogError])
					});
				}

				// 上传文件
				// 检测服务器功能是否开启
				if(!config.serverEnable){
					return; //page.tips('尚未开启服务器功能，请在设置页进行配置')
				}
				// 检测服务器配置信息是否完整
				if( config.serverApi && config.serverPath && config.localPath && config.key ){
					return upload(filename, config);
				}else{
					return page.tips('尚未完成上传参数配置，请在设置页进行配置')
				}


				// 打包less编译日志信息
				function makeMessage(msg){
					// 打包错误日志
					if(msg.message){
						return [msg.message, 'line '+msg.line].join(', ') + msg.extract.join(' ');
					}
					// 打包正确编译日志
					if(msg.length == 2){
						return 'compile: '+msg[0]+' => '+path.basename(msg[1]) + ' done.'
					}
				}
			});
		}

	},

	// 页面拖拽回调
	// 也可以完整自定义drag方法
	dragCallback: function(filelist){
		lib.each(filelist, function(i, item){
			var src = page.live.formatURL(item.path);

			// 过滤已存在的项目
			if(page._cache.aside[src]) return app.doc.trigger('log', ['已存在: '  + item.path + ' 无需重复添加']);

			// 更新数据缓存
			page.setCache(item.path);
			// 增加监听
			page.watch([item.path]);

		})
	},

	cache: {}


});

page.reg();

module.exports = page;