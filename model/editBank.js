var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.EditBank = async (b_id, b_account_no, b_ifsc_code, b_swift_code, b_bank_name, b_branch_name, b_currency, b_name_as) => {
    var Query = `
        UPDATE bank 
        SET 
            b_account_no = ?, 
            b_ifsc_code = ?, 
            b_swift_code = ?, 
            b_name = ?, 
            b_branch = ?, 
            b_currency = ?,
            b_name_as=?
            where b_id = ?;
    `;

    var data = await query(Query, [b_account_no, b_ifsc_code, b_swift_code, b_bank_name, b_branch_name, b_currency, b_name_as, b_id]);

    return data;
};

module.exports.findBank = async (b_id, user_id) => {
    var Query = `
        SELECT * FROM bank where b_id = ? and b_u_id=?;
    `;

    var data = await query(Query, [b_id, user_id]);

    return data;
};