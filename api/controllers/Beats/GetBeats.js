const Beats = require('../../models/Beats')

module.exports = (req, res, next) => {
    let id = req.params.id

    Beats.findById(id).exec()
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