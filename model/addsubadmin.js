var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.getAdmin = async (user_id) => {
    var Query = `select * from users where u_id = ? and u_role ='superadmin'`;
    var data = await query(Query, [user_id]);
    return data;
};


module.exports.AddAdmin = async (name, email, mobile, password, role, today) => {
    var Query = `insert into users (u_name, u_email, u_mobile, u_password, u_role,u_joining_date) values (?,?,?,?,?,?)`;
    var data = await query(Query, [name, email, mobile, password, role, today]);
    return data;
};