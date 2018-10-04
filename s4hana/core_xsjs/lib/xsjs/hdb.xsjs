/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0*/
/*eslint-env node, es6 */
"use strict";

function saveCountry(id) {
	var conn = $.hdb.getConnection();
	var fnCreate = conn.loadProcedure("s4hana.db::createTransaction");
var result = fnCreate(id);
conn.commit();
conn.close();
	if (result && result.EX_ERROR !== null) {
		return result.EX_ERROR;
	} else {
		return id;
	}
}
var conn = $.hdb.getConnection();
var query = "SELECT FROM s4hana.db::tables.aggr_transactions { " +
	" aggr_transactions.event_amount " +
	" } ";
var rs = conn.executeQuery(query);

var promise = $.require("bluebird");
var optionsPromise = {
	// Initialization Options
	promiseLib: promise
};
var pgp = $.require('pg-promise')(optionsPromise);
var connectionString = 'connectionString'; 
var db = pgp(connectionString);

var body = "PG connect" + "\n";
body += "Hello World" + "\n";

// Create a QueryFile globally, once per file:
// var fs = $.require("fs");
// var sql = fs.readFileSync("1.sql").toString();
var sql = "select " +
	"tr.id, sum(te.event_amount) as event_amount " +
	",sum(tr.total_fee) as total_fee " +
	",sum(te.fixed_fee) as fixed_fee " +
	",sum(te.acceleration_fee) as acceleration_fee " +
	",sum(te.processing_fee) as processing_fee " +
	",tr.currency " +
	",tr.acquirer_code " +
	",to_char(tes.updated_at::date, 'YYYY-MM-DD') as DOCUMENT_DATE " +
	",cou.iso_code as COUNTRY " +
	",ts.transaction_status_id " +
	",te.event_type " +
	",tes.transaction_event_status_id " +
	",tr.payment_type " +
	",case when pa.user_id is null then 0 else 1 end MIGRATED_PAYLEVEN_YN " +
	"from transactions tr inner JOIN merchants me ON tr.merchant_id = me.id " +
	"join TRANSACTION_STATES AS ts ON ts.transaction_id = tr.id " +
	"JOIN countries cou ON me.country_id = cou.id " +
	"JOIN transaction_events as te ON te.transaction_id = tr.id " +
	"JOIN transaction_event_states tes on te.id=tes.transaction_event_id " +
	"left JOIN acquirers ON tr.acquirer_code = acquirers.internal_code " +
	"LEFT JOIN payleven_accounts pa ON pa.user_id= me.primary_user_id " +
	"where " +
	"tes.updated_at between '2017-04-01' and '2018-04-30' " +
	"and tr.tx_result='11' " +
	"and tr.id = 80577627 " +
	"group by tr.id, tr.currency, tr.acquirer_code, date(tes.updated_at), COUNTRY, ts.transaction_status_id, te.event_type, tes.transaction_event_status_id, tr.payment_type, MIGRATED_PAYLEVEN_YN order by COUNTRY";

var pg = $.require('pg');
const pool = new pg.Pool({
  user: 
  host: 
  database: 
  password:
  port: 
});

pool.connect();

pool.query(sql, (err, res) => {
  console.log(err, res);
  saveCountry(99999);
  pool.end();
});


$.response.contentType = "text/plain";

//$.response.setBody("Hello World");
$.response.setBody(body);
// $.response.contentType = "application/vnd.ms-excel; charset=utf-16le";
// $.response.headers.set("Content-Disposition",
// 		"attachment; filename=Excel.xls");
// $.response.status = $.net.http.OK;