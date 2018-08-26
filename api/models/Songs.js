const mongoose = require('mongoose')
const Schema = mongoose.Schema
const SongsHelper = require('../helpers/SongsHelper')

const songsSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId
    }
}, {
    timestamps: true,
    strict: true
})

songsSchema.loadClass(SongsHelper)

const Songs = mongoose.model('Songs', songsSchema)

Songs.init().then((Event) => {
    console.log('Songs finished building')
})

module.exports = Songs;