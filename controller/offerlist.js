var model = require('../model/offerlist')

module.exports.OfferList = async (req, res) => {
    try {
        let offerList = await model.GetOffer()
        if (offerList.length > 0) {
            return res.send({
                result: true,
                message: "data retrieved",
                data: offerList
            })
        } else {
            return res.send({
                result: false,
                message: "offer not found"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}