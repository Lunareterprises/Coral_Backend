var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.Getbalance = async (user_id) => {
    var Query = `select u_returned_amount,u_wallet from users where u_id = ?`;
    var data = await query(Query, [user_id]);
    return data;
};