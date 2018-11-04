require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const userRoutes = require('./routes/users')
const phrasesRoutes = require('./routes/phrases')
const beatRoutes = require('./routes/beats')
const variousRoutes = require('./routes/various')

// Connect to mongo database
mongoose.connect('mongodb+srv://ucdt_lyrical:' + process.env.DB_CLUSTER_PW + '@lyricaltune-alyu8.mongodb.net/db_lyrical?retryWrites=true', {
    useNewUrlParser: true
})

// setup app settings
var app = express()
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Routes will go here
app.use('/users', userRoutes)
app.use('/phrases', phrasesRoutes)
app.use('/beats', beatRoutes)
app.use('/', variousRoutes)

// Catch All Error
app.use((req, res, next) => {
    const error = new Error('Route not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message,
            status: error.status || 500
        }
    })
})

module.exports = app;