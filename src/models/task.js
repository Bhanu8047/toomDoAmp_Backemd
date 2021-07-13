const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    taskname: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    priority: {
        type: String,
        default: 'normal',
        enum: ['high','normal','low'],
        lowercase: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    deadline: {
        type: Date,
    },
    owner:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true
})

const Task = mongoose.model('Task', taskSchema)
module.exports = Task