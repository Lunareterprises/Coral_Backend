var db = require('../db/db')
var util = require('util')
var query = util.promisify(db.query).bind(db)

module.exports.CheckAdmin = async (user_id, role) => {
    var Query = `select * from users where u_id =? and u_role =?`;
    var data = await query(Query, [user_id, role]);
    return data;
}

module.exports.getWalletList = async (condition) => {
    var Query = `SELECT wl.*, 
    us.u_id, 
    us.u_name, 
    us.u_email, 
    us.u_mobile,
    us.u_wallet,
    us.u_status 
    FROM wallet wl
    LEFT JOIN users us ON wl.w_u_id = us.u_id ${condition}`;
    var data = await query(Query);
    return data;
}
