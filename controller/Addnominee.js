var model = require('../model/Addnominee')
var nomineeListModel = require('../model/nomineelist')
var formidable = require('formidable')
var moment = require('moment')
var fs = require('fs')
var nodemailer = require('nodemailer')
let notification = require('../util/saveNotification')
let userModel = require('../model/users')

module.exports.AddNominee = async (req, res) => {
    try {
        let { user_id } = req.headers
        if (!user_id) {
            return res.send({
                result: false,
                message: "user_id is required"
            })
        }
        let userData = await userModel.getUser(user_id)
        if (userData.length <= 0) {
            return res.send({
                result: false,
                message: "Invalid user"
            })
        }
        let nominee = await nomineeListModel.getnominee(user_id)
        if (nominee.length > 0) {
            return res.send({
                result: true,
                message: "nominee already added"
            })
        }
        var form = new formidable.IncomingForm({ multiples: true });
        form.parse(req, async function (err, fields, files) {
            if (err) {
                return res.send({
                    result: false,
                    message: "File Upload Failed!",
                    data: err,
                });
            }
            var date = moment().format('YYYY_MM_DD')

            let { name, relation, email, gender, country, mobile, address, id_type } = fields
            if (!name || !relation || !email || !gender || !country || !mobile || !address || !id_type) {
                return res.send({
                    result: false,
                    message: "please fill all the fields"
                })
            }
            if (files.image) {
                var oldPath3 = files.image.filepath;
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                var newFilename = date + '_' + uniqueSuffix + '_' + files.image.originalFilename.replace(' ', '_');
                var newPath3 = process.cwd() + "/uploads/nomineeProof/" + newFilename;

                if (!fs.existsSync(process.cwd() + "/uploads/nomineeProof/")) {
                    fs.mkdirSync(process.cwd() + "/uploads/nomineeProof/", { recursive: true });
                }

                fs.renameSync(oldPath3, newPath3);  // Move the file

                let proof = "uploads/nomineeProof/" + newFilename;

                let add = await model.addnominee(user_id, name, relation, email, gender, country, mobile, address, id_type, proof);
                if (add.affectedRows > 0) {
                    await notification.addNotification(user_id,userData[0].u_role, "Nominee added", `Nominee ${name} added successfully`)
                    return res.send({
                        result: true,
                        message: "Nominee added successfully"
                    });
                } else {
                    return res.send({
                        result: false,
                        message: "Failed to add nominee"
                    });
                }
            }
            else {
                if (!files.image) {
                    return res.send({
                        result: false,
                        message: "please upload your nominee proof"
                    })
                }
            }

        })
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}