var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.updateUser = async (user_id, pin) => {
    var Query = `update users set u_easy_pin = ? where u_id = ?`;
    var data = await query(Query, [pin, user_id]);
    return data;
};