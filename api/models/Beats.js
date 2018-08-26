const mongoose = require('mongoose')
const Schema = mongoose.Schema
const BeatsHelper = require('../helpers/BeatsHelper')

const beatsSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId
    },
    name: {
        type: String,
        required: true,
        index: true
    },
    effects: {
        type: Map,
        of: Schema.Types.Mixed
    },
    beat: {
        type: Map,
        of: Object
    },
    author: Schema.Types.ObjectId
}, {
    timestamps: true,
    strict: true
})

beatsSchema.loadClass(BeatsHelper)

const Beats = mongoose.model('Beats', beatsSchema)

Beats.init().then((Event) => {
    console.log('Beats finished building')
})

module.exports = Beats;