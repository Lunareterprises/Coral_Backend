var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.GetHgfs = async () => {
    var Query = `select * from hgfs`;
    var data = await query(Query);
    return data;
};

module.exports.Getbalance = async (user_id) => {
    var Query = `select u_returned_amount,u_status,u_kyc,u_currency from users where u_id = ?`;
    var data = await query(Query,[user_id]);
    return data;
};

module.exports.GetUserInvest = async (user_id) => {
    var Query = `select * from user_invest where ui_u_id = ? and ui_security_option = 'Shares'`;
    var data = await query(Query,[user_id]);
    return data;
};