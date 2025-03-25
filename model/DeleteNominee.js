var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.DeleteNominee = async (n_id) => {
    var Query = `delete from nominee where n_id = ? `;
    var data = await query(Query, [n_id]);
    return data;
};