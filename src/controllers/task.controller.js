const Task = require('../models/task')

module.exports.addTask = async (req, res, next) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.json({
            success: true,
            message: 'sucessfully created a new task',
            task
        })
    } catch (error) {
        next(error)
    }
}

module.exports.getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({owner: req.user._id})
        res.json({
            success: true,
            tasks
        })
    } catch (error) {
        next(error)
    }
}

module.exports.getTask = async (req, res, next) => {
    const {key} = req.body
    try {
        const task = await Task.findOne({ _id: key, owner: req.user._id })
        if(!task) throw new Error('Error: task not found')
        res.json({
            success: true,
            task
        })
    } catch (error) {
        next(error)
    }
}

module.exports.updateTask = async (req, res, next) => {
    try {
        const { key } = req.body
        if(!req.body.params)throw new Error('Error: invalid parameters')
        // validating updates
        const params = Object.keys(req.body.params)
        const allowedUpdates = ['taskname','description', 'priority', 'deadline']
        const updates = params.filter(update => allowedUpdates.includes(update))
        // querying task
        const task = await Task.findOne({_id: key, owner: req.user._id})
        if(!task) throw new Error('Error: task not found')
        updates.forEach(update => task[update] = req.body.params[update])
        await task.save()
        res.json({
            success: true,
            message: 'changes saved',
            task
        })
    } catch (error) {
        next(error)
    }
}

module.exports.completed = async (req, res, next) => {
    try {
        const {key} = req.body
        const task = await Task.findOne({_id: key, owner: req.user._id})
        if(!task)throw new Error('Error: task not updated')
        task.completed = !task.completed
        await task.save()
        res.json({
            success: true,
            message: 'task updated'
        })
    } catch (error) {
        next(error)
    }
}

module.exports.deleteTask = async (req, res, next) => {
    const {key} = req.body
    try {
        const task = await Task.findOneAndDelete({_id: key, owner: req.user._id})
        if(!task)throw new Error('Error: task not found')
        res.json({
            success: true,
            message: 'task deleted'
        })
    } catch (error) {
        next(error)
    }
}