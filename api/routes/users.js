const express = require('express')
const router = express.Router()
const User = require('../models/User')
const UserController = require('../controllers/UserController')

router.get('/', (req, res, next) => {
    User.find().exec()
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

/** Testing route */
// router.delete('/', (req, res, next) => {
//     let id = req.body._id
//     User.deleteOne({ _id: id }).exec()
//         .then(response => {
//             console.log('user deleted')
//             res.status(200).json({
//                 message: 'deleted',
//                 res: response
//             })
//         })
//         .catch(e => {
//             let error = new Error('User deleting went wrong');
//             error.status = 500;
//             next(error)
//         })
// })

router.post('/register', UserController.registerUser)
router.post('/login', UserController.loginUser)
router.get('/:username', UserController.getUserByUsername)
router.get('/id/:id', UserController.getUserById)

module.exports = router