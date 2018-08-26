const Songs = require('../../models/Songs')

module.exports = (req, res, next) => {
    let id = req.body.id

    Songs.findByIdAndRemove(id).exec()
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