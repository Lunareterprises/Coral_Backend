var model = require('../model/offerdelete')

module.exports.OfferDelete = async (req, res) => {
    try {
        let { o_id } = req.body
        if (!o_id) {
            return res.send({
                result: false,
                message: "offer id is required"
            })
        }
        let deletes = await model.RemoveOffer(o_id)
        if (deletes.affectedRows > 0) {
            return res.send({
                result: true,
                message: "offer removed successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "failed to remove offer"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })

    }
}