const Beats = require('../../models/Beats')
const ResponseHelper = require('../../helpers/ResponseHelper')

module.exports = (req, res, next) => {
    let id = req.params.id,
        current_user = req.jwt_user

    Beats.findById(id).exec()
        .then(doc => {
            if (doc === null) {
                ResponseHelper.beatNotFound(next)
            }
            else {
                if (String(doc.author) !== current_user._id) {
                    ResponseHelper.requestingDifferentUserBeats(next)
                }
                else {
                    ResponseHelper.beatFound(res, { beat: doc.toJSON() })
                }
            }
        })
        .catch(e => ResponseHelper.returnedError(res, e))
}