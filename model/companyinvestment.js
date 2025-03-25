var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.getCompanyInvest = async (condition) => {
    var Query = `select * from company_invest ${condition}`;
    var data = await query(Query);
    return data;
};

module.exports.getInvestedAmount = async (c_id) => {
    var Query = `select * from invested_amount where cia_ci_id = ?`;
    var data = await query(Query, [c_id]);
    return data;
};