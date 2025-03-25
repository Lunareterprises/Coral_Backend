var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.UpdateUserInvest = async (ui_id, n_id) => {
    var Query = `update user_invest set ui_transfer = ? where ui_id = ?`;
    var data = await query(Query, [n_id, ui_id]);
    return data;
};

module.exports.getUser = async (u_id) => {
    var Query = `select * from users where u_id = ?`;
    var data = await query(Query, [u_id]);
    return data;
};

module.exports.getInvestedData=async(u_id)=>{
    var Query= `select * from user_invest where ui_u_id = ?`;
    var data = await query(Query, [u_id]);
    return data;
}

module.exports.requestTransfer = async (u_id) => {
    var Query = `update user_invest set ui_status=? where ui_u_id = ?`;
    var data = await query(Query, ["requestedForTransfer",u_id]);
    return data;
}