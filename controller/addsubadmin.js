var model = require('../model/addsubadmin')
let notification = require('../util/saveNotification')
var bcrypt = require("bcrypt");
var formidable = require('formidable')
var fs = require('fs')

module.exports.AddSubAdmin = async (req, res) => {
    try {

        var form = new formidable.IncomingForm({ multiples: true });
        form.parse(req, async function (err, fields, files) {
            if (err) {
                return res.send({
                    result: false,
                    message: "File Upload Failed!",
                    data: err,
                }); 
            }

            let user_id = req.user.admin_id
            let admin_role = req.user.role


            console.log(user_id, admin_role, "lllll");


            let { name, email, mobile, password, role } = fields

            if (!name || !email || !mobile || !password || !role) {
                return res.send({
                    result: false,
                    message: "Please fill all the fields"
                })
            }
            var adminData = await model.getAdmin(user_id, admin_role)
            if (adminData[0]?.u_role !== 'superadmin') {
                return res.send({
                    result: false,
                    message: "Access Denied,try with authorized account"
                })
            }

            var hashedPassword = await bcrypt.hash(password, 10);



            if (files.image) {
                var oldPath = files.image.filepath;
                var newPath =
                    process.cwd() +
                    "/uploads/profile/admin/" + files.image.originalFilename
                let rawData = fs.readFileSync(oldPath);
                console.log(oldPath);

                fs.writeFileSync(newPath, rawData)
                var image = "uploads/profile/admin/" + files.image.originalFilename
                let addadmin = await model.AddAdminwithpic(name, email, mobile, image, hashedPassword, role)

                if (addadmin.affectedRows > 0) {
                    await notification.addNotification(user_id, admin_role, ` ${adminData[0]?.u_name} Added Subadmin`, "Subadmin added sucessfully")

                    return res.send({
                        result: true,
                        message: "subadmin added successfully"
                    })
                } else {
                    return res.send({
                        result: false,
                        message: "failed to add subadmin"
                    })
                }

            }
            let addadmin = await model.AddAdmin(name, email, mobile, hashedPassword, role)

            if (addadmin.affectedRows > 0) {
                await notification.addNotification(user_id, admin_role, ` ${adminData[0]?.u_name} Added Subadmin`, "Subadmin added sucessfully")

                return res.send({
                    result: true,
                    message: "Subadmin added successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "Failed to add subadmin"
                })
            }
        })
    } catch (error) {
        console.log(error, "rrrr");

        return res.send({
            result: false,
            message: error.message
        })
    }
}