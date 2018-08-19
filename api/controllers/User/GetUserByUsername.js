const User = require('../../models/User')
const ResponseHelper = require('../../helpers/ResponseHelper')

module.exports = (req, res, next) => {
    let username = req.params.username
    User.findOne({ username: username }).exec()
        .then(user => {
            if (user === null) {
                ResponseHelper.noUserWithUsername(username, next)
            }
            else {
                ResponseHelper.userFound(res, {
                    user_profile: user.prepareResponse()
                })
            }
        })
        .catch(e => ResponseHelper.returnedError(res, e))
}