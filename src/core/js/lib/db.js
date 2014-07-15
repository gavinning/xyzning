var path = require('path');
var dbPath = path.join(root.app.dir, 'db');
var nedb = require('nedb');
var db = {};


db.data = new nedb({ filename: path.join(dbPath, 'data.db'), autoload: true });
db.log = new nedb({ filename: path.join(dbPath, 'log.db'), autoload: true });


module.exports = db;

// var page = {
// 	type: "page",
// 	name: "project",
// 	aside: {
// 		"/Users/gavinning/Documents/lab/github/xyzning": {
// 			name: "xyzning",
// 			src	: "/Users/gavinning/Documents/lab/github/xyzning",
// 			isHome: false
// 		}
// 	}
// }
