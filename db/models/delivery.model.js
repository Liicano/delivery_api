const mongoose = require('mongoose')

const {
    Schema
} = mongoose
// const storeSchema = new Schema({
//     id: String,
// }, { _id: false })

// const productSchema = new Schema({
//     id: String,
//     quantity: Number,
//     cost: Number,
//     picture: String,
//     comments: String,
// }, { _id: false })

// const orderSchema = new Schema({
//     status: {
//         type: String,
//         enum: ['solicitado', 'pagado', 'confirmado', 'rechazado e', 'en camino', 'rechazado d', 'entregado', 'cerrado', 'reclamo'],
//         default: 'solicitado',
//     },
//     number: Number,
//     store: {
//         type: storeSchema,
//     },
//     product: {
//         type: [productSchema],
//     },
//     location: {
//         type: {
//             type: String,
//             enum: ['Point'],
//             default: 'Point',
//         },
//         coordinates: {
//             type: [Number], // [longitud, latitud]
//         },
//     },
//     address: String,
//     totalCost: Number,
//     timeDelivery: Number,
//     costDelivery: Number,
//     paymentMethod: {
//         type: String,
//         enum: ['visa', 'yape', 'plin'],
//     },
//     comments: String,
// }, {
//     timestamps: {
//         createdAt: 'createdAt',
//         updatedAt: 'updatedAt',
//     },
//     _id: false,
// })

const deliverySchema = new Schema({
    name: {
        firstName: {
            type: String,
            default: '',
        },
        lastName: {
            type: String,
            default: '',
        },
    },
    identity_document: {
        type: String,
        default: '',
    },
    isActive: {
        type: Boolean,
        default: false
    },
    phone: {
        prefix: {
            type: String,
            default: '',
        },
        number: {
            type: String,
            default: '',
        },
    },
    email: {
        type: String,
        default: '',
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        default: '',
    },
    addressReference: {
        type: String,
        default: '',
    },
    current_location: {
        lat: {
            type: String,
            default: 0
        },
        lng: {
            type: String,
            default: 0
        }
    },
    notificationToken: {
        type: String,
        default: ''
    },
    userPicture: {
        type: String,
        default: 'https://adncultura.org/sites/default/files/styles/mg_user_picture/public/default_images/default-user.png',
    },
    lastOrder: {
        type: String,
    },
    orders: {
        type: Array,
        default: [],
    },
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    },
    versionKey: false,
})

// clientsSchema.index({ location: '2dsphere' })

module.exports = mongoose.model('delivery', deliverySchema, 'delivery')