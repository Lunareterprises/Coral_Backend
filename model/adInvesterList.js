var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.getAdmin = async (user_id, admin_role) => {
    var Query = `select * from users where u_id = ? and u_role =?`;
    var data = await query(Query, [user_id, admin_role]);
    return data;
};


module.exports.GetInvester = async (condition) => {
    var Query = `SELECT 
    us.u_id,
    us.u_name,
    us.u_email,
    us.u_mobile,
    us.u_status,
    us.u_kyc,
    us.u_joining_date,
    us.u_easy_pin,
    ui.*, 
    n.*, 
    b.*, 
    uk.*
FROM user_invest ui
LEFT JOIN users us ON ui.ui_u_id = us.u_id
LEFT JOIN nominee n ON ui.ui_u_id = n.n_u_id 
LEFT JOIN bank b ON ui.ui_u_id = b.b_u_id
LEFT JOIN user_kyc uk ON ui.ui_u_id = uk.uk_u_id  ${condition}`;
    var data = await query(Query);
    return data;
}

module.exports.GetInvesterUser = async (condition) => {
    var Query = `SELECT us.u_id,us.u_name, us.u_email, us.u_mobile, us.u_status,us.u_kyc,us.u_joining_date,us.u_easy_pin,us.u_joining_date
    FROM user_invest ui LEFT JOIN users us ON ui.ui_u_id = us.u_id ${condition} GROUP BY us.u_id `;
    var data = await query(Query);
    return data;
};

