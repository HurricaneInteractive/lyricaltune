const User = require('../../models/User')
const Phrase = require('../../models/Phrases')
const ResponseHelper = require('../../helpers/ResponseHelper')

module.exports = (req, res, next) => {
    let current_user = req.jwt_user

    User.findOne({ _id: current_user._id }).exec()
        .then(user => {

            if (user === null) {
                ResponseHelper.noUserWithId(current_user._id, next);
            }

            const body = {...req.body}
            body.author = user._id
            body.author_username = user.username

            const phrase = new Phrase(body)
        
            phrase.save()
                .then(createdPhrase => {
                    Phrase.find({ author: user._id }).exec()
                        .then(response => {
                            ResponseHelper.phraseSavedSuccessfully(res, createdPhrase.name, response)
                        })
                        .catch(e => ResponseHelper.returnedError(res, e))
                })
                .catch(e => ResponseHelper.returnedError(res, e))
        })
        .catch(e => ResponseHelper.returnedError(res, e))
}