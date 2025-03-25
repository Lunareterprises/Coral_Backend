var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.getnominee = async (u_id) => {
    var Query = `select * from nominee where n_u_id = ?`;
    var data = await query(Query,[u_id]);
    return data;
};