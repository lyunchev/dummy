"use strict";
var path = require('path');
var promise = require('bluebird');
var options = {
	// Initialization Options
	promiseLib: promise
};

var pg = {
    init: function(){
        pg.connectionString = connectionString
        pg.db = pg.pgp(pg.connectionString);
    },
	sql: function(file) {
		if (!pg.qFile) {
			var fullPath = path.join(__dirname, file);
			pg.qFile = new pg.pgp.QueryFile(fullPath, {
				minify: true
			});
		}
		return pg.qFile;
	},
	end: function() {
		pg.pgp.end();
	}
};
pg.pgp = require('pg-promise')(options);

module.exports = pg;