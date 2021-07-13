const router = require('express').Router()
const controller = require('../controllers/user.controller')
const { jwtLogin, jwtAuthenticationMiddleware, isAuthenticatedMiddleware, jwtlogout, jwtlogoutAll, loggedInDevices } = require('../middlewares/auth')
const { upload } = require('../middlewares/upload')

// LOGIN API
router.post('/user/login', jwtLogin)
// AUTHS API
router.use(jwtAuthenticationMiddleware)
// USER API
router.route('/user')
.post(controller.addUser)
.get(isAuthenticatedMiddleware, controller.getUser)
.put(isAuthenticatedMiddleware, controller.updateUser)
.delete(isAuthenticatedMiddleware, controller.deleteUser)
// UPLOADING & GETTING AVATAR
router.route('/user/avatar')
.post(isAuthenticatedMiddleware, upload.single('avatar') ,controller.uploadUserAvatar)
.get(isAuthenticatedMiddleware, controller.getUserAvatar)
// LOGOUT AND DEVICES API
router.get('/user/devices', isAuthenticatedMiddleware, loggedInDevices)
router.post('/user/logout', isAuthenticatedMiddleware, jwtlogout)
router.post('/user/logout/all', isAuthenticatedMiddleware, jwtlogoutAll)


module.exports = router