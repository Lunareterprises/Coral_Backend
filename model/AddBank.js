var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.Addbank = async (account_no, ifsc_code, swift_code, bank_name, branch_name, currency, user_id) => {
    var Query = `insert into bank(b_u_id,b_account_no,b_ifsc_code,b_swift_code,b_name,b_branch,b_currency)values(?,?,?,?,?,?,?)`;
    var data = await query(Query, [user_id, account_no, ifsc_code, swift_code, bank_name, branch_name, currency]);
    return data;
};