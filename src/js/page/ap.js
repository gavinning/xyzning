'use strict';

// 页面实例

var path = require('path');
var lib = require('linco.lab').lib;
var db = require('../db');
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
			cb: function(){
				return arguments[0] || function(){};
			},

			makeConfig: function(){
				this.config = {
					baseURL: 'http://www.ilinco.com/',
					feedId: '#FeedContent',
					nameCard: '#nameCard',
					// 存储条件
					maxCount: 1000,

					sqlArr: [],
					sqlHash: {},

					newArr: [],
					newHash: {}
				}
				this.frame = $('#appIframe').get(0);
			},

			makeQuery: function(id){
				var doc, link, st, murl, commentId, linkId;
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
			},

			// 拉取需处理的数据
			getQueryNumber: function(callback){
				callback = this.cb(callback);
				db.find({query: 0}, function(e, docs){
					if(e) return console.log(e.message)
					callback(docs)
				})
			},

			// 存储A阶段新数据
			saveNewData: function(){
				db.update({qid: id}, function(){
					
				})
			},

			// 更新已处理的数据
			updateHandleData: function(){
				
			},

			loop: function(){
				this.makeConfig();


			},

			// 开启爬虫任务
			beginLoop: function(){
				
			},

			// 结束爬虫任务
			endLoop: function(){
				
			},

			// 暂停爬虫任务
			pauseLoop: function(){
				
			},

			// 统计
			queryAll: function(){
				
			},

			// 导出数据
			exportData: function(){
				
			}

		})

		// ap.makeQuery();
	}

});

page.reg();

module.exports = page;