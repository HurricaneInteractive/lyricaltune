const User = require('../../models/User')
const ResponseHelper = require('../../helpers/ResponseHelper')
const SignUserToken = require('./GenerateJWT').signUserToken

module.exports = (req, res, next) => {
    let current_user = req.jwt_user,
        id = req.body.id

    // Checks if the current users following does NOT contain the target user id
    if (current_user.following.indexOf(id) !== -1) {
        // Attempts to find the target user
        User.findOne({ _id: id }).exec()
            .then(target_user => {
                if (target_user === null) {
                    // Could not find target user
                    ResponseHelper.noUserWithId(id, next)
                }
                else {
                    // res.status(200).json({ msg: 'target found' })
                    // Updates the current user following array
                    // Updated the target user followers array (If the current user id is in it's followers array)
                    let updates = [User.findByIdAndUpdate(current_user._id, { $pull: { following: id } }, {new: true}).exec()]
                    if (target_user.followers.indexOf(current_user._id) !== -1) {
                        updates.push(User.findByIdAndUpdate(id, { $pull: { followers: current_user._id } }, {new: true}).exec())
                    }
                    
                    Promise.all(updates)
                        .then(values => {
                            let updated_current_user = values[0]
                            // Signs a new token containing the updated user document
                            SignUserToken(updated_current_user.prepareResponse(), (error, token) => {
                                if (error) {
                                    ResponseHelper.returnedError(res, error)
                                }
                                else {
                                    // Returns the token as well as a new object
                                    ResponseHelper.unfollowSucceed(res, {
                                        token: token,
                                        current_user: updated_current_user.prepareResponse()
                                    })
                                }
                            })
                        })
                        .catch(e => ResponseHelper.returnedError(res, e))
                }
            })
            .catch(e => ResponseHelper.returnedError(res, e))
    }
    else {
        ResponseHelper.notFollowingUser(next)
    }
}