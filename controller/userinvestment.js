var model = require('../model/userinvestment')


module.exports.UserInvestment = async (req, res) => {
    try {
        let { u_id, company_id, amount, type, month_cycle, returns } = req.body


    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}