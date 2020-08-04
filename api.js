/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const debug = require('debug')('api:v1')
const _ = require('lodash')

/**
 * Routes
 */
const routes = require('./routes')
/**
 * Cons
 */
const { MOBILEAPPSETTINGS } = require('./configs')

const api = express()

api.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE')
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length')
    res.setHeader('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range, Origin')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE')
        return res.status(200).json({})
    }
    return next()
})

api.use(bodyParser.json())
api.use(bodyParser.json({ limit: '50mb' }))
api.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }))

api.use('/', express.static('public'))

// api.get('/', (req, res, next) => res.status(200).send('API Is Working!'))

api.get('/api/v1/settings', (req, res, next) => {
    res.status(200).json(MOBILEAPPSETTINGS)
})

api.use('/api/v1/doc-editor', express.static(`${__dirname}/swagger/editor`))
api.use('/api/v1/doc', express.static(`${__dirname}/swagger/doc`))

api.use('/api/v1', routes)

api.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

api.use((err, req, res, next) => {
    debug(err)
    if (err.message[0] === '{') {
        const error = JSON.parse(err.message)
        const { status } = error
        _.unset(error, 'status')
        res.status(status).json(error)
    } else {
        res.status(err.status || 500).json({ err, msg: err.msg })
    }
})

const run = async () => {
    try {
        api.set('port', 3000)
        await mongoose.connect(
            'mongodb://Liicano:h7369372@ds019886.mlab.com:19886/inventariodb',
             {
                 useUnifiedTopology: true,
                 useCreateIndex: true,
                 
             }, //useNewUrlParser: true,
        )
        debug('MongoDB Connected')
        api.listen(api.get('port'), () => {
            debug(`Server listening on port ${api.get('port')}`)
        }).setTimeout(180000000)
    } catch (e) {
        console.log(e);
        debug(`Error: ${e}`)
    }
}
run()
