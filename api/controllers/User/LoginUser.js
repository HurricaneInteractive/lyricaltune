const bcrypt = require('bcryptjs')

const User = require('../../models/User')
const ResponseHelper = require('../../helpers/ResponseHelper')
const SignUserToken = require('./GenerateJWT').signUserToken

module.exports = (req, res, next) => {
    let email = req.body.email
    // Attempts to find a user with the email
    User.findOne({ email: email }).exec()
        .then(user => {
            // if there isn't a user, return a fail response
            if (user === null) {
                ResponseHelper.loginFailed(next)
            }
            else {
                // compare the password to the hashed password
                bcrypt.compare(req.body.password, user.password)
                    .then(match => {
                        // if it doesn't match, return a fail response
                        if (match === false) {
                            ResponseHelper.loginFailed(next)
                        }
                        else {
                            // Create a Token
                            SignUserToken(user.prepareResponse(), (error, token) => {
                                if (error) {
                                    ResponseHelper.returnedError(res, error)
                                }
                                else {
                                    // Return the token along with the user data
                                    ResponseHelper.loginSuccessful(res, {
                                        token: token,
                                        current_user: user.prepareResponse()
                                    })
                                }
                            })
                        }
                    })
                    // Return error object
                    .catch(e => ResponseHelper.returnedError(res, e))
            }
        })
        // Return error object
        .catch(e => Response.returnedError(res, e))
}