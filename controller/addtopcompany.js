var model = require("../model/addtopcompany");

module.exports.AddTopCompany = async (req, res) => {
    try {
        let admin_id = req.user.admin_id
        let admin_role = req.user.role

        var adminData = await model.getAdmin(admin_id, admin_role)
        if (adminData[0]?.u_role == 'user') {
            return res.send({
                result: false,
                message: "Access Denied,try with authorized account"
            })
        }
        var { tc_name, tc_current_year, tc_previous_year, tc_growth_percentage, tc_expected_CAGR, tc_priority } = req.body
        if (!tc_name || !tc_name || !tc_current_year || !tc_previous_year || !tc_growth_percentage) {
            return res.send({
                result: false,
                message: "insufficent parameter"
            })
        }
        let addTopCompany = await model.AddTopCompanyQuery(tc_name, tc_current_year, tc_previous_year, tc_growth_percentage, tc_expected_CAGR, tc_priority)

        if (addTopCompany.affectedRows > 0) {

            return res.send({
                result: true,
                message: "Top Company added successfully"
            });

        } else {
            return res.send({
                result: true,
                message: "failed to add Top Company "
            })
        }


    } catch (error) {
        console.log(error);
        return res.send({
            result: false,
            message: error.message,
        });
    }

}