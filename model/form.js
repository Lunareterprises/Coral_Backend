var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.AddForm = async(name, email, number, inv_amount, inv_type, country) => {
    var Query = `INSERT INTO form (f_name, f_mail, f_number, f_investment_amount, f_invest_type, f_country)
VALUES (?,?,?,?,?,?)`;
    var data = await query(Query,[name, email, number, inv_amount, inv_type, country]);
    return data;
};