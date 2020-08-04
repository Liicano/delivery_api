/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken')
const { JWT_KEY } = require('../configs')

const checkAuth = (req, res, next) => {
    const errors = []
    if (typeof req.headers.authorization !== 'undefined') {
        const authorization = req.headers.authorization.split(' ')
        if (authorization[0] !== 'Bearer') {
            errors.push({
                code: 'INVALID_VALUE',
                location: 'headers',
                field: 'authorization',
                description: 'Bearer not found',
            })
        } else {
            try {
                req.jwt = jwt.verify(authorization[1], JWT_KEY)
            } catch (e) {
                errors.push({
                    code: 'INVALID_TOKEN',
                    location: 'headers',
                    field: 'authorization',
                })
            }
        }
    } else {
        errors.push({
            code: 'NOT_FOUND',
            location: 'headers',
            field: 'authorization',
            description: 'Authorization not found',
        })
    }
    if (errors.length > 0) throw new Error(JSON.stringify({ errors, status: 401 }))
    next()
}

module.exports = {
    checkAuth,
}
