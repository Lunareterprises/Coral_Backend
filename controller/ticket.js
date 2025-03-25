var model = require('../model/ticket')
let userModel = require('../model/users')
let notification = require('../util/saveNotification')

module.exports.CreateTicket = async (req, res) => {
    try {
        let { user_id } = req.headers
        if (!user_id) {
            return res.send({
                result: false,
                message: "User id is required"
            })
        }
        let { purpose, category } = req.body
        if (!purpose || !category) {
            return res.send({ result: false, message: "Please fill all the fields" })
        }
        let userData = await userModel.getUser(user_id)
        if (userData.length == 0) {
            return res.send({ result: false, message: "User not found" })
        }
        let ticket = await model.createTicket(user_id, purpose, category)
        if (ticket.affectedRows > 0) {
            await notification.addNotification(user_id, userData[0].u_role, `Ticket for ${category}`, `Your ${purpose} has been send to the admin!.`)
            return res.send({
                result: true,
                message: "Ticket created successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to create ticket"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

module.exports.ListTickets = async (req, res) => {
    try {
        let { user_id } = req.headers
        if (!user_id) {
            return res.send({
                result: false,
                message: "User id is required"
            })
        }
        let userData = await userModel.getUser(user_id)
        if (userData.length == 0) {
            return res.send({ result: false, message: "User not found" })
        }
        let ticketList = await model.listTickets(user_id)
        if (ticketList.length > 0) {
            return res.send({
                result: true,
                message: "Data retrived successfully",
                data: ticketList
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to retrieve data"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}