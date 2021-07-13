const router = require('express').Router()
const controller = require('../controllers/task.controller')
const { jwtAuthenticationMiddleware, isAuthenticatedMiddleware } = require('../middlewares/auth')

router.use(jwtAuthenticationMiddleware)

router.route('/task')
.post(isAuthenticatedMiddleware, controller.addTask)
.get(isAuthenticatedMiddleware, controller.getTask)
.put(isAuthenticatedMiddleware, controller.updateTask)
.delete(isAuthenticatedMiddleware, controller.deleteTask)

router.get('/tasks', isAuthenticatedMiddleware, controller.getTasks)

module.exports = router