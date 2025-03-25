var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.getUser = async (user_id, pin) => {
    var Query = `select * from users where u_easy_pin = ? and u_id = ?`;
    var data = await query(Query, [pin, user_id]);
    return data;
};

module.exports.getUser1 = async (user_id, pin) => {
    var Query = `select * from users where u_wfa_password = ? and u_id = ?`;
    var data = await query(Query, [pin, user_id]);
    return data;
};