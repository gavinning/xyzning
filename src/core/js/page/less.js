'use strict';

// 页面实例

var path = require('path');
var lib = require('linco.lab').lib;
var Page = require('../lib/page');

var $ = window.$;

var page = new Page;

page.extend({
	name: "less page",
	id: "less",

	init: function(){
		console.log('init ' + this.id)
	},

	enter: function(){
		// 载入页面
		console.log('enter ' + this.id);

		// 渲染页面
		// this.render('asideInner', this.dom.aside, this.data.aside);

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