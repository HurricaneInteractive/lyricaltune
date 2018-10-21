const Phrase = require('../../models/Phrases');
const ResponseHelper = require('../../helpers/ResponseHelper');

module.exports = (req, res, next) => {
    const limit = 50;
    let defaults = {
        limit: limit
    }

    let settings = Object.assign(defaults, req.body.settings);

    Phrase.find().sort({'data': -1}).limit(settings.limit).exec()
        .then(docs => {
            ResponseHelper.foundPhrases(res, {
                phrases: docs
            })
        })
        .catch(e => ResponseHelper.returnedError(res, e))
}