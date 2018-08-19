const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../../models/User')
const ResponseHelper = require('../../helpers/ResponseHelper')
const SignUserToken = require('./GenerateJWT').signUserToken

/**
 * Handle User Registration
 * 
 * @param {Express Request} req 
 * @param {Express Response} res 
 * @param {Express Next} next 
 */
module.exports = (req, res, next) => {
    let email = req.body.email
    
    // Tries to find a user with the submitted email    
    User.findOne({ email: email }).exec()
        .then(user => {
            if (user !== null) {
                // Handles response if found
                ResponseHelper.emailFound(next)
            }
            else {
                let username = req.body.username;
                // Tried to find a user with the submitted username
                User.findOne({username: username}).exec()
                    .then(user => {
                        if (user !== null) {
                            // Handles response if found
                            ResponseHelper.usernameFound(next)
                        }
                        else {
                            let password = req.body.password;
                            // Attempts to hash the submitted password
                            bcrypt.hash(password, 10, (err, hash) => {
                                if (err) {
                                    // Handles the error response
                                    ResponseHelper.returnedError(res, err)
                                }
                                else {
                                    // Creates a new user Object
                                    let newUser = new User({
                                        _id: new mongoose.Types.ObjectId,
                                        email: email,
                                        password: hash,
                                        name: req.body.name,
                                        username: username,
                                        role: "author"
                                    })

                                    // Saves the user to the database
                                    newUser.save()
                                        .then(createdUser => {
                                            // Respond if created successfully
                                            // Creates a JWT token and returns either an error or a success response
                                            SignUserToken(createdUser.prepareResponse(), (error, token) => {
                                                if (error) {
                                                    ResponseHelper.returnedError(res, error)
                                                }
                                                else {
                                                    ResponseHelper.userCreated(res, {
                                                        token: token,
                                                        current_user: createdUser.prepareResponse()
                                                    })
                                                }
                                            })
                                        })
                                        .catch(e => {
                                            // Handles any errors
                                            ResponseHelper.returnedError(res, e)
                                        })
                                }
                            })
                        }
                    })
                    .catch(e => {
                        // Handles any errors
                        ResponseHelper.returnedError(res, e)
                    })
            }
        })
        .catch(e => {
            // Handles any errors
            ResponseHelper.returnedError(res, e)
        })
}
