var db = require('../db/db')
var util = require('util')
var query = util.promisify(db.query).bind(db)

module.exports.CheckAdmin = async (user_id, role) => {
    var Query = `select * from users where u_id =? and u_role =?`;
    var data = await query(Query, [user_id, role]);
    return data;
}
//-----------------------------------------
module.exports.GetContract = async (contract_id) => {
    var Query = `SELECT * FROM user_invest where ui_id = ?`;
    var data = await query(Query, [contract_id]);
    return data;
}
module.exports.ChangeContractStatus = async (contract_status, contract_id) => {
    var Query = `UPDATE user_invest SET ui_status = ? WHERE ui_id = ?`;
    var data = await query(Query, [contract_status, contract_id]);
    return data;
}

//-----------------------------------------
module.exports.GetUser = async (contract_id) => {
    var Query = `SELECT * FROM users where u_id = ?`;
    var data = await query(Query, [contract_id]);
    return data;
}
module.exports.ChangeUserStatus = async (contract_status, contract_id) => {
    var Query = `UPDATE users SET u_status = 'active' WHERE u_id = ?`;
    var data = await query(Query, [contract_status, contract_id]);
    return data;
}

//---------------------------------

module.exports.ChangeInvestReqStatus = async (invest_req_status, invest_req_id) => {
    var Query = `UPDATE user_invest SET ui_request_status = ? WHERE ui_id = ?`;
    var data = await query(Query, [invest_req_status, invest_req_id]);
    return data;
}
