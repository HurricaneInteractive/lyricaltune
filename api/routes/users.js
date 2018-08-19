const express = require('express')
const router = express.Router()
const User = require('../models/User')
const UserController = require('../controllers/UserController')
const CheckAuthentication = require('../middleware/CheckAuthentication')

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

// GET
router.get('/username/:username', UserController.getUserByUsername)
router.get('/id/:id', UserController.getUserById)
router.get('/current', CheckAuthentication, UserController.getCurrentUser)

// POST
router.post('/register', UserController.registerUser)
router.post('/login', UserController.loginUser)
router.post('/follow', CheckAuthentication, UserController.followUser)
router.post('/unfollow', CheckAuthentication, UserController.unfollowUser)
router.post('/logout', CheckAuthentication, UserController.logoutUser)

// PATCH
router.patch('/update', CheckAuthentication, UserController.updateUser)

module.exports = router