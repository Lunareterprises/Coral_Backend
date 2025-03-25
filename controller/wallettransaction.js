var model = require('../model/wallettransaction')

module.exports.WalletTransaction = async (req, res) => {
    try {
        var { user_id } = req.headers
        if (!user_id) {
            return res.send({
                result: false,
                message: "User ID is required"
            })
        }
        var data = await model.Getwallet(user_id)
        if (data.length > 0) {
            return res.send({
                result: true,
                message: "data retrieved",
                data: data
            })
        } else {
            return res.send({
                result: false,
                message: "data not found"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}