/* eslint-disable max-len */
const twilio = require('twilio')

const config = {
    serviceId: 'VA82683a5a441e9996fe9337869dc7ce4f',
    accountSid: 'AC3456876b63883d790270207cc9950223',
    authToken: 'c74ea72f5d3f8238ae455a753d8326f8',
}

const client = twilio(config.accountSid, config.authToken)

const verifications = async (to) => {
    const data = await client.verify.services(config.serviceId).verifications.create({ to, channel: 'sms' })
    return data
}

const verificationChecks = async (to, code) => {
    const data = await client.verify.services(config.serviceId).verificationChecks.create({ to, code })
    return data
}

module.exports = {
    verifications,
    verificationChecks,
}
