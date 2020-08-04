/* eslint-disable no-plusplus */
/* eslint-disable no-constant-condition */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
const { validationResult } = require('express-validator')
const debug = require('debug')('api:v1:utils')
const _ = require('lodash')

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

const validateErrors = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) return next()
    const extractedErrors = []
    const orExtractedErrors = []
    let errorsArray = errors.array()
    if (_.keys(errorsArray[0]).includes('nestedErrors')) {
        errorsArray[0].nestedErrors.map((err) => orExtractedErrors.push({
            code: err.msg,
            location: err.location,
            field: err.param,
        }))
        errorsArray = _.slice(errorsArray, 1)
        extractedErrors.push({
            $or: orExtractedErrors,
        })
    }
    errorsArray.map((err) => extractedErrors.push({
        code: err.msg,
        location: err.location,
        field: err.param,
    }))
    return res.status(422).json({
        errors: extractedErrors,
    })
}

const stringOccurrences = (string, subString, allowOverlapping = false) => {
    string += ''
    subString += ''
    if (subString.length <= 0) return (string.length + 1)
    let n = 0
    let pos = 0
    const step = allowOverlapping ? 1 : subString.length
    while (true) {
        pos = string.indexOf(subString, pos)
        if (pos >= 0) {
            ++n
            pos += step
        } else break
    }
    return n
}

module.exports = {
    asyncHandler,
    validateErrors,
    stringOccurrences,
}
