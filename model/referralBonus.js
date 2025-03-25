var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.getReferralBonus = async (user_id) => {
    var Query = `SELECT * FROM referral_bonus WHERE u_id = ? AND amount IS NOT NULL`;
    var data = await query(Query, [user_id]);
    return data;
};

module.exports.addReferralBonus = async (user_id, r_u_id,) => {
    var Query = `insert into referral_bonus(u_id, r_u_id) values(?,?)`;
    var data = await query(Query, [user_id, r_u_id]);
    return data;
}