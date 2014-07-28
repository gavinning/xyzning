'use strict';

// 页面实例

var path = require('path');
var lib = require('linco.lab').lib;
var Page = require('../lib/page');
var page = new Page;
var undefined;

page.extend({
	id: "log",
	pageId: "#vpLog",

	init: function(){
		console.log('init ' + this.id)
		this.enter();
		this.bind();
		this.add(app.logArr)
	},

	enter: function(){
		this.render();
	},

	bind: function(){

		app.doc.on('log', function(e, msg, error){
			console.log(123)
			// 包装时间戳
			msg = '['+lib.now()+'] ' + msg;
			return page.add(msg, error);
		})
	},

	add: function(msg, error){
		var logContent = $('#logContent');

		if(lib.isArray(msg) && error == undefined){
			return msg.forEach(function(item){
				page.add(item.data, item.error)
			})
		}

		if(error){
			logContent.prepend('<p class="error">'+msg+'<p>')
		}else{
			logContent.prepend('<p>'+msg+'<p>')
		}
	}

});

page.reg();

module.exports = page;