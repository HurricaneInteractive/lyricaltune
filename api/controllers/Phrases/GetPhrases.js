const Phrase = require('../../models/Phrases');
const ResponseHelper = require('../../helpers/ResponseHelper');

module.exports = (req, res, next) => {
    let defaults = {
        limit: 5,
        offset: 0
    }

    let settings = Object.assign(defaults, req.query);

    console.log(settings);

    Phrase.find().sort({'createdAt': -1}).limit(parseInt(settings.limit)).skip(parseInt(settings.offset)).exec()
        .then(docs => {
            Phrase.estimatedDocumentCount().exec()
                .then(count => {
                    ResponseHelper.foundPhrases(res, {
                        phrases: docs,
                        next: parseInt(settings.limit) + parseInt(settings.offset),
                        count: count
                    })
                })
        })
        .catch(e => ResponseHelper.returnedError(res, e))
}