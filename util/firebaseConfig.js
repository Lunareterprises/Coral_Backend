var admin = require("firebase-admin");
let Notification = require('../util/saveNotification')

var serviceAccount = require(process.env.FIREBASE_PATH);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


module.exports.SendMessage = async (userId, type, message) => {
    try {
        let userTokens = await Notification.getUserTokens(userId)
        userTokens.forEach(async (el) => {
            const payload = {
                token: el.fcm_token,
                notification: {
                    title: type, // Title of the notification
                    body: message,             // Body/content of the notification
                },
            };
            try {
                let response = await admin.messaging().send(payload)
                console.log("response : ", response)
            } catch (error) {
                console.log("error : ", error.message)
            }
        })
    } catch (error) {
        return error
    }
}