const Beats = require('../../models/Beats')
const ResponseHelper = require('../../helpers/ResponseHelper') 

module.exports = (req, res, next) => {
    let current_user = req.jwt_user,
        _id = req.params.id

    if (current_user._id === _id) {
        Beats.find({ author: _id }).exec()
            .then(response => {
                ResponseHelper.userBeatsSuccess(res, response)
            })
            .catch(e => ResponseHelper.returnedError(e))
    }
    else {
        ResponseHelper.requestingDifferentUserPhrases(next)
    }
}