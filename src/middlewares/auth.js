const jwt = require('jsonwebtoken')
const User = require('../models/user')
const hash = require('bcryptjs')
require('dotenv').config()

const {
    APP_SECRET
} = process.env

function getToken(payload) {
    return jwt.sign(payload, APP_SECRET)
}
function getPayload(token){
    return jwt.verify(token, APP_SECRET)
}

module.exports.jwtLogin = async (req, res, next) => {
    const { username, password } = req.body
    if(!username || !password)return res.json({
        success: false,
        message: 'invalid data'
    })
    try {
        const user = await User.findOne({username})
        if(!user) return res.json({
            success: false,
            message: 'could not authenticate'
        })
        const isPasswordMatch = await hash.compare(password, user.password)
        if(!isPasswordMatch)return res.json({
            success: false,
            message: 'could not authenticate'
        })

        //DEVICE
        const device = req.headers['user-agent']
        //DEVICE

        const token = getToken({_id: user._id.toString()})
        user.auth = user.auth.concat({ token, ip: req.ip, device })
        await user.save()
        res.json({
            success: true,
            message: 'logged in',
            token
        })
    } catch (error) {
        next(error)
    }
}

module.exports.jwtAuthenticationMiddleware = async (req, res, next) => {
    try {
        let {authorization: token} = req.headers
        if(!token) return next()
        token = token.replace('Bearer ','')

        //DEVICE
        const device = req.headers['user-agent']
        //DEVICE
        
        const { _id } = getPayload(token)
        const user = await User.findOne({_id, 'auth.token': token, 'auth.ip': req.ip, 'auth.device': device})
        if(user){
            req.user = user
            req.auth = {token, ip: req.ip, device}
        }
        next()
    } catch (error) {
        next(error)
    }
}

module.exports.isAuthenticatedMiddleware = async (req, res, next) => {
    const {driverapp}  = req.headers
    if(!req.user){
        if(driverapp === 'react_app')return res.json({
            success: false,
            message: 'not authenticated'
        })
        return res.send(`
            <h1>Forbidden: 403</h1>
            <hr/>
        `)
    }
    next()
}

module.exports.loggedInDevices = async (req, res, next) => {
    const loggedDevices = req.user.auth.map(auth => {
        auth = auth.toObject()
        delete auth.token
        return auth
    })
    res.json({
        loggedDevices
    })
}

module.exports.jwtlogout = async (req, res, next) => {
    try {
        req.user.auth = req.user.auth.filter(auth => auth.token !== req.auth.token)
        await req.user.save()
        res.json({
            success: true,
            message: 'logged out'
        })
    } catch (error) {
        next(error)
    }
}
module.exports.jwtlogoutAll = async (req, res, next) => {
    try {
        req.user.auth = []
        await req.user.save()
        res.json({
            success: true,
            message: 'logged out from all devices'
        })
    } catch (error) {
        next(error)
    }
}