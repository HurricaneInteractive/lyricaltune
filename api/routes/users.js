const express = require('express')
const router = express.Router()
const User = require('../models/User')
const UserController = require('../controllers/UserController')

router.get('/', (req, res, next) => {
    User.find({ username: 'QuirkyTurtle' }).exec()
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(err => {
            console.log(err);
            let error = new Error('User fetching went wrong');
            error.status = 500;
            next(error)
        })
})

router.post('/register', UserController.register_user)

module.exports = router