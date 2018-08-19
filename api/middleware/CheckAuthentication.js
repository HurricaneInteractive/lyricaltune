const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.jwt_user = decoded
        next()
    }
    catch (error) {
        res.status(401).json({
            error: {
                message: "Authentication Failed",
                status: 401,
                error: error
            }
        })
    }
}