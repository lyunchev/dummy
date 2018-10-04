/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
"use strict";
var xsenv = require("@sap/xsenv");
var express = require("express");
var msg;

xsenv.loadEnv();

module.exports = function() {
	var app = express.Router();

	app.get("/import", function(req, res) {
		var hdiClient = req.db;
		var conn = require("./util.js");
		console.log("PG connect:");
		conn.init();
		var sqlSelect = conn.sql("./selectMerchants.sql");
		conn.db.any(sqlSelect, {})
			.then(function(data) {
				var sql = "INSERT INTO \"s4hana.db::tables.merchants\" VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
				hdiClient.prepare(sql, function(err, statement) {
					if (err) {
						return console.log("PREPARE ERROR: " + err.toString());
					}
					
					var arr = [];
					data.forEach(function(element) {
						//arr.push(Object.values(element));
					statement.exec([Object.values(element)], function(err, rows) {
						if (err) {
							return console.log("EXEC ERROR: " + err.toString());
						}else{
						    return console.log("done for records");
						}
					});
					});
					
					console.log("start inserting:" + arr.length);

				//	return console.log("done for records from " + from_date + " to " + to_date);
				});
				msg = "Done";
				console.log(msg);
				res.type("text/html").status(200).send(msg);
				
				// //   ZRFC_BP
				// var connectSAP = require("./connectSAP.js");
				// connectSAP.init();
				// connectSAP.execute(data);

				// msg = "Done";
				// console.log(msg);
				// res.type("text/html").status(200).send(msg);
			})
			.catch(function(error) {
				console.log('errorzzzzzzzz');
				return console.log("EXEC ERROR: " + error.toString());
				// if (error instanceof pgp.errors.QueryFileError) {
				// 	// => the error is related to our QueryFile
				// }
			});
		conn.end();
	});
	app.get("/sap", function(req, res) {
		var connectSAP = require("./connectSAP.js");
		connectSAP.init();

		req.db.exec('select * from "s4hana.db::sumTransactions" limit 2', function(err, results) {
			if (err) {
				res.type("text/plain").status(500).send("ERROR: " + err.toString());
				return;
			}
			connectSAP.execute(results);
		});
	});
	return app;
};