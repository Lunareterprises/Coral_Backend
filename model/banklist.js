var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.getbank = async (user_id) => {
    var Query = `select bank.*,users.u_name,users.u_email,users.u_mobile from bank
    inner join users on bank.b_u_id = users.u_id
     where b_u_id = ?`;
    var data = await query(Query, [user_id]);
    return data;
};