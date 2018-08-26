const Beats = require('../../models/Beats')

module.exports = (req, res, next) => {
    let id = req.params.id

    Beats.findOneAndUpdate({ _id: id }, {
        $set: {
            // Add updates here
        }
    }, { new: true }).exec().then(updated_doc => {
        // Handle success
    })
    .catch(e => console.error(e))
}