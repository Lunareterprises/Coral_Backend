var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.getWithdraw = async (user_id,year) => {
    var Query = `select * from user_invest where ui_u_id = ? and YEAR(ui_date) = ? and ui_status = 'active'`;
    var data = await query(Query,[user_id,year]);
    return data;
};