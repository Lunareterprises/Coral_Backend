var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.GetFutureInvestmentList = async () => {
    var Query = `select * from future_investments`;
    var data = await query(Query);
    return data;
};