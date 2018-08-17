const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const UserHelper = require('../helpers/UserHelper')

const userSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId
    },
    name: String,
    username: {
        type: String,
        required: true,
        index: true,
        unqiue: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    followers: [String],
    following: [String],
    websites: [String],
    role: {
        type: String,
        default: 'author'
    }
}, {
    timestamps: true
})

userSchema.loadClass(UserHelper)

const User = mongoose.model('User', userSchema);

User.init().then((Event) => {
    console.log('User finished building')
})

module.exports = User;