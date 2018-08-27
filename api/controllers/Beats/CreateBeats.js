const Beats = require('../../models/Beats')
const User = require('../../models/User')
const ResponseHelper = require('../../helpers/ResponseHelper')

module.exports = (req, res, next) => {
    const current_user = req.jwt_user

    User.findOne({ _id: current_user._id }).exec()
        .then(user => {
            if (user === null) {
                ResponseHelper.noUserWithId(current_user._id, next)
            }
            else {
                let body = {...req.body}
                body.author = user._id
                
                const beats = new Beats(body)

                beats.save()
                    .then(createdBeats => {
                        Beats.find({ author: user._id }).exec()
                            .then(docs => {
                                ResponseHelper.beatCreated(res, { beats: docs })
                            })
                            .catch(e => ResponseHelper.returnedError(res, e))
                    })
                    .catch(e => ResponseHelper.returnedError(res, e))
            }
        })
        .catch(e => ResponseHelper.returnedError(res, e))
}