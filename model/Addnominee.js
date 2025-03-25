var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.addnominee = async (u_id, name, relation, email, gender, country, mobile, address, id_type, image) => {
    var Query = `insert into nominee(n_u_id,n_name,n_relation,n_email,n_gender,n_country,n_mobile,n_address,n_id_type,n_id_proof)values(?,?,?,?,?,?,?,?,?,?)`;
    var data = await query(Query, [u_id, name, relation, email, gender, country, mobile, address, id_type, image]);
    return data;
};

module.exports.uploadNomineeForm = async (id, form) => {
    var Query = `update nominee set n_form=? where n_id=?`;
    var data = await query(Query, [form, id]);
    return data;
}
