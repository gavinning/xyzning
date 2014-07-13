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
	page: {},

	// 页面列表
	pageHash: {},
	pageArray: [],

	// 缓存上一页虚拟页信息
	_prev: {},

	// 对外对象
	root: {},

	// 渲染Home页面
	home: function(){
		try{
			this.setHash(this.homePage);
		}catch(e){
			console.error(e.message);
		}
	},

	// 渲染上一页面
	prev: function(){
		if(!this._prev.id) return;
		this.page.leave();
		this.page = this._prev;
		this.page.enter();
		this._prev = {};
	},

	// 页面初始化逻辑
	init: function(id){
		var hash;
		location = window.location;
		hash = location.hash.slice(1);
		hash ? this.load(hash) : this.home();
	},

	// 离开虚拟页，缓存上一页
	leave: function(){
		this.page.id ? this.page.leave() : "";
		this._prev = this.page;
	},

	// 加载虚拟页
	load: function(id){
		// 执行页面离开
		this.leave();

		// 渲染页面
		if(this.pageHash[id]){
			this.page = this.pageHash[id];
			this.page.enter();
		}else{

			// 渲染新页面
			try{
				require(path.join(pagePath, id));
			}catch(e){
				console.error(e);
				// 出错则返回首页或者404
				// return this._404();
				return this.home();
			}
		}
	},

	// 虚拟页注册
	reg: function(page){
		if(!this.pageHash[page.id]){
			this.pageHash[page.id] = page;
			this.pageArray.push(page);
		};

		console.log(page.id + ' is reg')

		this.page = page;
		this.page.enter();
	},

	// 变更hash
	setHash: function(hash){
		location.hash = '#' + hash;
	},

	// 处理hash变更
	hashChange: function(hash){
		if(!hash) return this.home();
		this.load(hash);
	},

	// 处理页面变更
	pageChange: function(){

	},

	// 处理缓存
	cache: function(){

	},

	bind: function(){

	}
}

module.exports = pm;























