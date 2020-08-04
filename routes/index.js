const express = require('express')

const router = express.Router()

const DeliveryRouter = require('./delivery.router')

router.use('/delivery', DeliveryRouter)

const { TwilioController } = require('../controllers')

router.post('/send-verification-code', [
    TwilioController.postSendVerificationCode,
])

router.post('/check-verification-code', [
    TwilioController.postCheckVerificationCode,
])

module.exports = router
