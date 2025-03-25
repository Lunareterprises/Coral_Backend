var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.createTicket = async (user_id, purpose, category) => {
    var Query = `insert into tickets(user_id,purpose,category)values(?,?,?)`;
    var data = await query(Query, [user_id, purpose, category]);
    return data;
};

module.exports.listTickets = async (user_id) => {
    var Query = `select * from tickets where user_id=?`
    return await query(Query, [user_id])
}