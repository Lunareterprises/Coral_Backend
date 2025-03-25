var model = require("../model/addtopcompany");

module.exports.AddTopCompany = async (req, res) => {
    try {

        var { tc_name, tc_last_year, tc_previous_year, tc_growth_percentage, tc_priority } = req.body
        if (!tc_name || !tc_name || !tc_last_year || !tc_previous_year || !tc_growth_percentage || !tc_priority) {
            return res.send({
                result: false,
                message: "insufficent parameter"
            })
        }
        let addTopCompany = await model.AddTopCompanyQuery(tc_name, tc_last_year, tc_previous_year, tc_growth_percentage, tc_priority)

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