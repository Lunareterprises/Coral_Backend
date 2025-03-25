var model = require('../model/order_signing')
var formidable = require('formidable')
var fs = require('fs')
let userModel = require('../model/users')
let notification = require('../util/saveNotification')

module.exports.Order_Sign = async (req, res) => {
    try {
        let { user_id } = req.headers
        if (!user_id) {
            return res.send({
                result: false,
                message: "user_id is required"
            })
        }
        let userData = await userModel.getUser(user_id)
        if(userData.length == 0){
            return res.send({
                result: false,
                message: "user not found"
            })
        }
        var form = new formidable.IncomingForm({ multiples: true });
        form.parse(req, async function (err, fields, files) {
            if (err) {
                return res.send({
                    result: false,
                    message: "failed to upload file",
                    data: err,
                });
            }
            let contract_no = fields.contract_no
            if (files.contract) {
                var oldPath = files.contract.filepath
                var newPath =
                    process.cwd() + "/uploads/user_needs/" + `client_${contract_no}` + files.contract.originalFilename;
                let rawData = fs.readFileSync(oldPath);
                fs.writeFile(newPath, rawData, async function (err) {
                    if (err) console.log(err);
                    var filepathh = "uploads/user_needs/" + `client_${contract_no}` + files.contract.originalFilename;
                    await model.UpdateClientSign(filepathh, contract_no)
                })
                await notification.addNotification(user_id,userData[0].u_role, "Contract signed", "Signed contract uploaded successfully")
                return res.send({
                    result: true,
                    message: "File uploaded successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "please upload contract file"
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