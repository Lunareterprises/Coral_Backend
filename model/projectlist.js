var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.getCompanyInvest = async () => {
    var Query = `select distinct(ri_project) as ci_industry,ri_id,ri_amount_from,ri_amount_to,ri_return_year from return_invest ORDER BY ri_amount_from ASC,ri_id ASC limit 15`;
    var data = await query(Query);
    return data;
};