const mongoose = require('mongoose')
require('dotenv').config()

const mongoConnectionHandler = (callback) => {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true
    }, (err)=>{
        if(err){
            callback(err)
        }else{
            callback(null)
        }
    })
}

module.exports = {
    mongoConnectionHandler
}