'use strict';

// 虚拟页面管理，底层框架

var path = require('path');
var pagePath = '../page';

var pm;

pm = {
	version : '0.0.1',

	name: 'Page Manger',

	// Home页id
	homePage: 'home',

	// 缓存当前虚拟页信息
	page: null,

	// 页面列表
	pageHash: {},
	pageArray: [],

	// 缓存上一页虚拟页信息
	_prev: null,

	// 对外对象
	root: {},

	// Home页面
	home: function(){
		try{
			this.show(this.homePage);
		}catch(e){
			console.error(e.message);
		}
	},

	// 上一页面
	prev: function(){
		if(!this._prev) return;
		this.page.leave();
		this.page = this._prev;
		this.page.enter();
		this._prev = null;
	},

	init: function(id){

	},

	show: function(id){
		this.leave();
		this.load(id);
	},

	leave: function(){
		this.page ? this.page.leave() : "";
		this._prev = this.page;
	},

	load: function(id){
		this.pageHash[id] ?
			this.pageHash[id].enter() :
			require(path.join(pagePath, id));
	},

	reg: function(page){
		if(!this.pageHash[page.id]){
			this.pageHash[page.id] = page;
			this.pageArray.push(page);
		};

		console.log(page.id + ' is reg')

		this.page = page;
		this.page.enter();
	},

	cache: function(){

	},

	stats: function(){

	},

	hashChange: function(){

	},

	pageChange: function(){

	},

	bind: function(){

	}
}

module.exports = pm;























