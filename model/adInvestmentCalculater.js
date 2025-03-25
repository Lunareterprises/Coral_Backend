var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.getAdmin = async (user_id) => {
    var Query = `select * from users where u_id = ? and u_role ='superadmin'`;
    var data = await query(Query, [user_id]);
    return data;
};

module.exports.AddInvestmentcalculater = async (ic_amount, ic_projects, ic_yearly_return, ic_monthly_return, ic_withdrawal_frequency, ic_duration, ic_security_option, ic_status) => {
    var Query = `insert into investment_calculater (ic_amount, ic_projects, ic_yearly_return, ic_monthly_return, ic_withdrawal_frequency, ic_duration, ic_security_option,ic_status) values (?,?,?,?,?,?,?,?)`;
    var data = await query(Query, [ic_amount, ic_projects, ic_yearly_return, ic_monthly_return, ic_withdrawal_frequency, ic_duration, ic_security_option, ic_status]);
    return data;
};