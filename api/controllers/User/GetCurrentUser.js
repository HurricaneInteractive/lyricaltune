module.exports = (req, res, next) => {
    res.status(200).json({
        current_user: req.jwt_user
    })
}