const Phrase = require('../../models/Phrases')
const ResponseHelper = require('../../helpers/ResponseHelper')

module.exports = (req, res, next) => {
    let current_user = req.jwt_user,
        phrase_id = req.body.id

    Phrase.findById(phrase_id).exec()
        .then(doc => {
            if (!doc) {
                ResponseHelper.phraseNotFound(next)
            }
            else {
                let meta = doc.meta,
                    likes = meta.likes,
                    user_who_liked = meta.users_who_liked,
                    updateQuery = null
                
                if (user_who_liked.indexOf(current_user._id) > -1) {
                    updateQuery = {
                        $inc: {
                            "meta.likes": -1
                        },
                        $pull: {
                            "meta.users_who_liked": {
                                $in: [current_user._id]
                            }
                        }
                    }
                }
                else {
                    updateQuery = {
                        $inc: {
                            "meta.likes": 1
                        },
                        $push: {
                            "meta.users_who_liked": current_user._id
                        }
                    }
                }

                Phrase.findByIdAndUpdate(phrase_id, updateQuery, {new: true}).exec()
                    .then(updated_phrase => {
                        ResponseHelper.phraseLikeCompleted(res, { updated: updated_phrase.toJSON() })
                    })
                    .catch(e => ResponseHelper.returnedError(res, e))
            }
        })
        .catch(e => ResponseHelper.returnedError(res, e))
}