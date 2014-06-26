'use strict';

// 虚拟页面管理，底层框架

var path = require('path');
var pagePath = '../page';
var location;

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
			this.setHash(this.homePage);
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

	setHash: function(hash){
		location.hash = '#' + hash;
	},

	init: function(id){
		var hash;
		location = window.location;
		hash = location.hash.slice(1);
		hash ? this.show(hash) : this.home();
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
		if(this.pageHash[id]){
			this.pageHash[id].enter()
		}else{
			try{
				require(path.join(pagePath, id));
			}catch(e){
				console.error(e)
				return this.home();
			}
		}
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

	hashChange: function(hash){
		if(!hash) return this.home();
		this.show(hash);
	},

	pageChange: function(){

	},

	bind: function(){

	}
}

module.exports = pm;























