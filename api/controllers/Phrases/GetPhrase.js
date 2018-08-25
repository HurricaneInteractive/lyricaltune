const Phrase = require('../../models/Phrases')
const ResponseHelper = require('../../helpers/ResponseHelper')

module.exports = (req, res, next) => {
    let id = req.params.id,
        current_user = req.jwt_user

    Phrase.findById(id).exec()
        .then(doc => {
            if (doc === null) {
                ResponseHelper.phraseNotFound(next)
            }
            else {
                if (String(doc.author) !== current_user._id) {
                    ResponseHelper.requestingDifferentUserPhrases(next)
                }
                else {
                    ResponseHelper.phraseFound(res, { phrase: doc.toJSON() })
                }
            }
        })
        .catch(e => ResponseHelper.returnedError(res, e))
}