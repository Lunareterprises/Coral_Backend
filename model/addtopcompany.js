var db = require('../db/db');
var util = require("util");
const query = util.promisify(db.query).bind(db);


module.exports.AddTopCompanyQuery = async (tc_name, tc_current_year, tc_previous_year, tc_growth_percentage, tc_expected_CAGR, tc_priority) => {
    var Query = `insert into top_company (tc_name, tc_current_year, tc_previous_year, tc_growth_percentage,tc_expected_CAGR, tc_priority) values (?,?,?,?,?)`;
    var data = query(Query, [tc_name, tc_current_year, tc_previous_year, tc_growth_percentage, tc_expected_CAGR, tc_priority]);
    return data;
}