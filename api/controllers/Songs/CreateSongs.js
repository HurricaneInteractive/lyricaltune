const Songs = require('../../models/Songs')

module.exports = (req, res, next) => {
    const songs = new Songs({
        // Add contents here
    })

    songs.save()
        .then(createdSongs => {
            // Handle success
        })
        .catch(e => console.error(e))
}