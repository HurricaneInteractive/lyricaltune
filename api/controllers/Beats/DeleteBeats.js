const Beats = require('../../models/Beats')

module.exports = (req, res, next) => {
    let id = req.body.id

    Beats.findByIdAndRemove(id).exec()
        .then(doc => {
            if (doc === null) {
                // Handle no document found
            }
            else {
                // Handle delete success
            }
        })
        .catch(e => console.error(e))
}