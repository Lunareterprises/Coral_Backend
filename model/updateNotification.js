var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);


module.exports.updateNotification = async (user_id, u_isNotificationTrue) => {
    var Query = `UPDATE users 
        SET 
            u_isNotificationTrue = ?
            where u_id = ?;
    `;
    var data = await query(Query, [u_isNotificationTrue, user_id]);
    return data;
};
