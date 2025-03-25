var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.getWithdraw = async (user_id) => {
    var Query = `select * from withdraw_request where wr_u_id = ?`;
    var data = await query(Query,[user_id]);
    return data;
};

module.exports.getInvested = async (user_id) => {
    var Query = `select ui_date as wr_date,ui_percentage as wr_percentage,ui_amount as wr_amount,user_invest.* from user_invest where ui_u_id = ? and ui_status = 'active'`;
    var data = await query(Query,[user_id]);
    return data;
};

module.exports.getUsers = async (user_id) => {
    var Query = `select * from users where u_id = ?`;
    var data = await query(Query,[user_id]);
    return data;
};