var db = require("../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);


module.exports.getAdmin = async (user_id, admin_role) => {
    var Query = `select * from users where u_id = ? and u_role =?`;
    var data = await query(Query, [user_id, admin_role]);
    return data;
};

module.exports.ChecksubadminQuery = async (subadmin_id) => {
    var Query = `select * from users where u_id= ?`;
    var data = query(Query, [subadmin_id]);
    return data;
};

module.exports.Changesubadmin = async (condition, subadmin_id) => {
    var Query = `update users ${condition} where u_id = ?`;
    var data = query(Query, [subadmin_id]);
    return data;
};

module.exports.Updateimage = async (image, subadmin_id) => {
    var Query = `update users set u_profile_pic = ?  where u_id = ? `;
    var data = query(Query, [image, subadmin_id]);
    return data;
};
