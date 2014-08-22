// Database map
// by gavinning

var lib, mongoose , database, db, Schema;

lib = require('linco.lab').lib;
mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
database = mongoose.connection;
Schema = mongoose.Schema;

database.on('error', function(err){
	console.log('err:', err);
});
database.once('open', function(){
	console.log('database is connected')
});

function createModel(name, doc){
	var document = mongoose.model(name, new Schema(doc));

	// add data
	document.add = function(filter, info, fn){
		var fn = fn || function(){};
		// check field
		var ck = this.is(info);
		// When didn't pass the test
		if(!ck.code) return fn(ck);

		var __doc = new document;
		lib.extend(__doc, info);

		function __save(doc, fn){
			doc.save(function(err){
				if(err) return fn({code: 0, message: err.message});
				fn({code: 1, message: "Success", data: __doc});
			})
		}

		// connect mongodb find the filter
		filter === null ?

		__save(__doc, fn):

		document.find(filter, function(e, docs){
			if(e) return fn({code: 0, message: e.message});
			if(docs.length >= 1) return fn({code: 0, message: "Field already exists"});
			if(docs.length == 0) __save(__doc, fn);
		});
	}

	// del by _id
	document.delById = function(id, fn){
		var fn = fn || function(){};
		document.findById(id, function(e, doc){
			if(e) return fn({code: 0, message: e.message});
			if(doc){
				// check is editable
				if(doc.isOS) return fn({code: 0, message: "System info, does't delete"});
				doc.remove();
				return fn({code: 1, message: "Success"})
			}else{
				return fn({code: 0, message: "Didn't find the field"})
			}
		})
	}

	// del by filter
	document.del = function(filter, fn){
		var fn = fn || function(){};
		document.find(filter, function(e, docs){
			if(e) return fn({code: 0, message: e.message});
			if(docs.length == 1){
				// check is editable
				if(docs[0].isOS) return fn({code: 0, message: "System info, does't delete"});
				docs[0].remove();
				return fn({code: 1, message: "Success"});
			}
			else if(docs.length > 1){
				lib.each(docs, function(){
					if(this.isOS) return;
					this.remove();
				})
				return fn({code: 1, message: "Success"})
			}else{
				return fn({code: 0, message: "Didn't find the field"})
			}
		})
	}

	// update
	document.up = function(filter, info, fn){
		var fn = fn || function(){};
		var data = [];
		var err = [];
		document.find(filter, function(e, docs){
			if(e) return fn({code: 0, message: e.message});
			if(docs.length >= 1){
				lib.each(docs, function(i){
					lib.extend(this, info);
					this.save(function(e, doc){
						if(e){
							e.data = doc;
							err.push(e);
							return;
						};
						data.push(doc);
					});
				});
				return err.length == docs.length ?
					fn({code: 0, message: "Error", err: err, data: data}):
					fn({code: 1, message: "Success", err: err, data: data});
			}
		})
	}

	return document;
}

// 定义嵌入文档
var Modules = new Schema({
	name 	: String,
	type	: String,
	code 	: String,
	time 	: Number
});

db = {
	os: function(){
		return createModel('o', {
			name 	: String,
			config	: Object
		})
	},


	// module: function(){
	// 	return createModel('module', {
	// 		name 	: String,
	// 		author	: String,
	// 		parent 	: String,
	// 		package : String,

	// 		time 	: Number,
	// 	})
	// }
};

module.exports = db;