const Phrase = require('../../models/Phrases')
const ResponseHelper = require('../../helpers/ResponseHelper')

const merge = (a, b, prop) => {
    var reduced =  a.filter( aitem => ! b.find ( bitem => aitem[prop] === bitem[prop]) )
    return reduced.concat(b);
}

module.exports = (req, res, next) => {
    let current_user = req.jwt_user,
        id = req.params.id

    Phrase.findById(id).exec()
        .then(doc => {
            let author = String(doc.author)
            if (author !== current_user._id) {
                ResponseHelper.requestingDifferentUserPhrases(next)
            }
            else {
                // let name = req.body.name || String(doc.name),
                //     effects = typeof req.body.effects !== 'undefined' && req.body.effects !== null ? Object.assign({}, doc.toJSON().effects, req.body.effects) : doc.effects,
                //     phrases = typeof req.body.phrases !== 'undefined' && req.body.phrases !== null ? merge(doc.toJSON().phrases, req.body.phrases, 'note') : doc.toJSON().phrases,
                //     album_cover = req.body.album_cover || String(doc.album_cover),
                //     beat = req.body.beat || String(doc.beat)

                Phrase.findOneAndUpdate({ _id: id }, {
                    $set: {
                        ...req.body
                    }
                }, { new: true }).exec().then(response =>  {
                    ResponseHelper.phraseUpdateSuccess(res, { updated: response.toJSON() })
                })
                .catch(e => ResponseHelper.returnedError(res, e) )
            }
        })
        .catch(e => ResponseHelper.returnedError(res, e))
}