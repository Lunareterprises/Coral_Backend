var model = require('../model/DeleteNominee')
let notification = require('../util/saveNotification')
let userModel=require('../model/users')

module.exports.DeleteNominee = async (req, res) => {
    try {
        let { n_id, user_id } = req.headers;
        if (!n_id) {
            return res.send({
                result: false,
                message: "nominee id is required"
            })
        }
        if(!user_id){
            return res.send({
                result: false,
                message: "user id is required"
            })
        }
        let userData=await userModel.getUser(user_id)
        if(userData.length==0){
            return res.send({
                result: false,
                message: "Invalid user"
            })
        }
        let deleted = await model.DeleteNominee(n_id)
        if (deleted.affectedRows > 0) {
            await notification.addNotification(user_id,userData[0].u_role, "Nominee Deleted", "Nominee deleted successfully")
            return res.send({
                result: true,
                message: "Nominee deleted successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "failed to delete Nominee"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}