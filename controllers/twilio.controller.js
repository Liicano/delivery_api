/* eslint-disable no-underscore-dangle */
/* eslint-disable no-const-assign */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
const debug = require('debug')('api:v1:controllers:twilio')
/**
 * Utils
 */
const { asyncHandler } = require('../utils')
/**
 * Services
 */
const { TwilioService } = require('../services')

// enviar codigo de validacion al celular o email
const postSendVerificationCode = asyncHandler(async (req, res, next) => {
    debug('post /api/v1/clientes/send-verification-code')
    /**
     * Reception
     */
    let response = {}
    if (typeof req.body.email !== 'undefined') {
        // todo
    } else if (typeof req.body.phone !== 'undefined') {
        response = await TwilioService.verifications(req.body.phone)
    }
    res.status(200).json(response)
})

// revisar si el codigo de validacion coincide con el que se envió
const postCheckVerificationCode = asyncHandler(async (req, res, next) => {
    /**
     * Reception
     */
    let response = {}
    if (typeof req.body.code !== 'undefined') {
        if (req.body.code.length === 6) {
            if (typeof req.body.email !== 'undefined') {
                // todo
            } else if (typeof req.body.phone !== 'undefined') {
                response = await TwilioService.verificationChecks(req.body.phone, req.body.code)
            }
        }
    }
    res.status(200).json(response)
})

module.exports = {
    postSendVerificationCode,
    postCheckVerificationCode,
}
