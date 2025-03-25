var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.EditProfile = async (u_id, u_currency, u_gender, u_address, u_mobile, u_country) => {
    var Query = `
        UPDATE users 
        SET 
            u_currency = ?, 
            u_gender = ?, 
            u_address = ?, 
            u_mobile = ?,
            u_country=?
            where u_id = ?;
    `;
    var data = await query(Query, [u_currency, u_gender, u_address, u_mobile, u_country, u_id]);
    return data;
};
