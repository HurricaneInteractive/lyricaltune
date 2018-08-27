const Beats = require('../../models/Beats')
const ResponseHelper = require('../../helpers/ResponseHelper')

const merge = (a, b, prop) => {
    var reduced =  a.filter( aitem => ! b.find ( bitem => aitem[prop] === bitem[prop]) )
    return reduced.concat(b);
}

module.exports = (req, res, next) => {
    let current_user = req.jwt_user,
        id = req.params.id

    Beats.findById(id).exec()
        .then(doc => {
            if (doc === null) {
                return ResponseHelper.beatNotFound(next)
            }

            let author = String(doc.author)
            if (author !== current_user._id) {
                ResponseHelper.requestingDifferentUserBeats(next)
            }
            else {
                let name = req.body.name || String(doc.name),
                    effects = typeof req.body.effects !== 'undefined' && req.body.effects !== null ? Object.assign({}, doc.toJSON().effects, req.body.effects) : doc.effects,
                    beat = typeof req.body.beat !== 'undefined' && req.body.beat !== null ? merge(doc.toJSON().beat, req.body.beat, 'row') : doc.toJSON().beat

                Beats.findOneAndUpdate({ _id: id }, {
                    $set: {
                        name: name,
                        effects: effects,
                        beat: beat
                    }
                }, { new: true }).exec().then(response =>  {
                    ResponseHelper.beatUpdateSuccess(res, { updated: response.toJSON() })
                })
                .catch(e => ResponseHelper.returnedError(res, e) )
            }
        })
        .catch(e => ResponseHelper.returnedError(res, e))
}