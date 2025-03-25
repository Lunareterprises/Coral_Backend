var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.GetOffer = async () => {
    var Query = `select * from offers`;
    var data = await query(Query);
    return data;
};
