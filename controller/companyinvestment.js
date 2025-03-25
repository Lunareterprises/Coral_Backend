var model = require('../model/companyinvestment')

module.exports.CompanyInvestment = async (req, res) => {
    try {
        let { ci_id, search } = req.body
        var condition = ``
        if (ci_id) {
            condition = ` where ci_id = ${ci_id}`
        }
        let companydata = await model.getCompanyInvest(condition)
        let data = await Promise.all(companydata.map(async (el) => {
            let amount = await model.getInvestedAmount(el.ci_id)
            el.invested = amount
            return el;
        }))

        if (search) {
            var datas = getTopCompanies(data, 5);
            if (datas.length > 0) {
                return res.send({
                    result: true,
                    message: datas
                })
            } else {
                return res.send({
                    result: false,
                    message: "no data found"
                })
            }
        } else {
            if (data.length > 0) {
                return res.send({
                    result: true,
                    message: data
                })
            } else {
                return res.send({
                    result: false,
                    message: "no data found"
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


function calculateGrowth(data) {
    return data.map((company) => {
        const investments = company.invested;
        const startAmount = parseInt(investments[0].cia_amount);
        const endAmount = parseInt(investments[investments.length - 1].cia_amount);
        const growthPercentage = ((endAmount - startAmount) / startAmount) * 100;
        return { ...company, growthPercentage };
    });
}

// Get the top N companies based on growth
function getTopCompanies(data, topN = 5) {
    const companiesWithGrowth = calculateGrowth(data);
    return companiesWithGrowth
        .sort((a, b) => b.growthPercentage - a.growthPercentage)
        .slice(0, topN);
}