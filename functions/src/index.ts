import * as functions from 'firebase-functions';
import admin = require('firebase-admin');
admin.initializeApp()
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const orderstatus = functions.database.ref("Admin/Orders/{userid}/{orderid}")
    .onWrite((snapshot, context) => {
        const data = snapshot.after.val()
        const promises = []
        console.log("data", data)
        const status = data["status"]
        if (status == "1") {
            const ref = admin.database().ref("/users/" + context.params.userid + "/token")
            const pr = ref.once("value", (tokensnap) => {
                const payload = {
                    notification: {
                        title: "You have received a message from  GoodFood",
                        body: "Your order is in processing"
                    }
                }
                console.log("token", tokensnap.val())
                const datasnap = admin.messaging().sendToDevice(tokensnap.val(), payload)
                    .then((aprsnap) => { return aprsnap })
                    .catch((aprerror) => { return aprerror })
                promises.push(datasnap)
            })
                .then((prsnap) => { return prsnap })
                .catch((prerror) => { return prerror })
            promises.push(pr)
        }
        return Promise.all(promises)
    })
