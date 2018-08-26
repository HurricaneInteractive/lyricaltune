const Beats = require('../../models/Beats')

module.exports = (req, res, next) => {
    const beats = new Beats({
        // Add contents here
    })

    beats.save()
        .then(createdBeats => {
            // Handle success
        })
        .catch(e => console.error(e))
}