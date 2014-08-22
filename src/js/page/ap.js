'use strict';

// 页面实例

var path = require('path');
var lib = require('linco.lab').lib;
var Page = require('../lib/page');
var page = new Page;
var datainfo = {};
var datahash = {};
datainfo.length = 0;

page.extend({
	id: "ap",
	pageId: "#vpAp",

	init: function(){
		console.log('init ' + this.id)
		this.enter();
		this.bind();
	},

	enter: function(){
		this.render();
	},

	bind: function(){
		var ap = new lib.parent();

		ap.extend({
			makeQuery: function(id){
				var doc, link, st, murl, commentId, linkId;

				this.frame = $('#appIframe').get(0);
				this.frame.src = murl + id;

				this.frame.onload = function(){
					doc = $(this.contentDocument).find(commentId).get(0)

					st = setInterval(function(){
						if(doc.contentDocument){
							clearInterval(st)
							doc = $(doc.contentDocument);
							link = doc.find(linkId)
							link.each(function(){
								var num = this.href.replace(murl, '') - 0
								if($.type(num)=='number'){
									if(!datainfo[num]){
										datainfo[num] = {
											id: num,
											name: this.innerText
										}
										datainfo.length++;
									}
								}
							})
							console.log(datainfo, datainfo.length)
						}
					}, 50)
				}
			}
		}),

		get: function(){

		},

		start: function(){

		},

		end: function(){
			
		}

		// ap.makeQuery();
	}

});

page.reg();

module.exports = page;