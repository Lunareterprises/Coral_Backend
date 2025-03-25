var model = require('../model/offeradd')
var formidable = require('formidable')
var moment = require('moment')
var fs = require('fs')
// let notification=require('../util/saveNotification')

module.exports.OfferAdd = async (req, res) => {
    try {
        var date = moment().format('YYYY_MM_DD')
        var form = new formidable.IncomingForm({ multiples: true });
        form.parse(req, async function (err, fields, files) {
            if (err) {
                return res.send({
                    result: false,
                    message: "File Upload Failed!",
                    data: err,
                });
            }
            var name = fields.name || null
            var description = fields.description || null
            if (files.image) {
                var oldPath1 = files.image.filepath
                var newPath1 =
                    process.cwd() + "/uploads/offer/" + date + '_' + files.image.originalFilename.replace(' ', '_')
                let rawData1 = fs.readFileSync(oldPath1);
                fs.writeFileSync(newPath1, rawData1)
                let image = "uploads/offer/" + date + '_' + files.image.originalFilename.replace(' ', '_')
                let upload = await model.AddOffer(name, description, image)
                if (upload.affectedRows > 0) {
                    // await notification.addNotification(user)
                    return res.send({
                        result: true,
                        message: "offer added successfully",
                    })
                } else {
                    return res.send({
                        result: false,
                        message: "Failed to add offer",
                    })
                }
            } else {
                return res.send({
                    result: false,
                    message: "Please select image",
                })
            }


        })
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}