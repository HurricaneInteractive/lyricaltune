const User = require('../../models/User')
const ResponseHelper = require('../../helpers/ResponseHelper')

module.exports = (req, res, next) => {
    let id = req.params.id
    User.findOne({ _id: id }).exec()
        .then(user => {
            if (user === null) {
                ResponseHelper.noUserWithId(id, next)
            }
            else {
                ResponseHelper.userFound(res, {
                    user_profile: user.prepareResponse()
                })
            }
        })
        .catch(e => ResponseHelper.returnedError(res, e))
}