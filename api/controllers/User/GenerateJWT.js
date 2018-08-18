const jwt = require('jsonwebtoken')

const JWTPayload = (user) => {
    return {
        _id: user._id,
        email: user.email,
        username: user.username
    }
}

const SignUserToken = (user, callback) => {
    let payload = JWTPayload(user)
    jwt.sign(payload, process.env.JWT_SECRET, { algorithm: 'HS256' }, (err, token) => {
        return callback(err, token);
    })
}

module.exports = {
    signUserToken: SignUserToken
}