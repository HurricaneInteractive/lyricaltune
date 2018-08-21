const Phrase = require('../../models/Phrases')
const ResponseHelper = require('../../helpers/ResponseHelper')

module.exports = (req, res, next) => {
    let current_user = req.jwt_user
    const body = {...req.body}
    body.author = current_user._id

    const phrase = new Phrase(body)

    phrase.save()
        .then(createdPhrase => {
            Phrase.find({ author: current_user._id }).exec()
                .then(response => {
                    ResponseHelper.phraseSavedSuccessfully(res, createdPhrase.name, response)
                })
                .catch(e => ResponseHelper.returnedError(res, e))
        })
        .catch(e => ResponseHelper.returnedError(res, e))
}