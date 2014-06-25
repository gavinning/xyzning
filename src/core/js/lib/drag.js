'use strict';

// 简单地拖拽方法封装

var lib = require('linco.lab').lib;
var doc = window.document;

function drag(id, callback, opt){
	var def;

	typeof id == 'object' ? "" : id = doc.querySelector(id);

	if(typeof callback == 'obj'){
		opt = callback;
		callback = null;
	}

	if(typeof callback == 'function'){
		opt = opt || {};
	}

	def = {
		dragover: function(e){
			e.stopPropagation();
			e.preventDefault();
		},

		dragleave: function(e){
			e.stopPropagation();
			e.preventDefault();
		},

		drop: function(e){
			e.stopPropagation();
			e.preventDefault();
			callback ? callback() : "";
		}
	}

	opt = lib.extend(def, opt);

	id.addEventListener("dragover", opt.dragover, false);  
	id.addEventListener("dragleave", opt.dragleave, false);  
	id.addEventListener("drop", opt.drop, false);
}

module.exports = drag;