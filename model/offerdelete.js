var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.RemoveOffer = async (o_id) => {
    var Query = `delete from offers where o_id = ?`;
    var data = await query(Query,[o_id]);
    return data;
};
