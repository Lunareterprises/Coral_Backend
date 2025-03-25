var model = require('../model/AddBank')
let userModel = require('../model/users')
let notification=require('../util/saveNotification')

module.exports.AddBank = async (req, res) => {
    try {
        let { user_id } = req.headers
        let { account_no, ifsc_code, swift_code, bank_name, branch_name, currency } = req.body
        if (!account_no || !bank_name || !branch_name || !currency) {
            return res.send({ result: false, message: "Please fill all the fields" })
        }
        let userData = await userModel.getUser(user_id)
        if (userData.length == 0) {
            return res.send({ result: false, message: "User not found" })
        }
        let data = await model.Addbank(account_no, ifsc_code, swift_code, bank_name, branch_name, currency, user_id)
        if (data.affectedRows > 0) {
            await notification.addNotification(user_id,userData[0].u_role, "Bank Added", "Bank added successfully")
            return res.send({
                result: true,
                message: "Bank added successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to add bank"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}