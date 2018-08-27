const User = require('../../models/User')
const Beats = require('../../models/Beats')
const ResponseHelper = require('../../helpers/ResponseHelper')

module.exports = (req, res, next) => {
    let current_user = req.jwt_user

    User.findOne({ _id: current_user._id }).exec()
        .then(user => {
            if (user === null) {
                ResponseHelper.noUserWithId(current_user._id, next)
            }

            Beats.findByIdAndRemove(req.body.id).exec()
                .then(doc => {
                    if (doc === null) {
                        ResponseHelper.beatNotFound(next)
                    }
                    else {
                        ResponseHelper.beatDeletedSuccessfully(res, { removed: doc.toJSON() })
                    }
                })
                .catch(e => ResponseHelper.returnedError(res, e))
        })
        .catch(e => ResponseHelper.returnedError(res, e))
}