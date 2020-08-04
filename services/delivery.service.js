/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
const debug = require('debug')('api:v1:services:clients')
const _ = require('lodash')
const bcrypt = require('bcrypt')
/**
 * Db
 */
const {
    DeliveryDb
} = require('../db')
/**
 * Configs
 */
const {
    DEFAULT_PASSWORD
} = require('../configs')
const {
    DeliveryService
} = require('.')

const create = async (delivery) => {
    debug('create')
    delivery.password = await bcrypt.hash(delivery.password, 13)
    let _delivery = await DeliveryDb.create(delivery)
    _delivery = _delivery.toJSON()
    return _delivery
}

const checkExistDelivery = async (delivery) => {
    debug('checkExistDelivery')
    const response = {
        exist: false
    }
    const errors = []
    let _delivery
    if (typeof delivery.email !== 'undefined') {
        _delivery = await DeliveryDb.checkExistDelivery(delivery.email)
    } else if (typeof delivery.phone !== 'undefined') {
        _delivery = await DeliveryDb.checkExistDelivery(delivery.phone, 'phone')
    } else {
        errors.push({
            code: 'VALUE_NOT_FOUND',
            location: 'body',
            field: 'phone or email is required',
        })
    }
    if (_delivery) response.exist = true
    if (errors.length > 0) throw new Error(JSON.stringify({
        errors,
        status: 400
    }))
    return response
}

const changePassword = async (delivery) => {
    debug('changePassword')
    const response = {
        changed: false
    }
    const errors = []
    delivery.newPassword = await bcrypt.hash(delivery.newPassword, 13)
    if (typeof delivery.email !== 'undefined') {
        response.changed = true
        await DeliveryDb.changePassword(delivery.email, delivery.newPassword)
    } else if (typeof delivery.phone !== 'undefined') {
        response.changed = true
        await DeliveryDb.changePassword(delivery.phone, delivery.newPassword)
    } else {
        errors.push({
            code: 'VALUE_NOT_FOUND',
            location: 'body',
            field: 'phone or email is required',
        })
    }
    if (errors.length > 0) throw new Error(JSON.stringify({
        errors,
        status: 400
    }))
    return response
}

const login = async (delivery) => {
    debug('login')
    const errors = []
    let _delivery
    if (typeof delivery.email !== 'undefined') {
        _delivery = await DeliveryDb.login(delivery.email)
        if (!_delivery) {
            if (typeof delivery.by === 'undefined') {
                errors.push({
                    code: 'VALUE_NOT_FOUND',
                    location: 'body',
                    field: 'email',
                })
            }
        }
    } else if (typeof delivery.phone !== 'undefined') {
        _delivery = await DeliveryDb.login(delivery.phone, 'phone')
        if (!_delivery) {
            errors.push({
                code: 'VALUE_NOT_FOUND',
                location: 'body',
                field: 'phone',
            })
        }
    }
    if (typeof delivery.by !== 'undefined') {
        if (!_delivery) {
            delivery.password = DEFAULT_PASSWORD
            _delivery = await create(delivery)
        }
    } else if (typeof delivery.password !== 'undefined') {
        const matchPassword = await bcrypt.compare(delivery.password, _delivery.password)
        if (!matchPassword) {
            errors.push({
                code: 'WRONG_PASSWORD',
                location: 'body',
                field: 'password',
            })
        }
    } else {
        errors.push({
            code: 'REQUIRED_FIELD_MISSING',
            location: 'body',
            field: 'password',
            description: 'Password or Facebook/Google is required',
        })
    }
    if (errors.length > 0) throw new Error(JSON.stringify({
        errors,
        status: 401
    }))
    _.unset(_delivery, 'password')
    return _delivery
}

const read = async (query) => {
    debug('read')

    const options = {}
    console.log(query);
    options.query = query.query;
    if (typeof query.select !== 'undefined') {
        options.select = query.select.split(',').join(' ')
    }
    if (typeof query.sort !== 'undefined') {
        const sort = query.sort.split(',')
        options.sort = {}
        for (const s of sort) {
            if (s.includes('+')) options.sort[`${_.replace(s, '+', '')}`] = 1
            else if (s.includes('-')) options.sort[`${_.replace(s, '-', '')}`] = -1
        }
    }
    const _clients = await DeliveryDb.read(options)
    return _clients
}

const readOne = async (_id) => {
    debug('readOne')
    const delivery = await DeliveryDb.readOne(_id)
    return delivery
}
const readOneByDocument = async (document) => {
    debug('readOneByDocument')
    const delivery = await DeliveryDb.readOneByDocument(document)
    return delivery
}

const updateUserData = async (_id, payload) => {
    debug('updateUserData')
    const delivery = await DeliveryDb.changeUserData(_id, payload)
    return delivery;
}

module.exports = {
    create,
    login,
    read,
    checkExistDelivery,
    changePassword,
    readOne,
    readOneByDocument,
    updateUserData
}