var model = require('../model/adStatusChange');
var notification = require('../util/saveNotification')

module.exports.StatusChange = async (req, res) => {

    try {

        let admin_id = req.user.admin_id
        let admin_role = req.user.role

        var adminData = await model.CheckAdmin(admin_id, admin_role)
        if (adminData[0]?.u_role == 'user') {
            return res.send({
                result: false,
                message: "Access Denied,try with authorized account"
            })
        }
        var { contract_status, contract_id, activate_user_id, activate_admin_id, invest_req_id, invest_req_status } = req.body


        if (contract_status && contract_id) {

            var getcontract = await model.GetContract(contract_id)
            if (getcontract.length > 0) {
                var previous_status = getcontract[0]?.ui_status

                await notification.addNotification(admin_id, `${admin_role}`, "Contract status changed", `Contract status changed from ${previous_status} to ${contract_status}`)

                let changecontractstatus = await model.ChangeContractStatus(contract_status, contract_id)

                if (changecontractstatus.affectedRows > 0) {
                    return res.send({
                        result: true,
                        message: "Contract Status Updated Sucessfully"
                    })
                } else {
                    return res.send({
                        result: false,
                        message: "Failed to Update Contract Status"
                    })
                }
            } else {
                return res.send({
                    result: false,
                    message: "Failed to get Contract Details"
                })
            }
        }

        if (activate_user_id) {

            var getuser = await model.GetUser(activate_user_id)
            if (getuser.length > 0) {
                var previous_status = getuser[0]?.u_status

                await notification.addNotification(admin_id, `${admin_role}`, `Verifying user ${getuser[0]?.u_name}`, `User status verifiyed from ${previous_status} to active`)

                let changeuserstatus = await model.ChangeUserStatus(activate_user_id)

                if (changeuserstatus.affectedRows > 0) {
                    return res.send({
                        result: true,
                        message: "User Status Updated Sucessfully"
                    })
                } else {
                    return res.send({
                        result: false,
                        message: "Failed to Update User Status"
                    })
                }
            } else {
                return res.send({
                    result: false,
                    message: "Failed to get user Details"
                })
            }
        }

        if (activate_admin_id) {

            var getuser = await model.GetUser(activate_admin_id)
            if (getuser.length > 0) {
                var previous_status = getuser[0]?.u_status
                var role = getuser[0]?.u_role


                await notification.addNotification(admin_id, `${admin_role}`, `Verifying ${role} ${getuser[0]?.u_name}`, `User status verifiyed from ${previous_status} to active`)

                let changeuserstatus = await model.ChangeUserStatus(activate_admin_id)

                if (changeuserstatus.affectedRows > 0) {
                    return res.send({
                        result: true,
                        message: "subadmin Status Updated Sucessfully"
                    })
                } else {
                    return res.send({
                        result: false,
                        message: "Failed to Update subadmin Status"
                    })
                }
            } else {
                return res.send({
                    result: false,
                    message: "Failed to get subadmin Details"
                })
            }
        }


        if (invest_req_id && invest_req_status) {

            var getinvest = await model.GetContract(invest_req_id)
            if (getinvest.length > 0) {
                var previous_status = getinvest[0]?.ui_request_status


                await notification.addNotification(admin_id, `${admin_role}`, `Invest Request ${invest_req_status} `, `Invest Request status updated from ${previous_status} to ${invest_req_status}`)

                let changeInveststatus = await model.ChangeInvestReqStatus(invest_req_status, invest_req_id)

                if (changeInveststatus.affectedRows > 0) {
                    return res.send({
                        result: true,
                        message: "Invest Request Status Updated Sucessfully"
                    })
                } else {
                    return res.send({
                        result: false,
                        message: "Failed to Update Invest Request Status"
                    })
                }
            } else {
                return res.send({
                    result: false,
                    message: "Failed to get subadmin Details"
                })
            }
        }


    } catch (error) {

        return res.send({
            result: false,
            message: error.message
        })

    }

}