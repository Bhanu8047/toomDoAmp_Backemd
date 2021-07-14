const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const { error } = require('./controllers/error.controller')
const { _404_ } = require('./controllers/_404_.controller')

const app = express()

app.set('trust proxy')
app.use(cors())
app.use(helmet())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(morgan('tiny'))

app.use('/api', require('./routers/user'))
app.use('/api', require('./routers/task'))

app.use(error)
app.all('*',_404_)

module.exports = app
