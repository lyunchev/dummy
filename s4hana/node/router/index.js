"use strict";

module.exports = function(app, server) {
	app.use("/node/importTransactions", require("./routes/importTransactions")(server));
	app.use("/node/importMerchants", require("./routes/importMerchants")(server));
};