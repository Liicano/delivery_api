/* eslint-disable no-empty */
/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */
const { ClientsModel } = require('../db/models')
/**
 * Utils
 */
const { stringOccurrences } = require('../utils')

const post = async (client) => {
    const errors = []
    if (typeof client.email === 'undefined' && typeof client.phone === 'undefined') {
        errors.push({ code: 'REQUIRED_FIELD_MISSING', location: 'body', description: 'email or phone is required as minimal' })
    } else {
        if (typeof client.email !== 'undefined') {
            const _client = await ClientsModel.findOne({ email: client.email }).lean()
            if (_client) errors.push({ code: 'FIELD_VALUE_ALREADY_EXIST', location: 'body', field: 'email' })
        }
        if (typeof client.phone !== 'undefined') {
            if (typeof client.phone.number === 'undefined') {
                errors.push({ code: 'REQUIRED_FIELD_MISSING', location: 'body', field: 'phone.number' })
            } else if (typeof client.phone.prefix === 'undefined') {
                errors.push({ code: 'REQUIRED_FIELD_MISSING', location: 'body', field: 'phone.prefix' })
            } else {
                const _client = await ClientsModel.findOne({ 'phone.prefix': client.phone.prefix, 'phone.number': client.phone.number }).lean()
                if (_client) errors.push({ code: 'FIELD_VALUE_ALREADY_EXIST', location: 'body', field: 'phone' })
            }
        }
    }
    if (errors.length > 0) throw new Error(JSON.stringify({ errors, status: 422 }))
}

const login = async (client) => {
    const errors = []
    if (typeof client.phone !== 'undefined') {
        if (typeof client.phone.number === 'undefined') {
            errors.push({ code: 'REQUIRED_FIELD_MISSING', location: 'body', field: 'phone.number' })
        } else if (typeof client.phone.prefix === 'undefined') {
            errors.push({ code: 'REQUIRED_FIELD_MISSING', location: 'body', field: 'phone.prefix' })
        }
    }
    if (errors.length > 0) throw new Error(JSON.stringify({ errors, status: 422 }))
}

const get = async (query) => {
    const errors = []
    if (typeof query.select !== 'undefined') {
        const commas = stringOccurrences(query.select, ',')
        const minus = stringOccurrences(query.select, '-')
        if (minus > 0) {
            if (commas !== minus - 1) {
                errors.push({
                    code: 'INVALID_VALUE',
                    location: 'query',
                    field: 'select',
                    description: 'In the select field you can only select or deselect, not both.',
                })
            }
        }
    }
    if (typeof query.sort !== 'undefined') {
        const commas = stringOccurrences(query.sort, ',')
        const minus = stringOccurrences(query.sort, '-')
        const plus = stringOccurrences(query.sort, '+')
        if (minus + plus > 0) {
            if (commas !== minus + plus - 1) {
                errors.push({
                    code: 'INVALID_VALUE',
                    location: 'query',
                    field: 'sort',
                    description: 'In the sort field, it is necessary to indicate whether it is asc (+) or desc (-) for each value.',
                })
            }
        } else if (minus + plus === 0) {
            errors.push({
                code: 'INVALID_VALUE',
                location: 'query',
                field: 'sort',
                description: 'In the sort field, it is necessary to indicate whether it is asc (+) or desc (-) for each value.',
            })
        }
    }
    if (errors.length > 0) throw new Error(JSON.stringify({ errors, status: 422 }))
}

const postSetLastOrder = async (order) => {

}

module.exports = {
    post,
    login,
    get,
    postSetLastOrder,
}
