var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.UpdateCompanyInvest = async (condition, ci_id) => {
    var Query = `update company_invest ${condition} where ci_id = ?`;
    var data = await query(Query, [ci_id]);
    return data;
};

module.exports.UpdateInvestedAmount = async (condition,cia_id) => {
    var Query = `update invested_amount ${condition} where cia_id = ?`;
    var data = await query(Query, [cia_id]);
    return data;
};