var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.AddOffer = async (name,description,file) => {
    var Query = `insert into offers(o_name,o_description,o_file)values(?,?,?)`;
    var data = await query(Query, [name,description,file]);
    return data;
};
