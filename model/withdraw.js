var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.getBank = async (bank_id) => {
    var Query = `select * from bank where b_id = ?`;
    var data = await query(Query, [bank_id]);
    return data;
};

module.exports.getUser = async (user_id) => {
    var Query = `select u_id,u_name,u_email,u_mobile,u_role,u_status,u_joining_date,u_returned_amount,u_wfa_password from users
    where u_id = ?`;
    var data = await query(Query, [user_id]);
    return data;
};

module.exports.AddWithdraw = async (user_id, amount, bank_id, date) => {
    var Query = `insert into withdraw_request(wr_u_id,wr_amount,wr_bank_details,wr_date,wr_status)values(?,?,?,?,?)`;
    var data = await query(Query, [user_id, amount, bank_id, date, 'pending']);
    return data;
};