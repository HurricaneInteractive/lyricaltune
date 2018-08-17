module.exports = (req, res, next) => {
    console.log('register user');
    res.status(200).json({
        'message': 'User Created'
    })
}