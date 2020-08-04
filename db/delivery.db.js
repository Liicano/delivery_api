/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
const debug = require('debug')('api:v1:db:client')
const {
    DeliveryModel
} = require('./models')

const read = async (options) => {
    debug('read')
    let queryObj = options.query ? options.query : {};
    const query = DeliveryModel.find(queryObj)


    if (typeof options.select !== 'undefined') {
        query.select(options.select)
    };


    if (typeof options.sort !== 'undefined') {
        query.sort(options.sort)
    }


    const _delivery = await query.exec()
    return _delivery
}

const readOne = async (_id) => {
    debug('readOne')
    const delivery = await DeliveryModel.findById(_id).lean()
    return delivery
}

const readOneByDocument = async (document) => {
    debug('readOneByDocument')
    console.log('readOneByDocument -> ',document);
    const delivery = await DeliveryModel.find(document)
    return delivery
}

const changeUserData = async (_id, payload) => {
    debug('readOneByDocument')
    console.log('readOneByDocument -> ', _id);
    const delivery = await DeliveryModel.findByIdAndUpdate(_id, payload, {
        new: true
    })
    return delivery
}

const login = async (value, type = 'email') => {
    debug('login')
    let _delivery
    if (type === 'email') {
        _delivery = await DeliveryModel.findOne({
            email: value
        }).lean()
    } else if (type === 'phone') {
        _delivery = await DeliveryModel.findOne({
            'phone.prefix': value.prefix,
            'phone.number': value.number
        }).lean()
    }
    return _delivery
}

const create = async (client) => {
    debug('create')
    let _delivery = new DeliveryModel(client)
    _delivery = await _delivery.save()
    return _delivery
}

const checkExistDelivery = async (value, type = 'email') => {
    debug('checkExistDelivery')
    let _delivery
    if (type === 'email') {
        _delivery = await DeliveryModel.findOne({
            email: value
        }).lean()
    } else if (type === 'phone') {
        _delivery = await DeliveryModel.findOne({
            'phone.prefix': value.prefix,
            'phone.number': value.number
        }).lean()
    }
    return _delivery
}

const changePassword = async (value, newPassword, type = 'email') => {
    debug('changePassword')
    let _delivery
    if (type === 'email') {
        _delivery = await DeliveryModel.findOne({
            email: value
        })
    } else if (type === 'phone') {
        _delivery = await DeliveryModel.findOne({
            'phone.prefix': value.prefix,
            'phone.number': value.number
        })
    }
    _delivery.set('password', newPassword)
    _delivery.markModified('password')
    await _delivery.save()
}

module.exports = {
    create,
    login,
    read,
    checkExistDelivery,
    changePassword,
    readOne,
    readOneByDocument,
    changeUserData
}