var model = require('../model/updatebank')

module.exports.UpdateBank = async (req, res) => {
    try {
        let {user_id} = req.headers
        let {b_id,b_account_no,b_ifsc_code,b_swift_code,b_name,b_branch,b_currency} = req.body
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}