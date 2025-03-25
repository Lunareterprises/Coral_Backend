var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.GetFaq = async () => {
    var Query = `select * from faq where status='active'`;
    var data = await query(Query);
    return data;
};