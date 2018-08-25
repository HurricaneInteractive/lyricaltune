const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PhrasesHelper = require('../helpers/PhrasesHelper')

const phrasesSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId
    },
    name: {
        type: String,
        required: true,
        index: true
    },
    key: String,
    notes: [String],
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true
    },
    phrases: [
        {
            note: String,
            pattern: [String]
        }
    ],
    words_selected: [String],
    selected_artist: {
        type: String,
        lowercase: true
    },
    selected_song: {
        type: String,
        lowercase: true
    },
    effects: {
        type: Map,
        of: Schema.Types.Mixed
    }
}, {
    timestamps: true,
    strict: true
})

phrasesSchema.loadClass(PhrasesHelper)

const Phrase = mongoose.model('Phrase', phrasesSchema)

Phrase.init().then((Event) => {
    console.log('Phrase finished building')
})

module.exports = Phrase;