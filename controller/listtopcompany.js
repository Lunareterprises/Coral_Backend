var model = require('../model/listtopcompany')

module.exports.ListTopcompany = async (req, res) => {
    try {
        
        let { tc_id } = req.body
        let condition =''
        if (tc_id) {
            condition = ` where tc_id ='${tc_id}'`
            
        }
              
        let data = await model.ListTopcompanyquery(condition)

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