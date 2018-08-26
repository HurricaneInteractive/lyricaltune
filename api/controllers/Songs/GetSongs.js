const Songs = require('../../models/Songs')

module.exports = (req, res, next) => {
    let id = req.params.id

    Songs.findById(id).exec()
        .then(doc => {
            if (doc === null) {
                // Handle Empty response
            }
            else {
                // Handle Success
            }
        })
        .catch(e => console.error(e))
}