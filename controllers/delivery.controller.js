/* eslint-disable no-underscore-dangle */
/* eslint-disable no-const-assign */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
const debug = require('debug')('api:v1:controllers:clients')
const jwt = require('jsonwebtoken')
// DISTANCE CALCULATOR
var distance = require('google-distance');
distance.apiKey = 'AIzaSyC7tNVnuAQeB698ypomLGMMYXV6ZYqzHi8';

// HTTP REQUEST PACKAGE
const https = require('https');
const axios = require('axios');

function searchClosestDriver(provider, users) {
    return new Promise(function (resolve, reject) {
        let users_order = [];
        let itemsN = 0;

        users.forEach(user => {
            distance.get({
                    index: 1,
                    origin: provider,
                    destination: `${user.current_location.lat},${user.current_location.lng}`
                },
                (err, data) => {
                    if (err) return console.log(err);
                    itemsN++;
                    if (itemsN === users.length) {
                        resolve(users_order);
                    }

                    users_order.push({
                        user: user,
                        distance: {
                            distance: data.distance,
                            distanceValue: data.distanceValue,
                            duration: data.duration,
                            text: {
                                origin: data.origin,
                                destination: data.destination
                            },
                            transport_type: data.mode
                        }
                    })
                });



        });



    })
}

/**
 * Configs
 */
const {
    JWT_KEY
} = require('../configs')
/**
 * Utils
 */
const {
    asyncHandler
} = require('../utils')
/**
 * Services
 */
const {
    DeliveryService
} = require('../services')
/**
 * Validations
 */
const DeliveryValidation = require('./delivery.validation')

// registro de cliente
const post = asyncHandler(async (req, res, next) => {
    debug('post /api/v1/delivery')
    /**
     * Reception
     */
    const delivery = req.body
    /**
     * Validation
     */
    await DeliveryValidation.post(delivery)
    const _delivery = await DeliveryService.create(delivery)
    res.status(200).json(_delivery)
})

const postCheckExist = asyncHandler(async (req, res, next) => {
    debug('post /api/v1/delivery/check-exist')
    /**
     * Reception
     */
    const delivery = req.body
    /**
     * Validation
     */
    await DeliveryValidation.login(delivery)
    const response = await DeliveryService.checkExistClient(delivery)
    res.status(200).json(response)
})

const postChangePassword = asyncHandler(async (req, res, next) => {
    debug('post /api/v1/delivery/change-password')
    /**
     * Reception
     */
    const delivery = req.body
    /**
     * Validation
     */
    await DeliveryValidation.login(delivery)
    const response = await DeliveryService.changePassword(delivery)
    res.status(200).json(response)
})

const postLogin = asyncHandler(async (req, res, next) => {
    debug('post /api/v1/delivery/login')
    /**
     * Reception
     */
    const delivery = req.body
    /**
     * Validation
     */
    await DeliveryValidation.login(delivery)
    const _delivery = await DeliveryService.login(delivery)
    const token = jwt.sign({
        email: _delivery.email,
        phone: _delivery.phone,
        clientId: _delivery._id,
    }, JWT_KEY, {
        expiresIn: '12h',
    })
    // _delivery.token = token
    res.status(200).json({
        delivery: _delivery,
        token
    })
})

const get = asyncHandler(async (req, res, next) => {
    debug('get /api/v1/delivery')
    /**
     * Reception
     */
    const {
        query
    } = req
    /**
     * Validation
     */
    await DeliveryValidation.get(query)
    const _clients = await DeliveryService.read(query)
    res.status(200).json(_clients)
})

const getDelivery = asyncHandler(async (req, res, next) => {
    debug('get /api/v1/delivery/:_id')
    /**
     * Reception
     */
    const {
        _id
    } = req.params
    const delivery = await DeliveryService.readOne(_id)
    res.status(200).json(delivery)
})

const getDeliveryByIdentity = asyncHandler(async (req, res, next) => {
    console.log('getDeliveryByIdentity');
    debug('get /api/v1/delivery/:identity')
    /**
     * Reception
     */
   
    const delivery = await DeliveryService.readOneByDocument({
        identity_document: req.params.identity
    })
    res.status(200).json(delivery)
})


const updateUser = asyncHandler(async (req, res, next) => {
    console.log('updateUser');
    debug('get /api/v1/:_id')
    /**
     * Reception
     */
//  TODO: NECESITO EL LOGIN XD
    const delivery = await DeliveryService.updateUserData({ _id: req.params._id, payload: req.user})
    res.status(200).json(delivery)
})



const sendOrder = asyncHandler(async (req, res, next) => {
    debug('get /api/v1/delivery/sendOrder')
    let provider_data = '-33.55,-70.68333';

    // BUSCAR USUARIOS ACTIVOS EN EL MOMENTO
    const delivery = await DeliveryService.read({
        query: {
            isActive: true
        },
        select: 'name,current_location,isActive,notificationToken'
    });


    let closest = await searchClosestDriver(provider_data, delivery);
    closest.sort((a, b) => (a.distance.distanceValue > b.distance.distanceValue) ? 1 : -1)

    console.log(closest[0].user.notificationToken);
    
    axios.post(
    'https://fcm.googleapis.com/fcm/send', {
        "notification": {
            "title": "Se te asigno un pedido.",
            "body": "Miguel Carrera 1284 - 4km - 25min"
        },
        "priority": "high",
        "data": {
            "click_action": "FLUTTER_NOTIFICATION_CLICK",
            "ORDER_ID": '123123123',
            "DISTANCE": closest[0].distance.distance,
            "DISTANCE_TIME": closest[0].distance.duration,
            "DISTANCE_DATA_ADDRESS": closest[0].distance.text.destination,
            "PAY": "18.00",
            "PROVIDER_NAME": "La panaderia de la esquina.",
            "PROVIDER_ADDRESS": "Pedro alarcon 963",
            "PROVIDER_LOCATION": {
                "lat": "-33.55",
                "lng": "-70.68333"
            },
            "CLIENT_ADDRESS": "Miguel carrera 1284",
             "CLIENT_LOCATION": {
                 "lat": "-36.55",
                 "lng": "-73.68333"
             },
            "NOTIFICATION_TYPE": "ORDER_ASIGNED",
            "CLIENT_NAME": "Jorge Villalobos",
            "CLIENT_PHONE": "948106304",
            "PRODUCTS_LIST": [{
                "PRODUCT_ID": "32132111",
                "PRODUCT_NAME": "CHAPSUI DE CARNE 1",
                "PRODUCT_QUANTITY": "1 Unidad",
                "PRODUCT_DESCRIPTION": "Chapsui de carne + Bebida",
                "PRODUCT_OBSERVATION": "Debe incluir 5 rollos primavera"
            }, {
                "PRODUCT_ID": "32132122",
                "PRODUCT_NAME": "CHAPSUI DE CARNE 2",
                "PRODUCT_QUANTITY": "1 Unidad",
                "PRODUCT_DESCRIPTION": "Chapsui de carne + Bebida",
                "PRODUCT_OBSERVATION": "Debe incluir 5 rollos primavera"
            }, {
                "PRODUCT_ID": "32132133",
                "PRODUCT_NAME": "CHAPSUI DE CARNE 3",
                "PRODUCT_QUANTITY": "1 Unidad",
                "PRODUCT_DESCRIPTION": "Chapsui de carne + Bebida",
                "PRODUCT_OBSERVATION": "Debe incluir 5 rollos primavera"
            }]
        },
        "to": closest[0].user.notificationToken,
    },

      {
          headers: {
              'Authorization': 'key=AAAAkyNtKhg:APA91bFBoXsrDrvsIhpBAEAakLdAPtS3-h1NfpV-2IAya0NHA1ZlN32IXFtoqJBl3M4AojYhbVKUbESQz59-I1ZV6iSmrG8hUkL7xhX4OelLEG1-G1S2__B-8vXJb1SA5lRmJ3TSvRqr',
              'Content-Type': 'application/json',
                 
              },
             
      },
     
    
  ).then(resp => {
      console.log(resp);
      res.status(200).json(closest[0]);
  }).catch(error => {
      res.status(401).json({
          error: error
      });
  });
  


   
})



module.exports = {
    post,
    postLogin,
    get,
    postCheckExist,
    postChangePassword,
    getDelivery,
    sendOrder,
    getDeliveryByIdentity,
    updateUser
}