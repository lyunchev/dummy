var conn = $.db.getConnection();

var transactionDate = $.request.parameters.get("transactionDate");
var viewName = $.request.parameters.get("viewName");
console.log(transactionDate + '_______' + viewName);

var sql = "select * from \"s4hana.db::" + viewName + "\" where \"document_date\" = '" + transactionDate + "' limit 1000";
var stmt = conn.prepareStatement(sql);
var rs = stmt.executeQuery();

var data = [];
var row = {};
while (rs.next()) {
	row = {};
	if (viewName === "sumTransactions") {
		row = {
			event_type: rs.getNString(1),
			acquirer_code: rs.getInt(2),
			document_date: rs.getNString(3),
			currency: rs.getNString(4),
			country: rs.getNString(5),
			transaction_status_id: rs.getInt(6),
			transaction_event_status_id: rs.getInt(7),
			payment_type: rs.getInt(8),
			migrated_payleven_yn: rs.getInt(9),
			card_reader_id: rs.getInt(10),
			event_amount: rs.getNString(11),
			total_fee: rs.getNString(12),
			fixed_fee: rs.getNString(13),
			acceleration_fee: rs.getNString(14),
			processing_fee: rs.getNString(15)
		};
	} else if (viewName === "sumPayouts") {
	    //console.log('zzzzzzzzzzzzz' + rs.getInt(7));
		row = {
			event_type: rs.getNString(1),
			acquirer_code: rs.getInt(2),
			document_date: rs.getNString(3),
			currency: rs.getNString(4),
			country: rs.getNString(5),
			transaction_event_status_id: rs.getInt(6),
			paid: rs.getInt(7),
			comment: rs.getNString(8),
			iban: rs.getNString(9),
			event_amount: rs.getNString(10),
			fixed_fee: rs.getNString(11),
			acceleration_fee: rs.getNString(12),
			processing_fee: rs.getNString(13)
		};
	}

	data.push(row);
}

$.response.contentType = "application/json";
$.response.setBody(JSON.stringify(data));