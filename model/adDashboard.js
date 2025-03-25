var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.getAdmin = async (user_id, admin_role) => {
    var Query = `select * from users where u_id = ? and u_role =?`;
    var data = await query(Query, [user_id, admin_role]);
    return data;
};

module.exports.getusers = async () => {
    var Query = `select * from users `;
    var data = await query(Query);
    return data;
};

module.exports.getInvestment = async () => {
    var Query = `select * from user_invest `;
    var data = await query(Query);
    return data;
};