const multer = require('multer')


const MAX_SIZE = 1024 * 1024 * 10
const upload = multer({
    limits: {
        fileSize: MAX_SIZE
    },
    fileFilter: (req, file, next) => {
        if(!file.originalname.match(/\.(jpeg|jpg|png)$/)) return next(new Error({
            error: 'Error: invalid image-type'
        }), false)
        next(null, true)
    }
})

module.exports = {
    upload
}