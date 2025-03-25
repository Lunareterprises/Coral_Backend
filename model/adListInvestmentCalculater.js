var db = require('../db/db')
var util = require('util')
var query = util.promisify(db.query).bind(db)

module.exports.CheckAdmin = async (user_id, role) => {
    var Query = `select * from users where u_id =? and u_role =?`;
    var data = await query(Query, [user_id, role]);
    return data;
}

module.exports.getInvestmenyCalculaterist = async () => {
    var Query = `SELECT * FROM return_invest `;
    var data = await query(Query);
    return data;
}
