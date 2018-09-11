const Phrase = require('../../models/Phrases')
const ResponseHelper = require('../../helpers/ResponseHelper') 

module.exports = (req, res, next) => {
    // let current_user = req.jwt_user,
    let _id = req.params.id

    // if (current_user._id === _id) {
        Phrase.find({ author: _id }).exec()
            .then(response => {
                ResponseHelper.userPhrasesSuccess(res, response)
            })
            .catch(e => ResponseHelper.returnedError(e))
    // }
    // else {
        // ResponseHelper.requestingDifferentUserPhrases(next)
    // }
}