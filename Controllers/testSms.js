const { Vonage } = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: "0d5dd3ec",
  apiSecret: "3vQStC3i1VFexes7"
})

const digitCode = Math.floor(1000 + Math.random() * 9000).toString();

const from = "Vonage APIs"
const to = "2250103087120"
const text = `Votre code de réservation est : ${digitCode}`;

async function sendSMS() {
    await vonage.sms.send({to, from, text})
        .then(resp => { console.log('Message sent successfully'); console.log(resp); })
        .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
}

sendSMS();