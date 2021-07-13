const mongoose = require('mongoose')
const hash = require('bcryptjs')
const Task = require('./task')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: function(value){
            if(!value.includes('@') || !value.includes('.'))
                throw new Error(`invalid email: ${value}`)
        }
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate(value){
            if(value.toLowerCase().includes('password')) throw new Error('conatins "password"!')
        }
    },
    avatar: {
        type: Buffer
    },
    auth: [{
        token: {
            type: String,
            required: true
        },
        ip: {
            type: String,
            required: true
        },
        device: {
            type: String,
            required: true
        }
    }]
},{
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.auth
    delete userObject.avatar

    return userObject
}

userSchema.pre('save', async function (next){
    const user = this
    if(user.isModified('password')) user.password = await hash.hash(user.password, 10)
    next()
})

userSchema.pre('remove', async function (next){
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})

const User = mongoose.model('User', userSchema)
module.exports = User