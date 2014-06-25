'use strict';

// 页面实例

var path = require('path');
var lib = require('linco.lab').lib;
var Page = require('../lib/page');

var home = window.home;
var $ = window.$;

var page = new Page;

page.extend({
	name: "less page",
	id: "less",

	init: function(){
		console.log('init ' + this.id)
	},

	enter: function(){
		var aside, lessFolder, ul;

		// 载入页面
		console.log('enter ' + this.id);

		// 渲染页面
		this.render('asideInner', this.dom.aside, this.data.aside);

		aside = $('#asideInner');
		lessFolder = $('#lessFolder');
		ul = lessFolder.find('ul');

		function add(file){
			ul.append('<li path="'+file.path+'">'+file.name+'</li>')
		}

		// 监听drag事件
		home.drag(this.id, function(e){
			var files = e.dataTransfer.files;

			lib.each(files, function(i, item){
				if(lib.isDir(item.path)){
					add(item);
				}
			})
		})
	},

	leave: function(){
		console.log('leave ' + this.id)
	},

	dom: {
		aside: ''+
				'<div id="lessFolder" class="list-folder">'+
				'	<ul>'+
				'	<%for(var i=0, len=list.length;i<len; i++){%>'+
				'		<li><%=list[i]%></li>'+
				'	<%}%>'+
				'	</ul>'+
				'</div>'
	},

	data: {
		aside: {
			list: ['123']
		}
	},

	ready: function(){

	}
});

page.init();
page.reg();


module.exports = page;