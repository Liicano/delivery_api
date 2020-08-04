/* eslint-disable newline-per-chained-call */
const router = require('express').Router()
const { body } = require('express-validator')
const { JWT } = require('../middlewares')
/**
 * Utils
 */
const { validateErrors } = require('../utils')
/**
 * Controllers
 */
const { DeliveryController } = require('../controllers')

router.post('/', [
    body('userPicture')
        .optional().isURL().withMessage('INVALID_VALUE'),
    body('email')
        .optional().isEmail().withMessage('INVALID_VALUE'),
    body('password')
        .exists().withMessage('REQUIRED_FIELD_MISSING').bail()
        .isLength({ min: 8 }).withMessage('MINIMUM_LENGTH_ERROR'),
], [
    validateErrors,
    DeliveryController.post,
])

router.post('/login', [
    body('email')
        .optional().isEmail().withMessage('INVALID_VALUE'),
    body('by')
        .optional().isIn(['facebook', 'google']).withMessage('INVALID_VALUE'),
], [
    validateErrors,
    DeliveryController.postLogin,
])

router.post('/check-exist', [
    body('email')
        .optional().isEmail().withMessage('INVALID_VALUE'),
], [
    validateErrors,
    DeliveryController.postCheckExist,
])

router.post('/change-password', [
    body('email')
        .optional().isEmail().withMessage('INVALID_VALUE'),
    body('newPassword')
        .exists().withMessage('REQUIRED_FIELD_MISSING').bail()
        .isLength({ min: 8 }).withMessage('MINIMUM_LENGTH_ERROR'),
], [
    validateErrors,
    DeliveryController.postChangePassword,
])

router.get('/', [
    DeliveryController.get,
])


// RECIBIR ORDEN DESDE EL PROVEEDOR
router.post('/sendOrder', [
    DeliveryController.sendOrder,
])

// ACTUALIZAR DELIVERY (USER)
router.put('/:_id', [
    DeliveryController.updateUser,
])

// GET BY ID
router.get('/:_id', [
    DeliveryController.getDelivery,
])
// GET BY IDENTITY
router.get('/document/:identity', [
    DeliveryController.getDeliveryByIdentity,
])


module.exports = router

// 1-1810453604