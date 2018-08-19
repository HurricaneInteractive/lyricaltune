const jwt = require('jsonwebtoken')

/**
 * @deprecated
 * @param {User} user 
 */
const JWTPayload = (user) => {
    return {
        _id: user._id,
        email: user.email,
        username: user.username
    }
}

const SignUserToken = (user, callback) => {
    jwt.sign(user, process.env.JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: '2h',
    }, (err, token) => {
        return callback(err, token);
    })
}

const DecodeToken = (token) => {
    return jwt.decode(token)
}

module.exports = {
    signUserToken: SignUserToken,
    decodeToken: DecodeToken
}