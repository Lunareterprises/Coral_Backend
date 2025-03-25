var model = require('../model/editcompanyinvestment')


module.exports.EditCompanyInvestment = async (req, res) => {
    try {
        let { ci_id, cia_id, ci_industry, ci_company, ci_return_time_period, ci_percentage, cia_year, cia_currency, cia_amount } = req.body
        let ci_condition = ''
        let cia_condition = ''
        var val = true
        if (ci_id) {
            if (ci_industry) {
                ci_condition == '' ? ci_condition = `set ci_industry = '${ci_industry}'` : ci_condition += ` , ci_industry = '${ci_industry}'`;
            }
            if (ci_company) {
                ci_condition == '' ? ci_condition = `set ci_company = '${ci_company}'` : ci_condition += ` , ci_company = '${ci_company}'`;
            }
            if (ci_return_time_period) {
                ci_condition == '' ? ci_condition = `set ci_return_time_period = '${ci_return_time_period}'` : ci_condition += ` , ci_return_time_period = '${ci_return_time_period}'`;
            }
            if (ci_percentage) {
                ci_condition == '' ? ci_condition = `set ci_percentage = '${ci_percentage}'` : ci_condition += ` , ci_percentage = '${ci_percentage}'`;
            }
            if (ci_condition) {
                var update = await model.UpdateCompanyInvest(ci_condition, ci_id)
            } else {
                val = false
            }
        }
        if (cia_id) {
            if (cia_year) {
                (cia_condition == '') ? cia_condition = `set cia_year = '${cia_year}'` : cia_condition += ` , cia_year = '${cia_year}'`;
            }
            if (cia_currency) {
                (cia_condition == '') ? cia_condition = `set cia_currency = '${cia_currency}'` : cia_condition += ` , cia_currency = '${cia_currency}'`;
            }
            if (cia_amount) {
                (cia_condition == '') ? cia_condition = `set cia_amount = '${cia_amount}'` : cia_condition += ` , cia_amount = '${cia_amount}'`;
            }
            if (ci_condition) {
                var update = await model.UpdateInvestedAmount(cia_condition, cia_id)
            } else {
                val = false
            }
        }

        if (val) {
            if (update.affectedRows > 0) {
                return res.send({
                    result: true,
                    message: "updated successfully"
                })
            } else {
                return res.send({
                    result: false,
                    message: "failed to update"
                })
            }
        } else {
            return res.send({
                result: false,
                message: "nothing to update"
            })
        }

    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}