const User = require('../models/user')
const sharp = require('sharp')

module.exports.addUser = async (req, res, next) => {
    const user = new User(req.body)
    try {
        const userEmailExists = await User.findOne({email: user.email})
        const userUsernameExists = await User.findOne({username: user.username})
        if(userEmailExists) throw Error('Error: email exists')
        if(userUsernameExists) throw Error('Error: username exists')
        await user.save()
        res.json({
            success: true,
            user
        })
    } catch (error) {
        next(error)
    }
}

module.exports.getUser = async (req, res, next) => {
    res.json({
        user: req.user
    })
}

module.exports.updateUser = async (req, res, next) => {
    try {
        const { params } = req.body
        if(!params)throw new Error('Error: invalid parameters')
        const allowedUpdates = ['email', 'name', 'password']
        const updates = params.filter(update => allowedUpdates.includes(update))
        updates.forEach(update => {
            req.user[update] = update
        })
        await req.user.save()
        res.json({
            success: true,
            message: 'changes saved'
        })
    } catch (error) {
        next(error)
    }
}

// ADDING USER AVATAR
module.exports.uploadUserAvatar = async (req, res, next) => {
    try {
        const imageBuffer = await sharp(req.file.buffer).resize({ height: 300, width: 300 }).png().toBuffer()
        req.user.avatar = imageBuffer
        await req.user.save()
        res.json({
            success: true,
            message: 'avatar uploaded'
        })
    } catch (error) {
        next(error)
    }
}
// GETTING USER AVATAR
module.exports.getUserAvatar = async (req, res, next) => {
    try {
        if(!req.user.avatar)return res.json({
            success: false
        })
        res.set('Content-Type','image/png')
        res.send(req.user.avatar)
    } catch (error) {
        next(error)
    }
}

module.exports.deleteUser = async (req, res, next) => {
    try {
        await req.user.remove()
        res.json({
            success: true,
            message: 'account deleted'
        })
    } catch (error) {
        next(error)
    }
}