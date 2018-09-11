const User = require('../../models/User')
const Phrase = require('../../models/Phrases')
const ResponseHelper = require('../../helpers/ResponseHelper')
const escapeStringRegexp = require('escape-string-regexp');

module.exports = (req, res, next) => {
    let { type, term } = req.body

    let promises = []
    let regexTerm = new RegExp(`.*${escapeStringRegexp(term)}.*`, 'gmi')

    switch (type) {
        case 'user':
            promises.push( User.find({ $or: [ 
                {'username': regexTerm}, 
                {'name': regexTerm} 
            ] }).exec() )
            break
        case 'phrase':
            promises.push( Phrase.find({ $or: [ 
                {'name': regexTerm} 
            ] }).exec() )
            break
        case 'phrase_user':
            promises.push( Phrase.find({ $or: [ 
                {'author_username': regexTerm} 
            ] }).exec() )
            break
        case 'by_song':
            promises.push( Phrase.find({ $or: [ 
                {'selected_song': regexTerm} 
            ] }).exec() )
            break
        case 'by_artist':
            promises.push( Phrase.find({ $or: [ 
                {'selected_artist': regexTerm} 
            ] }).exec() )
            break
        case 'all':
        default:
            promises.push( User.find({ $or: [ 
                {'username': regexTerm}, {'name': regexTerm} 
            ] }).exec() )
            
            promises.push( Phrase.find({ $or: [ 
                {'name': regexTerm}, 
                {'author_username': regexTerm}, 
                {'selected_artist': regexTerm}, 
                {'selected_song': regexTerm} 
            ] }).exec() )
            break
    }

    if (promises.length > 0) {
        Promise.all(promises)
            .then(results => {
                res.status(200).json({
                    results: results
                })
            })
            .catch(e => ResponseHelper.returnedError(res, e))
    }
    else {
        // handle invalid request
        let error = new Error('Invalid search method')
        error.status = 500
        next(error)
    }
}