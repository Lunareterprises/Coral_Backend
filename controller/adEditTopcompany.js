var model = require('../model/adEditTopcompany')
var formidable = require('formidable')
var fs = require('fs')

module.exports.EditTopCompany = async (req, res) => {
    try {

        let user_id = req.user.admin_id
        let admin_role = req.user.role

        var adminData = await model.getAdmin(user_id, admin_role)
        if (adminData[0]?.u_role !== 'superadmin') {
            return res.send({
                result: false,
                message: "Access Denied,try with authorized account"
            })
        }

        let { tc_id, tc_name, tc_current_year, tc_previous_year, tc_growth_percentage, tc_expected_CAGR } = req.body

        if (!tc_id) {
            return res.send({
                result: false,
                messaage: "insufficient parameter"
            })
        }
        var checkTopCompany = await model.CheckTopCompanyQuery(tc_id)
        console.log(checkTopCompany);

        if (checkTopCompany.length > 0) {
            console.log(tc_id);

            let condition = ``;

            if (tc_name) {
                if (condition == '') {
                    condition = `set tc_name ='${tc_name}' `
                } else {
                    condition += `,tc_name='${tc_name}'`
                }
            }
            if (tc_current_year) {
                if (condition == '') {
                    condition = `set tc_current_year ='${tc_current_year}' `
                } else {
                    condition += `,tc_current_year='${tc_current_year}'`
                }
            }
            if (tc_previous_year) {
                if (condition == '') {
                    condition = `set tc_previous_year ='${tc_previous_year}' `
                } else {
                    condition += `,tc_previous_year='${tc_previous_year}'`
                }
            }

            if (tc_growth_percentage) {
                if (condition == '') {
                    condition = `set tc_growth_percentage ='${tc_growth_percentage}' `
                } else {
                    condition += `,tc_growth_percentage='${tc_growth_percentage}' `
                }
            }
            if (tc_expected_CAGR) {
                if (condition == '') {
                    condition = `set tc_expected_CAGR ='${tc_expected_CAGR}' `
                } else {
                    condition += `,tc_expected_CAGR='${tc_expected_CAGR}'`
                }
            }

            if (condition !== '') {
                var EditTopCompany = await model.ChangeTopCompany(condition, tc_id)
            }
            console.log(EditTopCompany);

            if (EditTopCompany.affectedRows > 0) {
                return res.send({
                    result: true,
                    message: "Top Company updated successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "failed to update Top Company"
                })
            }

        } else {
            return res.send({
                result: false,
                message: "Top Company does not exists"
            })
        }


    } catch
    (error) {
        return res.send({
            result: false,
            message: error.message
        })

    }
}

