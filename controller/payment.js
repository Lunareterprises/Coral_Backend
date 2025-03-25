const userModel = require('../model/users')
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51QTPFIFEOzMlpKTYdMFvHKBbgmNmRuoqrvqkCkHhShpP92RVtGHGG99uHeqxKouLD3FKvPMbhwfHJpKXTRkw44DK00HCUeC1DZ');


module.exports.createClientSecret = async (req, res) => {

    try {
        let { user_id } = req.headers
        if (!user_id) {
            return res.send({
                result: false,
                message: "User id is required"
            })
        }
        let userData = await userModel.getUser(user_id)
        if (userData.length === 0) {
            return res.send({
                result: false,
                message: "User not found"
            })
        }
        let { amount } = req.body
        if (!amount) {
            return res.send({
                result: false,
                message: "Amount is required"
            })
        }
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: userData[0].u_currency,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                user_id
            }
        });
        if (paymentIntent) {
            await userModel.createPaymentHistory(user_id, amount, userData[0]?.u_currency, paymentIntent?.id, paymentIntent?.client_secret)
            return res.send({
                result: true,
                clientSecret: paymentIntent.client_secret
            })
        } else {
            return res.send({
                result: false,
                message: "Payment failed!"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })

    }
}

module.exports.getPaymentDetails = async (req, res) => {
    try {
        let { user_id } = req.headers
        if (!user_id) {
            return res.send({
                result: false,
                message: "User id is required"
            })
        }
        let userData = await userModel.getUser(user_id)
        if (userData.length === 0) {
            return res.send({
                result: false,
                message: "User not found"
            })
        }
        const paymentIntent = await stripe.paymentIntents.retrieve(
            'pi_3R2r6vFEOzMlpKTY1HQReHbN'
        );
        if (paymentIntent) {
            return res.send({
                result: true,
                message: "Data retrived successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "No data found"
            })
        }
    } catch (error) {
        console.log(error.message)
        return res.send({
            result: false,
            message: error.message
        })
    }
}