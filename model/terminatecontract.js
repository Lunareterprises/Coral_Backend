var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.updateContract = async (ui_id, reason) => {
    var Query = `insert into terminate_contract_req(tc_ui_id,tc_reason)values(?,?)`;
    var data = await query(Query, [ui_id, reason]);
    return data;
};

module.exports.isTerminated = async (ui_id) => {
    var Query = `select * from terminate_contract_req where tc_ui_id = ?`;
    var data = await query(Query, [ui_id]);
    return data;
};

module.exports.getusersdata = async (ui_id) => {
    var Query = `select * from user_invest
    inner join users on ui_u_id = u_id
    where ui_id = ?`;
    var data = await query(Query, [ui_id]);
    return data;
};

module.exports.updateTerminationStatus = async (ui_id) => {
    var queryUpdate = `UPDATE user_invest SET ui_status = ? WHERE ui_id = ?`;
    let data = await query(queryUpdate, ['requestedForTermination', ui_id]);
    return data;
};

