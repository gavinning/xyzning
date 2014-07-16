'use strict';

// author: gavinning
// HomePage: www.ilinco.com
// 虚拟页面管理，底层框架，底层抽象逻辑，不包含页面逻辑

var path = require('path');
var pagePath = '../page';
var location = {};
var pm;

pm = {
	version : '0.0.1',

	name: 'PageManger',

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

		// PM init log
		console.log('PM is init.');

		if("onhashchange" in window){

			// 监听hashchange事件
			window.onhashchange = function(){
				pm.hashChange(location.hash.slice(1));
			}
		}else{
			console.log('not support onhashchange event');
		}

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
		// debug
		// if(this.page.id == id) return;

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
				// this._404();
				// this.home();
				this.page = this.pageHash[this.homePage];
				this.page.enter();
			}
		}

		// 页面切换日志
		this._prev.id ?
			console.log(this._prev.id + ' => ' + this.page.id):
			console.log('=> ' + this.page.id);
	},

	// 虚拟页注册
	reg: function(page){
		if(!this.pageHash[page.id]){
			this.pageHash[page.id] = page;
			this.pageArray.push(page);
		};

		// 页面注册日志
		console.log(page.id + ' is reg');

		// 初始化页面
		this.page = page;
		this.page.init();
	},

	// 变更hash
	setHash: function(hash){
		location.hash = hash;
	},

	// 处理hash变更
	hashChange: function(hash){
		if(!hash) return this.home();
		// 过滤非法字符
		hash = hash.replace(/[\.\?'"><:;,\[\]\{\}]/ig, '');
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























