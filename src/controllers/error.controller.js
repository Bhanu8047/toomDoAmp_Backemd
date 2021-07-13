module.exports.error = (error, req, res, next) => {
    if(error.staus) {
        return res.status(error.status).json({
            error: error.message,
            stack: process.env.NODE_ENV === 'production' ? '' : error.stack
        })
    } else {
        return res.status(500).json({
            error: error.message,
            stack: process.env.NODE_ENV === 'production' ? '' : error.stack
        })
    }
}