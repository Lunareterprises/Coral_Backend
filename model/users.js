var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.getUser = async (user_id) => {
    var Query = `select * from users
    where u_id = ?`;
    var data = await query(Query, [user_id]);
    return data;
};

module.exports.addReferralCode = async (user_id, referral_code) => {
    let Query = `update users set u_referredCode = ? where u_id = ?`;
    let data = await query(Query, [referral_code, user_id]);
    return data
}

module.exports.verifyReferralCode = async (referral_code) => {
    let Query = `select * from users where u_referralCode = ?`;
    let data = await query(Query, [referral_code]);
    return data
}

module.exports.createPaymentHistory = async (userId, amount, currency, paymentIntentId, clientSecret, description = '') => {
    // Insert new payment record into payment_history table
    const query = `
            INSERT INTO payment_history (user_id, amount, currency, payment_intent_id, client_secret, payment_status, description)
            VALUES (?,?,?, ?,?,?,?)
        `;

    const values = [
        userId,
        amount * 100,  // Convert amount to cents
        currency,
        paymentIntentId,
        clientSecret,
        'pending',  // Initial status is pending
        description
    ]

    return await db.query(query, values);
};