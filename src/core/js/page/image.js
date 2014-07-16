'use strict';

// 页面实例

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var lib = require('linco.lab').lib;
var loadImage, LoadImage = require('../lib/loadimage');
var Page = require('../lib/page');
var page = new Page;

var dragTargetFolder = "/Volumes/macdata/cate";


var selectImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAe1BMVEUAAAD///////////////////////////////////////////////////////////////8blfv///+23f5jt/whmPsdlvvK5/5Hqvyu2f4qnPs6pPyj1f2Cxf1bs/z0+v/////j8v9tvPxVsPyTzf13wf3T6v7a7v7r9v8SOWehAAAAEXRSTlMAT2fmjwUnF3TWWJTZvL27CNRr2pIAAAHTSURBVEjHpVZpk4IwDO0qyOGxwysUKIfj7f//hSsFCaVQ1vF9cBhJSPJempQZ8EJnv8YL670TemwBnh9AQ+B7NnMHL/CqLmSSyKKuOF7Yzrm4fmMdi2gAETc+vjtlvwkAnkUGshzYbUz7HyCNo0nEKfAztl8BeRLNQOTAyrAvIwvKtwflc46sOGtZbej7thh95e4OebSIHLs3uz5SsewgUvidvgDxOcNr3fwCrebbpYQy4NEmte0CZFb74glUnaOnKuBWe/noOeSqigDxQq1Ik64WBCojscD/Q76dm5xCe0YV8CwGWoTMQWUjFMBl6O6wPWoLoUe9yWr8sjVURFHLCUJPwFX7A2sGKMuyp4KQ3DHSVAIMUI8pDL0Fh/GV3oHkJFyBkxzFVA6yr09T8AYcs7HqgCpaIdYNLkSoXjTRWgGnon91BG5kSbQOhcuBe9LFHhFKwg1bI0kBLgZPBGoNaj76LsUiUPNp7Z21mV+7agjU3nSAiJuzSSgdIDqixD4pYpxtzxwCJUCaE2gIjMeM4DNjkMYM87Uek3x6jCf9IGNu8L9RGbifDuNPx/0XC+XDlUVLcWZ+1LQUx2s3X1i7Xy325avD95cTuv4c2uvPYer68webMIGKNytpEAAAAABJRU5ErkJggg==';

page.extend({
	// 页面名称，不关系页面业务逻辑
	name: "image page",
	// 页面id，唯一，关系页面逻辑
	id: "image",
	// 虚拟页DOM id，唯一，关系页面逻辑
	pageId: "#vpImage",

	init: function(){
		console.log('init ' + this.id);

		// 注册live方法
		this.live = new lib.parent();

		// 进入页面
		this.enter();
	},

	enter: function(){
		var _this = this;
		var doc = window.document;
		var live = this.live;

		// 渲染页面
		this.render();

		live.extend({
			init: function(){
				var listImage = _this.page.find('.list-images');
				var listFolder = _this.page.find('.list-folder');

				// 监听图片click事件
				listImage.delegate('li', 'click', function(){
					var li = $(this);

					if(li.hasClass('current')){
						li.removeClass('current');
						// li.find('.iselected').remove();
					}else{
						li.addClass('current').siblings('.current').removeClass('current');
						li.find('.iselected').length == 0 ?
							li.append('<img class="iselected" src="'+selectImg+'">'):"";
					}

				})

				// 监听图片dblclick事件
				listImage.delegate('li', 'dblclick', function(){
					var li = $(this);
					var src = li.attr('path');
					// console.log(e)
					_this.shell.folder(path.dirname(src))
				})

				// 加载图片
				listFolder.delegate('li', 'click', function(){
					var li = $(this);
					var source = li.attr('path');

					if(li.hasClass('selected')){
						return;
					}else{
						li.addClass('selected').siblings('.selected').removeClass('selected');
						live.renderImage(source)
					}

					// 底部状态栏显示文件夹源路径
					live.setTips(['Source: ' + source, null, null]);

				});

				// 预览图片
				doc.onkeypress = function(e){
					var li, src;

					// 监听空格键
					if(e.keyCode == 32){
						// 判断是否有图片被选中
						li = listImage.find('li.current');

						if(li.length == 1){
							src = li.attr('path');
							_this.shell.file(src)
						}
						// 阻止空格默认事件
						return false;
					}
				}

				// 初始化图集拖拽
				live.dragListFolder();
			},

			// 渲染图集列表
			renderImage: function(source){
				var getMoreImage = _this.page.find('#getMoreImage');
				var ulImage = _this.page.find('.list-images').find('ul');
				var imgCount = 50;

				loadImage = new LoadImage(source, imgCount, [], new RegExp('123.jpg', 'g')); //

				// reset list-image
				ulImage.html('');

				getMoreImage.click(function(){
					live.renderMoreImage(imgCount);
				})

				live.renderMoreImage(imgCount);
			},

			// 加载更多图片
			renderMoreImage: function(imgCount){
				var imgs = loadImage.more();
				var Image = window.Image;
				var getMoreImage = _this.page.find('#getMoreImage');

				if(imgs.length > 0){

					imgs.forEach(function(item){
						var img = new Image();
						img.src = item;
						img.onload = function(){
							live.addImage({path: item})
						}
					})
				}

				if(imgs.length == imgCount){
					getMoreImage.show();
				}

				if(imgs.length < imgCount){
					getMoreImage.hide();
				}
			},

			// 渲染拖动目的地列表
			renderList: function(dir){
				var listImage = _this.page.find('.list-images');
				var ulImage = listImage.find('ul');
				var imageListDrag = _this.page.find('#imageListDrag');
				var ul = imageListDrag.find('ul');

				ul.html('');

				fs.readdir(dir, function(e, arr){
					if(e) return console.log(e, e.message)
					arr.forEach(function(item){
						var src = path.join(dir, item)
						if(lib.isDir(src)){
							ul.append('<li path="'+src+'">'+item+'</li>')
						}
					})
				});

				// 显示目标文件夹路径
				live.setTips([null, 'Target: ' + dir, null]);
			},

			// 加载图片方法
			addImage: function(file){
				var src = file.path;
				var ulImage = _this.page.find('.list-images').find('ul');

				ulImage.append('<li draggable="true" path="'+src+'" style="background-image: url(\''+file.path+'\')"></li>')
			},

			// 初始化图集拖拽
			dragListFolder: function(){
				var imageListDrag = _this.page.find('#imageListDrag');
				var ul = imageListDrag.find('ul');
				var folder = [];
				var draged, target, src, dirpath, dirname;

				var listImage = _this.page.find('.list-images');
				var ulImage = listImage.find('ul');

				// fs.readdir(dragTargetFolder, function(e, arr){
				// 	if(e) return console.log(e, e.message)
				// 	arr.forEach(function(item){
				// 		var src = path.join(dragTargetFolder, item)
				// 		if(lib.isDir(src)){
				// 			ul.append('<li path="'+src+'">'+item+'</li>')
				// 		}
				// 	})
				// });

				if(!lib.isDir(dragTargetFolder)) return;

				live.renderList(dragTargetFolder);

				// 监听拖拽事件
				ulImage.get(0).addEventListener('dragstart', function(e){
					// e.stopPropagation();
					// e.preventDefault();
					// console.log(e.target)
					draged = e.target;
				}, false)

				ul.get(0).addEventListener('dragover', function(e){
					e.stopPropagation();
					e.preventDefault();
					$(e.target).removeClass('droped').addClass('dragover');
				}, false)

				ul.get(0).addEventListener('dragleave', function(e){
					e.stopPropagation();
					e.preventDefault();
					$(e.target).removeClass('dragover');
				}, false)

				ul.get(0).addEventListener('drop', function(e){
					e.stopPropagation();
					e.preventDefault();
					$(e.target).addClass('droped').removeClass('dragover');

					console.log(draged, e.dataTransfer.files)

					// 拖拽分类图集
					if(draged && draged.tagName == 'LI'){

						// 图片真实路径
						src = $(draged).attr('path');
						// 图片文件夹路径
						dirpath = path.dirname(src);
						// 图片文件夹名称
						dirname = path.basename(dirpath);
						target = $(e.target).attr('path');
						target = path.join(target, dirname);

						// console.log(src)
						// console.log(dirpath)
						// console.log(dirname)
						// console.log(target)

						// 显示最终目标文件夹路径
						live.setTips([null, null, 'MV: ' + target])

						live.moveFolder(dirpath, target, draged);
					}

					// 重置拖拽目的地文件夹
					if(e.dataTransfer.files.length > 0){
						live.renderList(e.dataTransfer.files[0].path)
					}


				}, false)
			},

			moveFolder: function(source, target, el){
				el.remove();
				exec('mv ' + source + ' ' + target, function(){
					console.log(arguments)
				});
			},

			setTips: function(args){
				var tips1 = $('#tips1');
				var tips2 = $('#tips2');
				var tips3 = $('#tips3');

				// console.log(args)

				args[0] ? tips1.html(args[0]) : "";
				args[1] ? tips2.html(args[1]) : "";
				args[2] ? tips3.html(args[2]) : "";
			}

		});

		// 执行页面逻辑
		live.init();
	}

});

page.reg();

module.exports = page;