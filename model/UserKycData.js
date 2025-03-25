var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.GetUserKycData = async (user_id) => {
    var Query = `select * from user_kyc where uk_u_id=?`;
    var data = await query(Query,[user_id]);
    return data;
};
