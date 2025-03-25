var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.UpdateClientSign = async (client_sign, ui_id) => {
    var Query = `update user_invest set ui_contract_file = ? where ui_id = ?`;
    var data = await query(Query, [client_sign, ui_id]);
    return data;
};

