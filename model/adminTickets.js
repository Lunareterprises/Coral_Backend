var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.getAllTickets = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    var Query = `
        SELECT tickets.*, users.*
        FROM tickets
        INNER JOIN users ON tickets.user_id = users.u_id
        LIMIT ? OFFSET ?
    `;
    return await query(Query, [limit, offset]);
};

module.exports.updateStatus = async (ticket_id, status) => {
    var Query = `update tickets set status=? where id=?`
    return await query(Query, [status, ticket_id])
}

module.exports.deleteTicket = async (ticket_id) => {
    var Query = `delete from tickets where id=?`
    return await query(Query, [ticket_id])
}