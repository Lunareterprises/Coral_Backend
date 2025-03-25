var db = require("../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);


module.exports.getAdmin = async (admin_id, admin_role) => {
    var Query = `select * from users where u_id = ? and u_role =?`;
    var data = await query(Query, [admin_id, admin_role]);
    return data;
};


module.exports.CheckTopcompanyQuery = async (tc_id) => {
    var Query = `select * FROM top_company WHERE tc_id=?`;
    var data = await query(Query, [tc_id]);
    return data;
};
module.exports.RemoveTopcompanyQuery = async (tc_id) => {
    var Query = `update top_company set tc_status ='removed' where tc_id=?`;
    var data = await query(Query, [tc_id]);
    return data;
};
//------------------------------------------------------

module.exports.CheckSubAdminQuery = async (subadmin_id) => {
    var Query = `select * FROM users WHERE u_id=?`;
    var data = await query(Query, [subadmin_id]);
    return data;
};
module.exports.RemoveSubAdminQuery = async (subadmin_id) => {
    var Query = `update users set u_status ='removed' where u_id = ?`;
    var data = await query(Query, [subadmin_id]);
    return data;
};
//------------------------------------------------------

module.exports.CheckInvestQuery = async (invest_id) => {
    var Query = `select * FROM user_invest WHERE ui_id=?`;
    var data = await query(Query, [invest_id]);
    return data;
};
module.exports.RemoveInvestQuery = async (invest_id) => {
    var Query = `update user_invest set ui_action_status ='removed' where ui_id = ?`;
    var data = await query(Query, [invest_id]);
    return data;
};
//------------------------------------------------------


module.exports.CheckWithdrawQuery = async (invest_id) => {
    var Query = `select * FROM withdraw_request WHERE wr_id=?`;
    var data = await query(Query, [invest_id]);
    return data;
};
module.exports.RemoveWithdrawQuery = async (invest_id) => {
    var Query = `update withdraw_request set wr_action_status ='removed' where wr_id = ?`;
    var data = await query(Query, [invest_id]);
    return data;
};
//------------------------------------------------------


